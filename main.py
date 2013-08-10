#!/usr/bin/env python

#MAIN
from database import *
from lumberjack import dbg

mydbg=dbg('info')
ilog=mydbg.info
elog=mydbg.error
wlog=mydbg.warn



library_dir = "lib"
source_dir = "Test/new"
acceptable_filetypes = ".mp3" #re.split(",",".mp3,.flac,.ogg")

cmpdb = cmpDB(library_dir)
#cmpdb.update_library(source_dir)
#cmpdb.add_to_library('Test/new/jmu/ZMOO.mp3')
cmpdb.check_for_changes('.')
for a in cmpdb.get_artists():
	print a
