#!/usr/bin/env python

#MAIN
from database import cmpLibrary, cmpConfig
import database
from lumberjack import dbg
from player import cmpPlayer
import time, os

mydbg=dbg('info')
ilog=mydbg.info
elog=mydbg.error
wlog=mydbg.warn

#playqueue probably doesnt need to be a class. it can be a set of tracks (or just ids)

print os.getcwd()

library_dir = "lib"
source_dir = "Test/new"

cmpdb = cmpLibrary(library_dir)
cmpdb.refresh_library()
cmpconfig = cmpConfig()
print cmpconfig.settings

#for a in cmpdb.get_albums('Nekromantix'):
#	print a
#	for t in cmpdb.get_tracks(a):
#		print a+'--'+t

#myplayer = cmpPlayer()
#myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
#while myplayer.playmode:
#	time.sleep(1)
