#!/usr/bin/env python

#MAIN
from database import cmpDB
from lumberjack import dbg
from player import cmpPlayer
import time

mydbg=dbg('info')
ilog=mydbg.info
elog=mydbg.error
wlog=mydbg.warn



library_dir = "lib"
source_dir = "Test/new"

cmpdb = cmpDB(library_dir)

for a in cmpdb.get_albums('Nekromantix'):
	print a
	for t in cmpdb.get_tracks(a):
		print a+'--'+t

myplayer = cmpPlayer()
myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
while myplayer.playmode:
	time.sleep(1)
