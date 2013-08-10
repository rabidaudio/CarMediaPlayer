#!/usr/bin/env python

#MAIN
from database import cmpLibrary, cmpConfig
import database
from lumberjack import dbg
from player import cmpPlayer

import time, os
from input import cmpInput

mydbg=dbg('info')
ilog=mydbg.info
elog=mydbg.error
wlog=mydbg.warn

#playqueue probably doesnt need to be a class. it can be a set of tracks (or just ids)

print os.getcwd()

library_dir = "lib"
source_dir = "Test/new"

cmpdb = cmpLibrary(library_dir)
cmpconfig = cmpConfig()
print cmpconfig.settings

myplayer = cmpPlayer()

def play(song_id):
	filepath=cmpdb.get_file(song_id)
	if filepath != -1:
		myplayer.start(filepath)
		while myplayer.playmode:
			time.sleep(1)
	else:
		elog('No such song!')

inp=cmpInput()
inp.add(0)
inp.add(1)
inp.add(3)
print inp.get()
print inp.get()
print inp.get()
print inp.get()

#for a in cmpdb.get_albums('Nekromantix'):
#	print a
#	for t in cmpdb.get_tracks(a):
#		print a+'--'+t

#myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
