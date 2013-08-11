#!/usr/bin/python

import os,pygst
pygst.require("0.10")
import gst
#from lumberjack import dbg
import CMP

class Player:
#Music player class does the grunt work of producing audio using gstreamer
# basically copied directly from the playbin tutorial. this is lazy, and
# probably means it runs slower than neccessary, but it was stupid easy
# TODO replace with a real stream that has controls (volume, play/pause, etc)
	#mydbg=dbg('info')
	#ilog=mydbg.info
	#elog=mydbg.error
	#wlog=mydbg.warn

	def __init__(self):
		self.player = gst.element_factory_make("playbin2", "player")
		fakesink = gst.element_factory_make("fakesink", "fakesink")
		self.player.set_property("video-sink", fakesink)
		bus = self.player.get_bus()
		bus.add_signal_watch()
		bus.connect("message", self.on_message)

	def on_message(self, bus, message):
		t = message.type
		if t == gst.MESSAGE_EOS:
			CMP.info('End of song')
			self.player.set_state(gst.STATE_NULL)
			self.playmode = False
		elif t == gst.MESSAGE_ERROR:
			self.player.set_state(gst.STATE_NULL)
			err, debug = message.parse_error()
			CMP.error("Error: %s" % err, debug)
			self.playmode = False

	def stop(self):
		self.player.set_state(gst.STATE_NULL)
		self.playmode = False

	def start(self, filepath):
		if os.path.isfile(filepath):
			self.playmode = True
			self.player.set_property("uri", "file://" + filepath)
			self.player.set_state(gst.STATE_PLAYING)
			
