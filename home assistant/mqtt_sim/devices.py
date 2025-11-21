import paho.mqtt.client as mqtt

broker = "127.0.0.1"
port = 1883

def on_message(client, userdata, msg):
    print(f"[DEVICE] {msg.topic}: {msg.payload.decode()}")

client = mqtt.Client("Device1")
client.on_message = on_message
client.connect(broker, port)
client.loop_start()

client.subscribe("home/led/set")

try:
    while True:
        pass  # Device reacts to HA commands
except KeyboardInterrupt:
    print("Exiting device simulation")
    client.loop_stop()


