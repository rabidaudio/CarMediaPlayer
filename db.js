var fs = require('fs');

var find = require('find');
var sqlite3 = require('sqlite3').verbose();
var sql = require('sql');
sql.Sql('sqlite');
var shuffle = require('shuffle-array');

var Tags = require('./tags');

var library_file = ':memory:'; //fs.realpathSync('./library.db');
var library_dir = './Test/new';

var db = new sqlite3.Database(library_file);

var library = sql.define({
	name: "library",
	columns: [
		{
			name: 'id',
			dataType: 'int',
			primaryKey: 'true'
		},
		{
			name: 'file',
			dataType: 'varchar(255)'
		},
		{ 
			name:'kind',
			dataType: 'varchar(50)'
		},
		{
			name: 'artist',
			dataType: 'varchar(100)'
		},
		{
			name: 'artist_sort',
			dataType: 'varchar(100)'
		},
		{
			name: 'album',
			dataType: 'varchar(100)'
		},
		{
			name: 'album_sort',
			dataType: 'varchar(100)'
		},
		{
			name: 'title',
			dataType: 'varchar(100)'
		},
		{
			name: 'track_num',
			dataType: 'int'
		},
		{
			name: 'year',
			dataType: 'int'
		},
		{
			name: 'genre',
			dataType: 'varchar(50)'
		},
	]
});
//TODO freakin node-sql sucks more dick than writing SQL statementss

db.on('trace', function(query){
	return "EXPLAIN "+query+" PLAN";
});

function Library(file_directory){
	db.run('DROP TABLE IF EXISTS library')
	  .run('CREATE TABLE "library" ("id" int PRIMARY KEY, "file" varchar(255), "kind" varchar(50), "artist" varchar(100), "artist_sort" varchar(100), "album" varchar(100), "album_sort" varchar(100), "title" varchar(100), "track_num" int, "year" int, "genre" varchar(50))', function(err){
		if(err) throw err;
		find.file(/\.mp3$/, file_directory, function(files){
			shuffle(files);
			for(var i=0;i<files.length;i++){
				files[i]=fs.realpathSync(files[i]);
				var tags = Tags(files[i]);
				//console.log(tags.title);
				console.log(tags.db_format);
				db.run('INSERT INTO "library" (file, kind, artist, artist_sort, album, album_sort, title, track_num, year, genre) VALUES ($file, $kind, $artist, $artist_sort, $album, $album_sort, $title, $track_num, $year, $genre)', tags.db_format, function(err){
					if(err) throw i+err;
					console.log(this.id);
				});
			}
				console.log("now getting");
				db.all("SELECT * from library", function(err, rows){console.log(rows);});
		});
	});
}

new Library(library_dir);
//module.exports = new Library(library_dir);