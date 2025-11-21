#include <WiFi.h>
#include "DHT.h"
#include "ThingSpeak.h"

const char* wifiSSID = "Wokwi-GUEST";
const char* wifiPass = "";

unsigned long channelId = 3121647;          
const char* apiKey = "BCTD72NH4ZY0MIDS";  


#define DHT_Pin 16
#define LDR_Pin 28
#define buzzerPin 8
#define DHT_type DHT22

DHT sensor(DHT_Pin, DHT_type);
WiFiClient wifiClient;

void setup() {
  Serial1.begin(115200);
  delay(100);
  Serial1.println("IoT Weather Station (DHT22 + LDR + Buzzer)");

  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);

  sensor.begin();

  Serial1.print("Connecting to Wi-Fi");
  WiFi.begin(wifiSSID, wifiPass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial1.print(".");
  }
  Serial1.println("\n Wi-Fi connected!");
  Serial1.print("IP Address: ");
  Serial1.println(WiFi.localIP());

  ThingSpeak.begin(wifiClient);
}

void loop() {
  float tempC = sensor.readTemperature();
  float humidity = sensor.readHumidity();
  int lightLevel = analogRead(LDR_Pin);

  if (isnan(tempC) || isnan(humidity)) {
    Serial1.println("DHT22 reading failed!");
    delay(2000);
    return;
  }

  Serial1.print("Temp: ");
  Serial1.print(tempC);
  Serial1.print(" °C | Humidity: ");
  Serial1.print(humidity);
  Serial1.print(" % | Light: ");
  Serial1.println(lightLevel);

  if (tempC > 35 || humidity > 80) {
    Serial1.println("Warning: High temperature or humidity!");
    tone(buzzerPin, 1000);
    delay(1000);
    noTone(buzzerPin);
  } else {
    noTone(buzzerPin);
  }

  ThingSpeak.setField(1, tempC);
  ThingSpeak.setField(2, humidity);
  ThingSpeak.setField(3, lightLevel);

  int response = ThingSpeak.writeFields(channelId, apiKey);

  if (response == 200) {
    Serial1.println("Data sent to ThingSpeak!");
  } else {
    Serial1.print("Upload failed. Error code: ");
    Serial1.println(response);
  }

  delay(10000);  
}
