#!/usr/bin/env python

#PLAYER 2

#replacement for the basic Player (playbin) class that
# tries to do some real shit

#TODO convert threads to cython-friendly multiprocessing

import gobject
gobject.threads_init()
import gst
# ! decodebin ! audioconvert ! alsasink
#>>> class test:
#...     def __init__(self):
#...             self.x="y"
#...             vars(self)[self.x]=123
#... 
#>>> t=test()
#>>> t.x
#'y'
#>>> t.y
#123
#>>> vars(t)
#{'y': 123, 'x': 'y'}
import CMP
import time


class Player2:
	def __init__(self, playqueue):
		if str(playqueue.__class__) != "CMP.playqueue.PlayQueue":
			raise Exception("that ain't no playqueue!")
		else:
			self.playqueue = playqueue
		self.pipeline = gst.Pipeline('player')

		self.filesrc = gst.element_factory_make('audiotestsrc', None)
		self.pipeline.add(self.filesrc)

		#self.decodebin = gst.element_factory_make('decodebin', None)
		#self.pipeline.add(self.decodebin)
		#self.filesrc.link(self.decodebin)

		#self.audioconvert=gst.element_factory_make('audioconvert', None)
		#self.pipeline.add(self.audioconvert)
		##self.decodebin.link(self.audioconvert)

		self.alsasink = gst.element_factory_make('alsasink', None)
		self.pipeline.add(self.alsasink)
		#self.audioconvert.link(self.alsasink)

		self.filesrc.link(self.alsasink)

		self.play("n")
		#freq=200
		#dorian minor
		freqs=[587.329535834815,
			659.25511382574,
			698.456462866008,
			783.990871963499,
			880,
			987.766602512248,
			1046.50226120239,
			1174.65907166963,
			146.832383958704,
			164.813778456435,
			174.614115716502,
			195.997717990875,
			220,
			246.941650628062,
			261.625565300599,
			293.664767917408]
		for i in freqs:
			self.filesrc.set_property("freq", i)
			time.sleep(2)
		self.pause()
		

	def play(self, filepath):
		#1. check if already playing
		#2. check if file exists
		#3. start playback in new thread
		self.playing=True
		#self.filesrc.set_property("location", "/home/charles/Dropbox/Projects/CarMediaPlayer/Test/brobob.mp3")
		self.pipeline.set_state(gst.STATE_PLAYING)

	def pause(self):
		#if playing, send pause
		self.playing = False
		self.pipeline.set_state(gst.STATE_PAUSED)

	def stop(self):
		#if playing, terminate thread
		self.playing = False
		self.pipeline.set_state(gst.STATE_Null)




class Player3:
#This is all stupid unneccessary abstraction. didn't want to delete, but don't use it, please
	def __init__(self):
		#PIPE is of the form [ (element, [[property,] property...]), ...] in pipeline order
		self.pipe=[('filesrc', 'location'), ('decodebin',), ('audioconvert',), ('alsasink',)]
		self.pipeline = gst.Pipeline('player')
		i=0
		self.elements=[]
		for element in self.pipe: #this is stupid
			print "appending"
			self.elements.append(gst.element_factory_make(element[0], None))
			print "adding to pipeline"
			self.pipeline.add(self.elements[i])
			#add properties
			for j in range(1, len(elements)):
				pass
			#link to previous
			if (i>1):
				try:
					self.elements[i-1].link(self.elements[i])
				except Exception, err:
					CMP.error(err.message)
			i+=1
		print self.elements
