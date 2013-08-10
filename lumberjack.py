#!/usr/bin/env python

#LOG MANAGER
import time

##########
# How to use:
# import the class, make an instance, and then 
# make aliases for the functions
#
#	from lumberjack import dbg
#
#	mydbg=dbg()
#	ilog=mydbg.info
#	elog=mydbg.error
#	wlog=mydbg.warn
#
# Then you can do this:
#	ilog('meow')
#	elog('no dogs')
#	wlog('lobster')
# And get this:
#	2013_08_10 01:49:24 [INFO]: meow
#	2013_08_10 01:49:24 [ERROR]: no dogs
#	2013_08_10 01:49:24 [WARN]: lobster

class dbg:
#He's a lumberjack and he's okay, he sleeps all night and he works all day
	def __init__(self,debuglevel='error'):
	#4 levels of logging
		if debuglevel=='silent':
			self.dl=0
		elif debuglevel=='error':
			self.dl=1
		elif debuglevel=='warn':
			self.dl=2
		#elif debuglevel=='info':
		else:
			self.dl=3

	def log(self, message, level='info'):
		tstamp = time.strftime("%Y_%m_%d %H:%M:%S", time.gmtime())
		print tstamp+" ["+level.upper()+"]: "+message
	def error(self, message):
		if self.dl>=1:
			self.log(message, 'error')
	def warn(self, message):
		if self.dl>=2:
			self.log(message, 'warn')
	def info(self, message):
		if self.dl>=3:
			self.log(message, 'info')
