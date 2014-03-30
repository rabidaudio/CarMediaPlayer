
var library_dir = './Test/new';


var fs = require('fs');
var find = require('find');
var _ = require('underscore');

var Playlist = require('./playlist');
var io = require('./io');


console.log("Setting up...");

var playlist;


find.file(/\.mp3$/, library_dir, function(files){

	for(var i=0;i<files.length;i++){
		files[i]=fs.realpathSync(files[i]);
	}

	playlist = new Playlist(files);
	playlist.on("play", function(tags){
		console.log("new play " + tags.TSOP.data);
		io.send('display', tags.TSOP.data + "\t" + tags.TIT2.data);
	});

	var next = playlist.next.bind(playlist);
	var prev = playlist.prev.bind(playlist);
	var pause = playlist.pause.bind(playlist);

	io.on('prev', prev);
	io.on('next', next);

	playlist.play();
});
