#/usr/bin/env python

#we can add init stuff here if neccessary


#MOVED LUMBERJACK HERE
import time


DEBUGLEVEL=3
#def set_dbg_level(debuglevel='error'): #doesn't work. set the variable directly
#	if debuglevel=='silent':
#		DEBUGLEVEL=0
#	elif debuglevel=='error':
#		DEBUGLEVEL=1
#	elif debuglevel=='warn':
#		DEBUGLEVEL=2
#	#elif debuglevel=='info':
#	else:
#		DEBUGLEVEL=3

def log(message, level='info'):
	tstamp = time.strftime("%Y_%m_%d %H:%M:%S", time.gmtime())
	print tstamp+" ["+level.upper()+"]: "+message
def error(message):
	if DEBUGLEVEL>=1:
		log(message, 'error')
def warn(message):
	if DEBUGLEVEL>=2:
		log(message, 'warn')
def info(message):
	if DEBUGLEVEL>=3:
		log(message, 'info')
