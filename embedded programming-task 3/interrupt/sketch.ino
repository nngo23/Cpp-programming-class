const int led = 12;         
const int button = 18;      

unsigned long startTime = 0; 
unsigned long reactionTime = 0;
bool waitingForPress = false;  

void setup() {
  pinMode(led, OUTPUT);
  pinMode(button, INPUT_PULLUP); 
  Serial1.begin(115200);

  randomSeed(analogRead(0)); 
  Serial1.println("Reaction game Started!");
  Serial1.println("When the LED turns OFF, press the button as fast as possible!");
}

void loop() {
  digitalWrite(led, HIGH);
  delay(random(1000, 5000));

  digitalWrite(led, LOW);
  startTime = millis();
  waitingForPress = true;

  while (waitingForPress) {
    if (digitalRead(button) == LOW) {
      reactionTime = millis() - startTime; 
      waitingForPress = false;

      Serial1.print("Reaction time: ");
      Serial1.print(reactionTime);
      Serial1.println(" ms");

      delay(3000); 
    }
  }
}
