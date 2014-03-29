#!/usr/bin/env python

#PLAY QUEUE

#from collections import deque
# WHY use dqueue!? arrays are fine

class PlayQueue:
#creates the current queue of files to play
	def __init__(self):
		self.q = []

	def add(self, song_id):
		self.q.append(song_id)

	def get(self):
		try:
			r=self.q.pop(0)
		except:
			r=-1
		return r

	def getall(self):
		out = self.q
		self.clear()
		return out

	def clear(self):
		self.q = []

	def addm(self, songs):
		self.q.extend(songs)

	def isempty(self):
		return not len(self.q)>0
