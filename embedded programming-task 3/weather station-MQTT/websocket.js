const WebSocket = require("ws");
const http = require("http");
const https = require("https");
const fs = require("fs");

const WS_PORT = process.env.WS_PORT || 9000;
const USE_SSL = process.env.USE_SSL === "true";

let server;

if (USE_SSL) {
  server = https.createServer({
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  });
  console.log("WSS server using HTTPS");
} else {
  server = http.createServer();
  console.log("WS server using HTTP");
}

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("close", () => console.log("Client disconnected"));
});

function broadcastToClients(payload) {
  const text = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(text);
    }
  }
}

// Log exactly when server is ready
server.listen(WS_PORT, () =>
  console.log(`${USE_SSL ? "WSS" : "WS"} server running on port ${WS_PORT} ✅ Ready for connections`)
);

module.exports = { broadcastToClients };