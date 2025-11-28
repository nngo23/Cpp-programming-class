#include <WiFi.h>
#include "DHT.h"
#include <PubSubClient.h>

// WiFi for Wokwi
const char* wifiSSID  = "Wokwi-GUEST";
const char* wifiPass  = "";   // MISSING SEMICOLON FIXED

// MQTT Broker settings
const char* mqttServer = "broker.hivemq.com";
const int   mqttPort   = 1883;
const char* mqttTopic  = "weather";

// Sensor pins
#define DHTpin     16
#define LDRpin     28
#define buzzerPin   8
#define DHTtype  DHT22

DHT dht(DHTpin, DHTtype);   // dht object declared CORRECTLY
WiFiClient wifiClient;
PubSubClient mqtt(wifiClient);

// auto-reconnect MQTT
void ensureMQTT() {
  while (!mqtt.connected()) {
    Serial1.print("Connecting to MQTT...");
    if (mqtt.connect("PicoW_Weather_Node")) {
      Serial1.println(" connected.");
    } else {
      Serial1.print("Error: ");
      Serial1.println(mqtt.state());
      delay(1000);
    }
  }
}

void setup() {
  Serial1.begin(115200);
  delay(200);

  Serial1.println("Weather Station (DHT22 + LDR + MQTT)");

  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);

  dht.begin();       // FIX: dht object is now declared properly

  // Begin WiFi
  Serial1.print("Connecting to WiFi");
  WiFi.begin(wifiSSID, wifiPass);   // FIX: wifiPass now exists!
  while (WiFi.status() != WL_CONNECTED) {
    Serial1.print(".");
    delay(500);
  }
  Serial1.println("\nWiFi connected.");
  Serial1.print("IP Address: ");
  Serial1.println(WiFi.localIP());

  mqtt.setServer(mqttServer, mqttPort);   // FIX: mqttServer + mqttPort declared correctly
  ensureMQTT();
}

void loop() {
  if (!mqtt.connected()) {
    ensureMQTT();
  }
  mqtt.loop();

  float temp  = dht.readTemperature();   // FIX: dht now exists
  float humid = dht.readHumidity();
  int light   = analogRead(LDRpin);

  if (isnan(temp) || isnan(humid)) {
    Serial1.println("DHT22 error.");
    delay(2000);
    return;
  }

  Serial1.print("Temp: ");
  Serial1.print(temp);
  Serial1.print(" °C | Humidity: ");
  Serial1.print(humid);
  Serial1.print(" % | Light: ");
  Serial1.println(light);

  if (temp > 35 || humid > 80) {
    Serial1.println("ALERT: Extreme sensor reading!");
    tone(buzzerPin, 1000);
    delay(600);
    noTone(buzzerPin);
  } else {
    noTone(buzzerPin);
  }

  char msg[250];
  snprintf(msg, sizeof(msg),
    "{\"temperature\":%.2f,\"humidity\":%.2f,\"light\":%d}",
    temp, humid, light);

  mqtt.publish(mqttTopic, msg);  // FIX: mqttTopic declared correctly

  Serial1.print("Sent MQTT: ");
  Serial1.println(msg);

  delay(10000);

}
