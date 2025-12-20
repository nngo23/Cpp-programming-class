String name;
const int onboardLed = LED_BUILTIN;
const unsigned long blinkTime = 200;
bool ledOn = false;               
unsigned long lastBlinkTime = 0;
const int ext_led = 10;  

void setup() {
  Serial1.begin(115200);
  for (int i = 0; i < 10; i++) {
    Serial1.println(i);
    delay(300);
  }
  
  Serial1.print("What's your name? ");

  pinMode(onboardLed, OUTPUT); 
  pinMode(ext_led, OUTPUT);    

}

void loop() {
  if (Serial1.available() > 0) {
    name = Serial1.readStringUntil('\n'); 
    name.trim(); 
    Serial1.println(name);

    if (name == "Clark Kent") {
      Serial1.println("You are the Superman.");
    } else {
      Serial1.println("You are an ordinary person.");
    }
  }

  unsigned long currentTime = millis();
  if (currentTime - lastBlinkTime >= blinkTime) {
    lastBlinkTime = currentTime;
    ledOn = !ledOn;
    digitalWrite(onboardLed, ledOn);
  }

  digitalWrite(ext_led, HIGH);  
  delay(600);                   
  digitalWrite(ext_led, LOW);   
  delay(600); 

}

