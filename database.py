#!/usr/bin/env python

## This is the database manager

from pysqlite2 import dbapi2 as sqlite
import os, shutil, time, sys, re
from tagger import *

from lumberjack import dbg

class cmpDB:
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
		#self.check_for_changes
	
	#def initalize_config(self):
	#	try:
	#		self.cursor.execute('SELECT * FROM config')
	#		self.config = self.cursor.fetchall()
	#	except: #create a config database
	#		self.config = {'
	#		self.cursor.execute

	def check_for_changes(self,source_dir='.'):
	#check database for list of files and last modified date,
	#	compare to all files in root directory (except lib).
	#	if different, call update_library
		self.ilog("looking for new tracks...")
		#get all current files
		filesongs=[]
		acceptable_filetypes = ".mp3"#TODO replace with config file
		for root, dirs, files in os.walk(source_dir):
			for f in files:
				source = root+"/"+f
				extension = os.path.splitext(source)[1].lower()
				if extension in acceptable_filetypes:
					filesongs.append(str(os.path.getmtime(source))+"|"+source)
				else:
					print "skipping "+f
		print filesongs

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
		print missing_from_db
		print missing_from_files
		for m in missing_from_db:
			print re.split('\|',m,1)[1]
			self.add_to_library(re.split('\|',m,1)[1])
	#>>> old.sort()
	#>>> new.sort()
	#>>> print set(old) & set(new)
	#set(['1/a.mp3_12/14'])
	#>>> set(new).difference(set(old))
	#set(['2/a.mp3_12/15'])
	#>>> list(set(new).difference(set(old)))
	#['2/a.mp3_12/15']


	#GET TABLES: SELECT name, sql FROM sqlite_master WHERE type='table' ;

	def add_to_library(self,songfile):
		mytagger = tagger()
		tags = mytagger.get_track_info(songfile)
		self.ilog("adding "+songfile)
		self.cursor.execute(self.library_insert, ( songfile, tags['tracknum'], tags["title"], tags["artist"], tags["album"], tags['year'], str(os.path.getmtime(songfile)) ) )
		#self.cursor.execute('SELECT * FROM library GROUP BY artist ORDER BY artist')
		#results=self.cursor.fetchall()
		#print results

	def remove_from_library(self,songfile):
		self.wlog("track "+songfile+" is missing. removing from database")
		self.cursor.execute('DELETE FROM library WHERE file ="'+songfile+'"')


	def get_artists(self):
		print "Get artists called"
		artists = []
		self.cursor.execute('SELECT artist FROM library GROUP BY artist ORDER BY artist')
		results = self.cursor.fetchall()
		for a in results:
			print a[0]
			artists.append(a[0])
		return artists


	def get_albums(self, artist=''):
		albums = []
		if artist == '':
			self.cursor.execute('SELECT album FROM library GROUP BY album ORDER BY album')
		else:
			self.cursor.execute('SELECT album FROM library WHERE artist="'+artist+'" GROUP BY album ORDER BY year, album')
		results = self.cursor.fetchall()
		for a in results:
			albums.append(a[0])
		return albums
	
	#def get_tracks(self, artist='', album=''):
	#	tracks=[]
	#	if artist=='' and album=='':
	#		self.cursor.execute('SELECT track ')
