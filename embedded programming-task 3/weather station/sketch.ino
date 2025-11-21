#include "DHT.h"

#define sensorPin 17     
#define sensorType DHT22  

DHT weatherSensor(sensorPin, sensorType);  

void setup() {
  Serial1.begin(115200);
  Serial1.println("Initializing DHT22 sensor...");
  weatherSensor.begin();   
  delay(2000);             
}

void loop() {
  float humidityValue = weatherSensor.readHumidity();        
  float temperatureValue = weatherSensor.readTemperature(); 

  if (isnan(humidityValue) || isnan(temperatureValue)) {
    Serial1.println("Error: Failed to read data from DHT22 sensor!");
  } else {
    Serial1.print("Temperature: ");
    Serial1.print(temperatureValue);
    Serial1.print(" °C | Humidity: ");
    Serial1.print(humidityValue);
    Serial1.println(" %");
  }

  delay(1000); 
}
