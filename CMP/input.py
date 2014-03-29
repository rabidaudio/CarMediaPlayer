#!/usr/bin/var

#from collections import deque

class Input:
#creates an input command queue
#commands come in as numbers, but are stored in the queue as names
# of gui/ui methods

#import foo
#methodToCall = getattr(foo, 'bar')
#result = methodToCall()
##As far as that goes, lines 2 and 3 can be compressed to:
#result = getattr(foo, 'bar')()


import serial
import CMP

out_commands = {
	"READY": 0,
	"PRINT": 1,
	"SET": 	 2,

}

buttons = {
	0: 'play_pause',
	1: 'next',
	2: 'prev',
	3: 'menu',
	4: 'mode',
	5: 'shuffle_all',
}


	def __init__(self):
		self.serial = serial.Serial('/dev/ttyACM0', baudrate=115200, timeout=3.0)

	def send(self, command, args=""):
		self.serial.write(commands[command]+args)

	def get(self):
		message = self.serial.readline()
		if(message):
			command = buttons[message[0]]
			args = message[1:]
			log("Recieved keypress "+command)
			#run Control. method by command, args

	def clear(self):
		self.command_buffer=[]
