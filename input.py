#!/usr/bin/var

class cmpInput:
#creates an input command queue
#commands come in as numbers, but are stored in the queue as names
# of gui/ui methods

#import foo
#methodToCall = getattr(foo, 'bar')
#result = methodToCall()
##As far as that goes, lines 2 and 3 can be compressed to:
#result = getattr(foo, 'bar')()

	def __init__(self):
		self.buttons=['play_pause','next','perv','menu','mode','shuffle_all']
		self.q=Queue()

	def add(self, command):
		self.q.put(self.buttons[command])
	def getnext(self):
		return self.q.get()
	def getall(self):
		out=[]
		while self.q.full():
			out.append(self.q.get())
		return out
	def clear(self):
		out=self.getall()
		#then don't return it
