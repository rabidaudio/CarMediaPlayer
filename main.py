#!/usr/bin/env python

#MAIN
from CMP.database import Library, Config
from CMP.lumberjack import dbg
from CMP.player import Player
from CMP.playqueue import PlayQueue

import time, os

mydbg=dbg('info')
ilog=mydbg.info
elog=mydbg.error
wlog=mydbg.warn

#playqueue probably doesnt need to be a class. it can be a set of tracks (or just ids)

print os.getcwd()

library_dir = "lib"
source_dir = "Test/new"

cmpdb = Library(library_dir)
cmpconfig = Config()
print cmpconfig.settings



def play(song_id):
	myplayer = Player()
	filepath=cmpdb.get_file(song_id)
	if filepath != -1:
		myplayer.start(filepath)
		while myplayer.playmode:
			time.sleep(5)
			print myplayer.playmode
	else:
		elog('No such song!')

pc=PlayQueue()
#for a in cmpdb.get_albums('Nekromantix'):
#	t=cmpdb.get_tracks(a)
#	print t[0]
#	pc.addm(t[1])
pc.add(333)
pc.add(26)


while not pc.isempty():
	play(pc.get())
	

#myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
