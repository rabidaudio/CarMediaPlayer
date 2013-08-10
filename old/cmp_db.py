#!/usr/bin/env python

#THIS CONTAINS OUR DATABASE FUNCTIONS
#e.g. database creation, updates

#These are the tables in the database.
#	1. library	- each track's tags, location, etc
#	2. options	- stores the global variables and settings for the program. easier than adding a prefrences file,IMO
#	3. playback_log	- stores the track and timestamp of the play, along with a bool for if it has been scrobbled.

def get_track_info(track):
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

def update_library(source_dir, cursor, connection):
#delete old lib directory, delete old database, create new directory and database
#find all files in source directory, and if they are valid, copy to lib directory and add to database
	if os.path.exists(library_dir):
		shutil.rmtree(library_dir)
		os.mkdir(library_dir)
	try:
		cursor.execute(library_create)
	except:
		cursor.execute('DROP TABLE library')
		cursor.execute(library_create)
	connection.commit()
	#print "cleaned"

	for root, dirs, files in os.walk(source_dir):
		for f in files:
			source = root+"/"+f
			#print source
			extension = os.path.splitext(f)[1].lower()
			if extension in acceptable_filetypes:
				fn = f
				if os.path.exists(library_dir+"/"+f):
					fn = str(int(time.time()*100))+f
					#print "overwite: "+library_dir+"/"+fn
					shutil.copy(source, library_dir+"/"+fn)#TODO change to move
				else:
					#print "normal copy"
					shutil.copy(source, library_dir)#TODO change to move
				tags = get_track_info(library_dir+"/"+fn)
				cursor.execute(library_insert, ( fn, tags['tracknum'], tags["title"], tags["artist"], tags["album"], tags['year'] ) )
			#else:
			#	print "invalid file: "+f
	connection.commit()

def get_artists(cursor):
	artists = []
	cursor.execute('SELECT artist FROM library GROUP BY artist ORDER BY artist')
	results = cursor.fetchall()
	for a in results:
		artists.append(a[0])
	return artists

def get_albums(cursor, artist=''):
	albums = []
	if artist == '':
		cursor.execute('SELECT album FROM library GROUP BY album ORDER BY album')
	else:
		cursor.execute('SELECT album FROM library WHERE artist="'+artist+'" GROUP BY album ORDER BY year, album')
	results = cursor.fetchall()
	for a in results:
		albums.append(a[0])
	return albums

#def get_tracks(cursor, album='', artist=''):
#	tracks=[]
#	if artist==''


#cursor.execute('CREATE TABLE options (option_id INTEGER PRIMARY KEY, name VARCHAR(100), value VARCHAR(255))')
#z = 'INSERT INTO options VALUES (null, ?, ?)'
#cursor.execute(z, 'library_dir', "lib")
#cursor.execute(z, 'source_dir', "Test/new")
#cursor.execute(z, 'acceptable_filetypes', ".mp3")
#cursor.execute(z, 'acceptable_filetypes', ".mp3")
#cursor.execute(z, 'acceptable_filetypes', ".mp3")



OLD CODE:
	def update_library(self,source_dir):
	#delete old lib directory, delete old database, create new directory and database
	#find all files in source directory, and if they are valid, copy to lib directory and add to database
		acceptable_filetypes = ".mp3"#TODO replace with config file
		if os.path.exists(self.library_dir):
			shutil.rmtree(self.library_dir)
			os.mkdir(self.library_dir)
		try:
			self.cursor.execute(self.library_create)
		except:
			self.cursor.execute('DROP TABLE library')
			self.cursor.execute(self.library_create)
			self.wlog("Replaced Database")
		self.connection.commit()
		mytagger = tagger()

		for root, dirs, files in os.walk(source_dir):
			for f in files:
				source = root+"/"+f
				self.ilog(source)
				extension = os.path.splitext(f)[1].lower()
				if extension in acceptable_filetypes:
					fn = f
					if os.path.exists(self.library_dir+"/"+f):
						fn = str(int(time.time()*100))+f
						self.ilog("overwiting: "+self.library_dir+"/"+fn)
						shutil.copy(source, self.library_dir+"/"+fn)#TODO change to move
					else:
						self.ilog("normal copy")
						shutil.copy(source, self.library_dir)#TODO change to move
					tags = mytagger.get_track_info(self.library_dir+"/"+fn)

					self.ilog(self.library_insert)
					self.cursor.execute('SELECT album FROM library GROUP BY album ORDER BY album')
					print self.cursor.fetchone()

					self.cursor.execute(self.library_insert, ( fn, tags['tracknum'], tags["title"], tags["artist"], tags["album"], tags['year'] ) )
				else:
					self.ilog("invalid file: "+f)
		self.connection.commit()
		#rmdir source_dir

