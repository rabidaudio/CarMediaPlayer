#!/usr/bin/env python

#MAIN
import CMP
from CMP.database import Library, Config
from CMP.player import Player
from CMP.playqueue import PlayQueue

from CMP.player2 import Player2

import time, os

CMP.DEBUGLEVEL=1

#TODO if cmp.db doesn't exist, run setup


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
		CMP.error('No such song!')

pc=PlayQueue()
#for a in cmpdb.get_albums('Nekromantix'):
#	t=cmpdb.get_tracks(a)
#	print t[0]
#	pc.addm(t[1])
pc.add(333)
pc.add(26)


#while not pc.isempty():
#	play(pc.get())

mp2=Player2(pc)

#myplayer.start('/home/charles/Dropbox/Projects/CarMediaPlayer/Test/new/jmu/ZMOO.mp3')
