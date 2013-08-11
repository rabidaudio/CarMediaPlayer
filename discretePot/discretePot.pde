/*
  Analog input, serial output
 
 Reads an analog input pin, prints the results to the serial monitor.
 
 The circuit:

 * potentiometer connected to analog pin 0.
   Center pin of the potentiometer goes to the analog pin.
   side pins of the potentiometer go to +5V and ground
 
 created over and over again
 by Tom Igoe and everyone who's ever used Arduino
 
 */
 
 int previousValue;
 int currentValue;
 
 int a;
int b;
int c;
unsigned long starts;
unsigned long ends;
unsigned long delta;
 
 void setup() {
  Serial.begin(9600);
  previousValue = analogRead(0) >> 6;
  currentValue = previousValue;
 }
 
 void loop() {
  // read the analog input into a variable:
   /*currentValue = analogRead(0) >> 6;
   if (currentValue > previousValue){
     Serial.print("+: was ");
     Serial.print(previousValue);
     Serial.print("now ");
     Serial.println(currentValue);
   }else if (currentValue < previousValue){
     Serial.print("-: was ");
     Serial.print(previousValue);
     Serial.print("now ");
     Serial.println(currentValue);
   }
   previousValue=currentValue; */
   //currentValue= analogRead(0) >> 5;
   /*currentValue=round(12*analogRead(0)/1024);
   int diff=currentValue-previousValue;
   //Serial.println(diff);
   switch(diff){
     case 1:
     case 11:
       Serial.println('+');
       break;
     case -1:
     case -11:
       Serial.println('-');
       break;
   }
   previousValue=currentValue;*/
   currentValue=getValue();
   int diff = currentValue-previousValue;
   if (currentValue==0 && previousValue==11){
     Serial.print('+');
   }else if(currentValue==11 && previousValue==0){
     Serial.print('-');
   }else if(diff==1){
     Serial.print('+');
   }else if(diff==-1){
     Serial.print('-');
   }
   previousValue=currentValue;
   // print the result:
   //Serial.println(currentValue);
   // wait 10 milliseconds for the analog-to-digital converter
   // to settle after the last reading:
   delay(20);
 }
 
 int getValue(){
   int c = analogRead(0)>>6;
   switch(c){
     case 0:
       return 0;
       break;
     case 1:
       return 1;
       break;
     case 2:
     case 3:
       return 2;
       break;
     case 4:
       return 3;
       break;
     case 5:
     case 6:
       return 4;
       break;
     case 7:
       return 5;
       break;
     case 8:
     case 9:
       return 6;
       break;
     case 10:
       return 7;
       break;
     case 11:
     case 12:
       return 8;
       break;
     case 13:
       return 9;
       break;
     case 14:
       return 10;
       break;
     case 15:
       return 11;
       break;
   }
 }
 
 /*int getValue2(){
   //10 times slower than the above
   return round(12*analogRead(0)/1024);
 }*/
