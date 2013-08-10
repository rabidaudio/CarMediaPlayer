#!/usr/bin/env python

from pysqlite2 import dbapi2 as sqlite
import os, shutil, time, sys, re
from tagger import tagger

from lumberjack import dbg

class cmpDB:
## This is the database manager
	def __init__(self,library_dir):
		self.connection = sqlite.connect('cmp.db')
		self.cursor = self.connection.cursor()
		self.library_create = 'CREATE TABLE library (song_id INTEGER PRIMARY KEY, file VARCHAR(255), tracknum INT(8), title VARCHAR(255), artist VARCHAR(255), album VARCHAR(255), year INT(16), modified VARCHAR(20))'
		self.library_insert = 'INSERT INTO library VALUES (null, ?, ?, ?, ?, ?, ?, ?)'
		self.library_dir = library_dir

		self.mydbg=dbg('info')
		self.ilog=self.mydbg.info
		self.elog=self.mydbg.error
		self.wlog=self.mydbg.warn

		#add the library table if it doesn't exist
		self.cursor.execute('SELECT name FROM sqlite_master WHERE type=\'table\'')
		result=self.cursor.fetchall()
		if not ('library',) in result:
			self.wlog('library table missing. Creating...')
			self.cursor.execute(self.library_create)
			self.connection.commit()
		self.check_for_changes('.')
	
	#def initalize_config(self):
	#	try:
	#		self.cursor.execute('SELECT * FROM config')
	#		self.config = self.cursor.fetchall()
	#	except: #create a config database
	#		self.config = {'
	#		self.cursor.execute
	# Larger example that inserts many records at a time
	#purchases = [('2006-03-28', 'BUY', 'IBM', 1000, 45.00),
	#             ('2006-04-05', 'BUY', 'MSFT', 1000, 72.00),
	#             ('2006-04-06', 'SELL', 'IBM', 500, 53.00),
	#            ]
	#c.executemany('INSERT INTO stocks VALUES (?,?,?,?,?)', purchases)

	def check_for_changes(self,source_dir='.'):
	#check database for list of files and last modified date,
	#	compare to all files in root directory (except lib).
	#	if different, call update_library
		self.ilog("looking for new tracks...")

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


	def add_to_library(self,songfile):
		mytagger = tagger()
		tags = mytagger.get_track_info(songfile)
		self.ilog("adding "+songfile)
		self.cursor.execute(self.library_insert, ( songfile, tags['tracknum'], tags["title"], tags["artist"], tags["album"], tags['year'], str(os.path.getmtime(songfile)) ) )

	def remove_from_library(self,songfile):
		self.wlog("track "+songfile+" is missing. removing from database")
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
		if artist=='' and album=='':
			self.cursor.execute('SELECT title FROM library ORDER BY title')
		elif artist=='':
			self.cursor.execute('SELECT title FROM library WHERE album=? ORDER BY title', (album,))
		elif album=='':
			self.cursor.execute('SELECT title FROM library WHERE artist=? ORDER BY title', (artist,))
		else:
			self.cursor.execute('SELECT title FROM library WHERE artist=? AND album=? ORDER BY title'(artist, album))
		results = self.cursor.fetchall()
		for a in results:
			tracks.append(a[0])
		return tracks
