#!/usr/bin/env python

#MP3 tag manager

from mutagen.mp3 import EasyMP3 as MP3
import re

class tagger:
	def get_track_info(self,track):
	#Cleans up the response from EasyMP3, so we have a garanteed dictionary returned, with 'null' for any missing info
		tags = MP3(track)
		info = {'tracknum': 'null', 'title': 'null', 'artist': 'null', 'album': 'null', 'year': 'null'}
		if 'tracknumber' in tags:
			info['tracknum'] = re.split("/",tags["tracknumber"][0])[0]
		if 'title' in tags:
			info['title'] = tags["title"][0]
		if 'artist' in tags:
			info['artist'] = tags["artist"][0]
		if 'album' in tags:
			info['album'] = tags["album"][0]
		if 'date' in tags:
			info['year'] = re.split("-",tags["date"][0])[0]
		return info
