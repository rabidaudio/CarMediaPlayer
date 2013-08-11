#!/usr/bin/env python

#PLAY QUEUE

from collections import deque

class PlayQueue:
#creates the current queue of files to play
	def __init__(self):
		self.q=deque()

	def add(self, song_id):
		self.q.appendleft(song_id)
	def get(self):
		try:
			r=self.q.pop()
		except:
			r=-1
		return r
	def getall(self):
		out=[]
		while len(self.q)>0:
			out.append(self.q.pop())
		return out
	def clear(self):
		self.q.clear()
	def addm(self, songs):
		self.q.extendleft(songs)
	def isempty(self):
		if len(self.q)>0:
			return False
		else:
			return True
