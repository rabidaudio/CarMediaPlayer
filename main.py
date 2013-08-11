#!/usr/bin/env python

#MAIN
from database import cmpLibrary, cmpConfig
import database
from lumberjack import dbg
from player import cmpPlayer
from playqueue import playQueue

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
			time.sleep(5)
			print myplayer.playmode
	else:
		elog('No such song!')

pc=playQueue()
#for a in cmpdb.get_albums('Nekromantix'):
#	t=cmpdb.get_tracks(a)
#	print t[0]
#	pc.addm(t[1])
pc.add(333)
pc.add(26)

while not pc.isempty():
	play(pc.get())

#myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
