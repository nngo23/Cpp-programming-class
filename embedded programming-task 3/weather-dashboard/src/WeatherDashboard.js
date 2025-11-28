import React, { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const WS_SERVER = "ws://localhost:9000"; 

export default function LiveWeatherDashboard() {
  const [records, setRecords] = useState([])

  useEffect(() => {
    const ws = new WebSocket(WS_SERVER)

    ws.onopen = () => console.log("WebSocket connection established")
    ws.onmessage = (event) => {
      const measurement = JSON.parse(event.data)

      setRecords(prev => [
        ...prev.slice(-19), 
        {
          time: new Date(measurement.time).toLocaleTimeString(),
          temperature: measurement.temperature,
          humidity: measurement.humidity,
          light: measurement.light
        }
      ]);
    };

    ws.onclose = () => console.log("WebSocket connection closed")

    return () => ws.close()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Weather Station Dashboard</h2>

      {/* Temperature Chart */}
      <h3>Temperature (°C)</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="temperature" fill="#FF5733" />
      </BarChart>

      {/* Humidity Chart */}
      <h3>Humidity (%)</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="humidity" fill="#33A852" />
      </BarChart>

      {/* Light Chart */}
      <h3>Light Level</h3>
      <BarChart width={800} height={250} data={records}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="light" fill="#3358A8" />
      </BarChart>
    </div>
  )
}
