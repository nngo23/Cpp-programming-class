**Networked Weather Station — Pico W, MQTT & Web Dashboard
Introduction**
This project presents a connected weather monitoring platform built around a Raspberry Pi Pico W, simulated using Wokwi. Sensor readings are transmitted over MQTT, stored in a local database, streamed live to a web interface, and used to generate automated alert notifications.

The solution demonstrates how embedded systems integrate with backend services, databases, real-time communication, and modern frontend frameworks.

**System overview**
This project presents an end-to-end IoT weather station. At the center is a Raspberry Pi Pico W running in Wokwi, measuring temperature, humidity, and light. The Pico publishes its data as JSON over MQTT to the HiveMQ broker, acting as the communication bridge.

On my computer, a Node.js backend subscribes to the same MQTT topic. It stores every reading into a SQLite database, exposes an API to access the data, streams live updates through WebSockets, and even sends alerts to my Discord channel when thresholds are exceeded.

I built a React dashboard that uses both the API and WebSockets to show live bar charts for temperature, humidity, and light, with instant updates as the Pico sends new readings.

Overall, this project forms a complete IoT pipeline—from embedded sensing to cloud messaging, backend processing, database storage, dashboards, and real-time alerts.

**Hardware & simulation details**
Sensors installed
DHT22 — Temperature and humidity sensing
LDR — Light level detection
Buzzer — Audible warning output

**Controller platform**
Raspberry Pi Pico W
Simulated through Wokwi
Developed using C++ (Arduino environment)

**Messaging & data transport**
Protocol used: MQTT
Broker service: broker.hivemq.com
Topic name: weather

Example data packet:
{
  "temperature": 24.00,
  "humidity": 40.00,
  "light": 250
}

**Backend service (Node.js)**
Key responsibilities
Subscribes to MQTT topics for sensor updates
Stores incoming data in an SQLite database
Pushes live updates using WebSocket
Sends warning alerts via Discord webhook
Provides HTTP endpoints for data access
Handles basic user authentication

**Active network ports**
Component	Port
REST API	8000
WebSocket	9000
Frontend	3000

**Data storage (SQLite)**
Database tables
measurements: temperature, humidity, light, timestamp
accounts: username, password hash

**HTTP API routes**
Path	            Method	Description
/weather/latest	    GET	    Returns the newest reading
/weather/history	GET	    Returns previous records
/auth/register	    POST	Creates a user account
/auth/login	        POST	Authenticates a user

**Frontend dashboard (React)**
Dashboard features: 
Real-time updates without manual refresh
Live data streaming through WebSocket
Separate bar charts for:
Temperature
Humidity
Light intensity

**Alert notifications (Discord)**
Alerts are triggered when sensor readings exceed configured thresholds
Messages are sent automatically using Discord Webhooks

Example notification
Warning!
Weather sensor limits exceeded.

**Setup & execution**
Step 1 — Run backend services
npm install
node backend.js

Expected console output:
WebSocket channel active on port 9101
API running on port 8000
MQTT connected

Step 2 — Start the web niterface
cd dashboard
npm install
npm start

Open in browser:
http://localhost:3000

Step 3 — Launch Wokwi simulation

Open Wokwi

Select Raspberry Pi Pico W
Upload sketch.ino
Start the simulation

**Configuration file (.env)**
MQTT_URL=mqtt://broker.hivemq.com
MQTT_TOPIC=weather
HTTP_PORT=8000
WS_PORT=9101

DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/1422173095879507969/vQQ_ksXiJe_mSFKglShgpuzaATHC7zKMErb2a8P5h2xIr5-OQ9oLkvYLgMrcHVGzDGtH

THRESHOLD_TEMP=30
THRESHOLD_HUMIDITY=80

**Technologies used**
Raspberry Pi Pico W
C++ (Arduino SDK)
MQTT (HiveMQ Broker)
Node.js & Express
SQLite3
WebSocket
React.js
Discord Webhooks

**Closing remarks:**
This project delivers a complete IoT weather monitoring pipeline, covering data acquisition, wireless communication, backend processing, persistent storage, live visualization, and automated alerting. It highlights how embedded devices and web technologies can work together in a practical real-world system.
