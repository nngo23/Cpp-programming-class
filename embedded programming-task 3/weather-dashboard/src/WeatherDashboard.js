import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const WS_SERVER = "ws://localhost:9100/";

export default function LiveWeatherDashboard() {
  const [records, setRecords] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  const connectWebSocket = () => {
    const ws = new WebSocket(WS_SERVER);
    wsRef.current = ws;

    ws.onopen = () => console.log("WebSocket connection established ✅");

    ws.onmessage = (event) => {
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
    };

    ws.onclose = () => {
      console.log("WebSocket closed, reconnecting in 2s...");
      reconnectTimer.current = setTimeout(connectWebSocket, 2000);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err.message);
      ws.close();
    };
  };

  useEffect(() => {
    // Small delay to ensure WS server is ready
    const timeout = setTimeout(connectWebSocket, 500);
    return () => {
      clearTimeout(timeout);
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Weather Station Dashboard</h2>

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
