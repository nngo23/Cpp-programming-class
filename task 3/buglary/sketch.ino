const int PIR = 18;    
int lastState = LOW;         

void setup() {
  pinMode(PIR, INPUT);   
  Serial1.begin(115200);        

  Serial1.println("Calibrating motion sensor, please wait...");
  delay(5000);  
  Serial1.println("Sensor ready! Monitoring for movement...");
}

void loop() {
  int currentState = digitalRead(PIR); 

  if (currentState == HIGH && lastState == LOW) {
    Serial1.println("Motion detected!");
    lastState = HIGH;
  } 
  else if (currentState == LOW && lastState == HIGH) {
    Serial1.println("No movement detected.");
    lastState = LOW;
  }

  delay(300); 
}

