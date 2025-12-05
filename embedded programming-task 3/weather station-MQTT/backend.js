require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");

const db = require("./database");
const { broadcastToClients } = require("./websocket");
const dispatchWebhook = require("./webhook");

const BROKER = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const MQTT_FEED = process.env.MQTT_TOPIC || "weather";
const HOOK_TARGET = process.env.DISCORD_WEBHOOK_URL || "";

const WARN_TEMP = Number(process.env.THRESHOLD_TEMP || 30);
const WARN_HUM = Number(process.env.THRESHOLD_HUMIDITY || 80);
const HTTP_PORT = process.env.HTTP_PORT || 8000;

const app = express();
app.use(express.json());

// API endpoints
app.get("/weather/latest", async (_req, res) => {
  const entries = await db.getMeasurements(1);
  res.json(entries[0] || {});
});

app.get("/weather/history", async (req, res) => {
  const amount = req.query.limit || 100;
  const rows = await db.getMeasurements(amount);
  res.json(rows);
});

app.post("/auth/register", async (req, res) => {
  try {
    await db.register(req.body.username, req.body.password);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.post("/auth/login", async (req, res) => {
  const valid = await db.login(req.body.username, req.body.password);
  res.json({ ok: valid });
});

app.listen(HTTP_PORT, () =>
  console.log(`Backend API running on port ${HTTP_PORT}`)
);

// MQTT setup
const mqttClient = mqtt.connect(BROKER);

mqttClient.on("connect", () => {
  console.log("MQTT online:", BROKER);
  mqttClient.subscribe(MQTT_FEED);
});

mqttClient.on("message", async (_topic, buffer) => {
  try {
    const payload = JSON.parse(buffer.toString());
    const { temperature, humidity, light } = payload;

    await db.addMeasurement(temperature, humidity, light);

    // Broadcast to WebSocket clients
    broadcastToClients({ ...payload, time: new Date().toISOString() });

    // Send webhook if thresholds exceeded
    const alertNeeded = temperature > WARN_TEMP || humidity > WARN_HUM;
    if (HOOK_TARGET && alertNeeded) {
      dispatchWebhook(HOOK_TARGET, {
        content: `Alert triggered!\nTemp: ${temperature}°C\nHumidity: ${humidity}%`,
      });
    }
  } catch (err) {
    console.error("Error processing MQTT message:", err.message);
  }
});