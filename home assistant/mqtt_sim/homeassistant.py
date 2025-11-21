import time
import paho.mqtt.client as mqtt

# MQTT Configuration
broker = "127.0.0.1"
port = 1883

# Callback when a message is received
def on_message(client, userdata, msg):
    print(f"[HA] Received {msg.topic}: {msg.payload.decode()}")
    # Example automation: turn on virtual LED if temperature > 28
    if msg.topic == "home/temperature":
        if float(msg.payload.decode()) > 28:
            client.publish("home/led/set", "ON")
        else:
            client.publish("home/led/set", "OFF")

# Connect to broker
client = mqtt.Client("HA_sim")
client.on_message = on_message
client.connect(broker, port)
client.loop_start()

# Subscribe to sensor topics
client.subscribe("home/temperature")

# Simulate publishing sensor data periodically
try:
    while True:
        temp = input("Enter current temperature: ")  # Simulated sensor
        client.publish("home/temperature", temp)
        time.sleep(1)
except KeyboardInterrupt:
    print("Exiting HA simulation")
    client.loop_stop()


