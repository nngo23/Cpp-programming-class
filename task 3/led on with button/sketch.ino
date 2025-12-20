const int ledPin = 26;     
const int buttonPin = 12;


void setup() {
  pinMode(ledPin, OUTPUT);                
  pinMode(buttonPin, INPUT_PULLUP);  
}

void loop() {
  int buttonState = digitalRead(buttonPin); 

  if (buttonState == LOW) { 
    digitalWrite(ledPin, HIGH); 
  } else {                   
    digitalWrite(ledPin, LOW);   
  }
}

