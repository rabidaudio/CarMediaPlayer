
var library_dir = './Test/new';


var fs = require('fs');
var find = require('find');
var _ = require('underscore');

var Playlist = require('./playlist');
//var IO = require('./io');
var io = require('./io');

console.log("Setting up...");

var playlist;


find.file(/\.mp3$/, library_dir, function(files){

	for(var i=0;i<files.length;i++){
		files[i]=fs.realpathSync(files[i]);
	}

	playlist = new Playlist(files);
	playlist.on("play", function(tags){
		//serialPort.write( tags.TSOP.data + "\t" + tags.TIT2.data );
		console.log("new play " + tags.TSOP.data);
		io.send('display', tags.TSOP.data + "\t" + tags.TIT2.data);
	});
	/*_.each(playlist.players, function(e, i, a){
		playlist.players[i].on("play", function(tags){
			//serialPort.write( tags.TSOP.data + "\t" + tags.TIT2.data );
			io.send(tags.TSOP.data + "\t" + tags.TIT2.data);
		});
	});*/


	/*serialPort.on('data', function(data){
		console.log('data received:');
		//console.log(data.length);
		//console.log(data[0] == 1);
		switch(data[0]){
			case '0':
				playlist.prev();
				//serialPort.write( playlist.prev() );
				break;
			case '1':
				playlist.next();
				//serialPort.write( playlist.next() );
				break;
		}
	});*/
	/*io.on('next', function(){
		console.log("calling next");
		//playlist.next();
	});*/

	io.on('prev', playlist.prev);
	io.on('next', playlist.next);

	//serialPort.write( playlist.play() );
	playlist.play();
});
