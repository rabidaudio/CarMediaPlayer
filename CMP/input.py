#!/usr/bin/var

from collections import deque

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
import time

#def readlineCR(port):
#    rv = ""
#    while True:
#        ch = port.read()
#        rv += ch
#        if ch=='\r' or ch=='':
#            return rv
#
#port = serial.Serial("/dev/ttyAMA0", baudrate=115200, timeout=3.0)
#
#while True:
#    port.write("\r\nSay something:")
#    rcv = readlineCR(port)
#    port.write("\r\nYou sent:" + repr(rcv))


	def __init__(self):
		self.buttons=['play_pause','next','perv','menu','mode','shuffle_all']
		self.q=deque()

	def add(self, command):
		self.q.appendleft(self.buttons[command])
	def get(self):
		try:
			r=self.q.pop()
		except:
			r=None
		return r
	def getall(self):
		out=[]
		while len(self.q)>0:
			out.append(self.q.pop())
		return out
	def clear(self):
		self.q.clear()
