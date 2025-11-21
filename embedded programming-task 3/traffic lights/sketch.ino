const int red = 7;       
const int yellow = 9;    
const int green = 8;     
const int buzzer = 27;    
const int button = 4;    

void setup() {
  pinMode(red, OUTPUT);
  pinMode(yellow, OUTPUT);
  pinMode(green, OUTPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(button, INPUT_PULLUP);   
  
  digitalWrite(red, LOW);
  digitalWrite(yellow, LOW);
  digitalWrite(green, LOW);
}

void loop() {
  if (digitalRead(button) == LOW) {
    digitalWrite(red, HIGH);
    digitalWrite(yellow, LOW);
    digitalWrite(green, LOW);
    digitalWrite(buzzer, HIGH);

    delay(1000);           
    digitalWrite(buzzer, LOW);
    delay(500);           
  } 
  else {
    digitalWrite(green, HIGH);    
    digitalWrite(yellow, LOW);
    digitalWrite(red, LOW);
    delay(1000);

    digitalWrite(green, LOW);    
    digitalWrite(yellow, HIGH);
    delay(500);

    digitalWrite(yellow, LOW);    
    digitalWrite(red, HIGH);
    delay(1000);
  }
}

