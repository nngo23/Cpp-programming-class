require("dotenv").config();
const express = require("express");
const mqtt = require("mqtt");
const WebSocket = require("ws");
const http = require("http");

const db = require("./database");
const dispatchWebhook = require("./webhook");

// Config from .env
const broker = process.env.MQTT_URL || "mqtt://broker.hivemq.com";
const mqttFeed = process.env.MQTT_TOPIC || "weather";
const hookTarget = process.env.DISCORD_WEBHOOK_URL || "";

const warnTemp = Number(process.env.THRESHOLD_TEMP || 30);
const warnHum = Number(process.env.THRESHOLD_HUMIDITY || 80);
const httpPort = process.env.HTTP_PORT || 8000;
const wsPort = process.env.WS_PORT || 9101;

// ======== Express API ========
const app = express();
app.use(express.json());

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

// Start HTTP API
app.listen(httpPort, () => {
  console.log(`Backend API running on port ${httpPort}`);
});

// ======== WebSocket Server ========
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  ws.on("close", () => console.log("Client disconnected"));
});

// Function to broadcast MQTT data to all connected WS clients
function broadcastToClients(payload) {
  const text = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(text);
    }
  }
}

// Start WS server
server.listen(wsPort, () => {
  console.log(`WS server running on port ${wsPort} — Ready for connections`);
});

// ======== MQTT Client ========
const mqttClient = mqtt.connect(broker);

mqttClient.on("connect", () => {
  console.log("MQTT online:", broker);
  mqttClient.subscribe(mqttFeed);
});

mqttClient.on("message", async (_topic, buffer) => {
  try {
    const payload = JSON.parse(buffer.toString());
    const { temperature, humidity, light } = payload;

    // Save to database
    await db.addMeasurement(temperature, humidity, light);

    // Broadcast to WebSocket clients
    broadcastToClients({ ...payload, time: new Date().toISOString() });

    // Send Discord alert if needed
    const alertNeeded = temperature > warnTemp || humidity > warnHum;
    if (hookTarget && alertNeeded) {
      dispatchWebhook(hookTarget, {
        content: `Alert triggered!\nTemp: ${temperature}°C\nHumidity: ${humidity}%`,
      });
    }
  } catch (err) {
    console.error("Error processing MQTT message:", err.message);
  }
});
