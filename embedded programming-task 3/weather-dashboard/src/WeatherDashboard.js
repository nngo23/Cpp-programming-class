import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const WS_SERVER = "ws://localhost:9101/";

export default function LiveWeatherDashboard() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("Connecting...");
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const reconnectDelay = useRef(3000); // initial reconnect delay

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(WS_SERVER);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        setStatus("Connected");
        reconnectDelay.current = 3000; // reset delay after successful connection
      };

      ws.onmessage = (event) => {
        try {
          const measurement = JSON.parse(event.data);
          setRecords((prev) => [
            ...prev.slice(-19),
            {
              time: new Date(measurement.time).toLocaleTimeString(),
              temperature: measurement.temperature,
              humidity: measurement.humidity,
              light: measurement.light,
            },
          ]);
        } catch (err) {
          console.error("Invalid message format:", err);
        }
      };

      ws.onclose = () => {
        console.log(`WebSocket closed, reconnecting in ${reconnectDelay.current / 1000}s...`);
        setStatus("Disconnected, reconnecting...");
        if (!reconnectTimer.current) {
          reconnectTimer.current = setTimeout(() => {
            reconnectTimer.current = null;
            reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 30000); // exponential backoff up to 30s
            connectWebSocket();
          }, reconnectDelay.current);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket error (ignored, will retry):", err.message);
        ws.close();
      };
    } catch (err) {
      console.error("WebSocket failed to start:", err.message);
      reconnectTimer.current = setTimeout(connectWebSocket, reconnectDelay.current);
    }
  };

  useEffect(() => {
    const initialTimeout = setTimeout(connectWebSocket, 500); // wait 0.5s before first connect
    return () => {
      clearTimeout(initialTimeout);
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Live Weather Station Dashboard</h2>
      <p>Status: {status}</p>

      <h3>Temperature (°C)</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="temperature" fill="#FF5733" />
      </BarChart>

      <h3>Humidity (%)</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="humidity" fill="#33A852" />
      </BarChart>

      <h3>Light Level</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="light" fill="#3358A8" />
      </BarChart>
    </div>
  );
}
