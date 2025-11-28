require("dotenv").config()

const express = require("express")
const mqtt = require("mqtt")

const db = require("./database")
const wsInit = require("./websocket")
const dispatchWebhook = require("./webhook")

// Environment settings
const BROKER      = process.env.MQTT_URL || "mqtt://broker.hivemq.com"
const MQTT_FEED   = process.env.MQTT_TOPIC || "weather"
const HOOK_TARGET = process.env.DISCORD_WEBHOOK_URL || ""

const WARN_TEMP   = Number(process.env.THRESHOLD_TEMP || 30)
const WARN_HUM    = Number(process.env.THRESHOLD_HUMIDITY || 80)

// Ports
const HTTP_PORT = 8000
const WS_PORT   = 9000

// Express server
const app = express()
app.use(express.json())

// WebSocket startup
const { broadcastToClients } = wsInit(WS_PORT)

// REST endpoints
app.get("/weather/latest", async (_req, res) => {
  const entries = await db.getMeasurements(1)
  res.json(entries[0] || {})
})

app.get("/weather/history", async (req, res) => {
  const amount = req.query.limit || 100
  const rows = await db.getMeasurements(amount)
  res.json(rows)
})

app.post("/auth/register", async (req, res) => {
  try {
    await db.register(req.body.username, req.body.password)
    res.json({ success: true })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
})

app.post("/auth/login", async (req, res) => {
  const valid = await db.login(req.body.username, req.body.password)
  res.json({ ok: valid })
})

app.listen(HTTP_PORT, () =>
  console.log(`API is running on port ${HTTP_PORT}`)
)

// MQTT connection
const mqttClient = mqtt.connect(BROKER)

mqttClient.on("connect", () => {
  console.log("MQTT online:", BROKER)
  mqttClient.subscribe(MQTT_FEED)
})

// Process incoming sensor packets
mqttClient.on("message", async (_topic, buffer) => {
  const payload = JSON.parse(buffer.toString())
  const { temperature, humidity, light } = payload

  // Store in DB
  await db.addMeasurement(temperature, humidity, light)

  // Live broadcast
  broadcastToClients({
    ...payload,
    time: new Date().toISOString()
  });

  // Send alert webhook
  const alertNeeded =
    temperature > WARN_TEMP || humidity > WARN_HUM

  if (HOOK_TARGET && alertNeeded) {
    dispatchWebhook(HOOK_TARGET, {
      content: `Alert triggered!
                Temp: ${temperature}°C
                Humidity: ${humidity}%`
    })
  }
})