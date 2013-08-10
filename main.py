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

cmpdb = cmpDB(library_dir)
for a in cmpdb.get_artists():
	print a
for a in cmpdb.get_albums('Nekromantix'):
	print a
