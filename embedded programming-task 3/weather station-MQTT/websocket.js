const WebSocket = require("ws")

function bootWebSocket(port = 9000) {
  const socketSrv = new WebSocket.Server({ port })

  console.log(`WebSocket channel active on port ${port}`)

  function broadcastToClients(payload) {
    const text = JSON.stringify(payload)
    for (const client of socketSrv.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text)
      }
    }
  }

  return { socketSrv, broadcastToClients }
}

module.exports = bootWebSocket