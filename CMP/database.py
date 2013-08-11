#!/usr/bin/env python

from pysqlite2 import dbapi2 as sqlite
import os, shutil, time, sys, re
from tagger import tagger

import CMP

class DB:
## This is the database manager
	connection = sqlite.connect('cmp.db')
	cursor = connection.cursor()

class Library(DB):
	def __init__(self,library_dir):
		self.library_create = 'CREATE TABLE library (song_id INTEGER PRIMARY KEY, file VARCHAR(255), tracknum INT(8), title VARCHAR(255), artist VARCHAR(255), album VARCHAR(255), year INT(16), modified VARCHAR(20))'
		self.library_insert = 'INSERT INTO library VALUES (null, ?, ?, ?, ?, ?, ?, ?)'
		self.library_dir = library_dir

		#add the library table if it doesn't exist
		self.cursor.execute('SELECT name FROM sqlite_master WHERE type=\'table\'')
		result=self.cursor.fetchall()
		if not ('library',) in result:
			CMP.warn('library table missing. Creating...')
			self.cursor.execute(self.library_create)
			self.connection.commit()
		self.check_for_changes()

	def check_for_changes(self,source_dir=os.getcwd()):
	#check database for list of files and last modified date,
	#	compare to all files in root directory (except lib).
	#	if different, call update_library
		CMP.info("looking for new tracks...")

		#get all current files
		filesongs=[]
		acceptable_filetypes = [".mp3"] #TODO replace with config file
		for root, dirs, files in os.walk(source_dir):
			for f in files:
				source = root+"/"+f
				extension = os.path.splitext(source)[1].lower()
				if extension in acceptable_filetypes:
					filesongs.append(str(os.path.getmtime(source))+"|"+source)

		#get database's (old) files
		dbsongs=[]
		self.cursor.execute('SELECT file, modified FROM library')
		result=self.cursor.fetchall()
		for a in result:
			dbsongs.append(a[1]+"|"+a[0])
		
		#now compare
		#filesongs.sort()
		#dbsongs.sort()
		missing_from_db=list(set(filesongs).difference(set(dbsongs)))
		missing_from_files=list(set(dbsongs).difference(set(filesongs)))
		for m in missing_from_db:
			self.add_to_library(re.split('\|',m,1)[1])
		for m in missing_from_files:
			self.remove_from_library(re.split('\|',m,1)[1])
		#waiting to push the changes until now means we can be sure there
		#	aren't any crashes that fuck our database.
		self.connection.commit()

	def refresh_library(self):
		self.cursor.execute('DROP TABLE library')
		self.cursor.execute(self.library_create)
		self.check_for_changes()#will do the commit

	def add_to_library(self,songfile):
		mytagger = tagger()
		tags = mytagger.get_track_info(songfile)
		CMP.warn("adding "+songfile)
		self.cursor.execute(self.library_insert, ( songfile, tags['tracknum'], tags["title"], tags["artist"], tags["album"], tags['year'], str(os.path.getmtime(songfile)) ) )

	def remove_from_library(self,songfile):
		CMP.warn("track "+songfile+" is missing. removing from database")
		self.cursor.execute('DELETE FROM library WHERE file =?',(songfile,))


	def get_artists(self):
		artists = []
		self.cursor.execute('SELECT artist FROM library GROUP BY artist ORDER BY artist')
		results = self.cursor.fetchall()
		for a in results:
			artists.append(a[0])
		return artists


	def get_albums(self, artist=''):
		albums = []
		if artist == '':
			self.cursor.execute('SELECT album FROM library GROUP BY album ORDER BY album')
		else:
			self.cursor.execute('SELECT album FROM library WHERE artist=? GROUP BY album ORDER BY year, album',(artist,))
		results = self.cursor.fetchall()
		for a in results:
			albums.append(a[0])
		return albums
	
	def get_tracks(self, album='', artist=''):
		tracks=[]
		song_ids=[]
		if artist=='' and album=='':
			self.cursor.execute('SELECT title, song_id FROM library ORDER BY title')
		elif artist=='':
			self.cursor.execute('SELECT title, song_id FROM library WHERE album=? ORDER BY tracknum', (album,))
		elif album=='':
			self.cursor.execute('SELECT title, song_id FROM library WHERE artist=? ORDER BY title', (artist,))
		else:
			self.cursor.execute('SELECT title, song_id FROM library WHERE artist=? AND album=? ORDER BY tracknum'(artist, album))
		results = self.cursor.fetchall()
		for a in results:
			tracks.append(a[0])
			song_ids.append(a[1])
		return (tracks, song_ids)

	def get_file(self, song_id):
		self.cursor.execute('SELECT file FROM library WHERE song_id=?', (song_id,))
		result=self.cursor.fetchone()
		if result==None:
			return -1
		else:
			return result[0]


class Config(DB):
	def __init__(self):
		self.cursor.execute('SELECT name FROM sqlite_master WHERE type=\'table\'')
		result=self.cursor.fetchall()
		if not ('config',) in result:
			CMP.warn('config table missing. Creating...')
			self.initalize_config()
		self.extract_settings()
		
	def extract_settings(self):
		self.cursor.execute('SELECT setting, value FROM config')
		self.settings=dict(self.cursor.fetchall())
		
	def initalize_config(self):
		default_config=[('scrobble','True'),
				('acceptable_filetypes','[".mp3"]'),
				('gst_pipeline', 'default'),
				]
		self.cursor.execute('CREATE TABLE config (setting VARCHAR(50), value VARCHAR(50))')
		self.cursor.executemany('INSERT INTO config VALUES (?,?)', default_config)
		self.connection.commit()

	def clear_config(self):
		self.cursor.execute('DROP TABLE config')
		self.initalize_config() #will do the commit

	def set_config(self,setting, value):
		self.cursor.execute('UPDATE config SET value=? WHERE setting=?',(value,setting))
		self.connection.commit()
		self.extract_settings()#gotta update after
