// include the library code:
#include <LiquidCrystal.h>
#include <Wire.h>
 
#define REDLITE 15
#define GREENLITE 14
#define BLUELITE 12
#define STATUSLITE 11

#define POTPORT 8 //Analog 8 = D13

#define NUMCOLORS 6
#define LIGHTCYCLES 50//100

#define PLAY_PAUSE 0
#define NEXT 1
#define PREV 2
#define MENU 3
#define MODE 4
#define SHUFFLE_ALL 5

// initialize the library with the numbers of the interface pins
LiquidCrystal lcd(21, 20, 19, 18, 17, 16);
 
// you can change the overall brightness by range 0 -> 255
int brightness = 255; //100
int currentCycle = 0;
char currentColor = 0;

uint8_t colors[NUMCOLORS][3] = {
  {255, 0, 0},    //blue
  {0, 255, 0},    //green
  {200, 0, 200},  //purple
  {0, 255, 255},  //yellow
  {200, 200, 0},  //teal
  {0, 0, 255},    //red
};

//Pot
 int previousValue;
 int currentValue;
 char currentDirection = 1;
 
void setup() {
  Serial.begin(9600); 
  lcd.begin(16, 2);
  
  pinMode(REDLITE, OUTPUT);
  pinMode(GREENLITE, OUTPUT);
  pinMode(BLUELITE, OUTPUT);
  pinMode(STATUSLITE, OUTPUT);
  
  digitalWrite(STATUSLITE, HIGH);
}
 
 
void loop() {
  if(Serial.available()){
    delay(100);
    lcd.clear();
    while (Serial.available() > 0) {
      //start by getting any messages and pushing them to the display
      char c = Serial.read();
      if(c == '\t'){
        lcd.setCursor(0, 1);
      }else if(c != '\n'){
        lcd.write(c);
      }
    }
  }
  char pot = checkPot();
  if(pot>0){
    sendKeypress(NEXT);
  }
  if(pot<0){
    sendKeypress(PREV);
  }
  nextLight();
  delay(50);
}
 
 
/*
  for (int i = 0; i < 255; i++) {
    setBacklight(i, 0, 255-i);
    delay(5);
  }
  for (int i = 0; i < 255; i++) {
    setBacklight(255-i, i, 0);
    delay(5);
  }
  for (int i = 0; i < 255; i++) {
    setBacklight(0, 255-i, i);
    delay(5);
  }
*/

void nextLight(){
  if(++currentCycle >= LIGHTCYCLES){
    currentCycle=0;
    if(++currentColor >= NUMCOLORS){
      currentColor = 0;
    }
    setBacklight( colors[currentColor][0], colors[currentColor][1], colors[currentColor][2] );
  }
}
 
 
void setBacklight(uint8_t r, uint8_t g, uint8_t b) {
  // normalize the red LED - its brighter than the rest!
  //r = map(r, 0, 255, 0, 100);
  //g = map(g, 0, 255, 0, 150);
 
  r = map(r, 0, 255, 0, brightness);
  g = map(g, 0, 255, 0, brightness);
  b = map(b, 0, 255, 0, brightness);
 
  // common anode so invert!
  r = map(r, 0, 255, 255, 0);
  g = map(g, 0, 255, 255, 0);
  b = map(b, 0, 255, 255, 0);
  //Serial.print("R = "); Serial.print(r, DEC);
  //Serial.print(" G = "); Serial.print(g, DEC);
  //Serial.print(" B = "); Serial.println(b, DEC);
  analogWrite(REDLITE, r);
  analogWrite(GREENLITE, g);
  analogWrite(BLUELITE, b);
}

char checkPot(){
   currentValue=getValue();
   int diff = currentValue-previousValue;
   
   char returnv;
   if (currentValue==0 && previousValue==11){
     returnv = 1;
   }else if(currentValue==11 && previousValue==0){
     returnv = -1;
   }else if(diff==1){
     returnv = 1;
   }else if(diff==-1){
     returnv = -1;
   }else{
     returnv = 0;
   }
   previousValue=currentValue;
   if(currentDirection == returnv){
     currentDirection = returnv;
     return returnv;
   }else if(currentDirection == -1*returnv){
     currentDirection = returnv;
     return 0;
   }
}

int getValue(){
   //return round(12*analogRead(0)/1024);
    
   int c = analogRead(POTPORT)>>6;
   switch(c){
     case 0:   return 0;  break;
     case 1:   return 1;  break;
     case 2:
     case 3:   return 2;  break;
     case 4:   return 3;  break;
     case 5:
     case 6:   return 4;  break;
     case 7:   return 5;  break;
     case 8:
     case 9:   return 6;  break;
     case 10:  return 7;  break;
     case 11:
     case 12:  return 8;  break;
     case 13:  return 9;  break;
     case 14:  return 10; break;
     case 15:  return 11; break;
   }
}


void sendKeypress(int key){
  Serial.print(key);
  Serial.print("\n");
}
