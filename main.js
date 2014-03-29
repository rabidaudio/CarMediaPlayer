
var library_dir = './Test/new';
var serial_dir = "/dev/ttyACM0";

var fs = require('fs');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var find = require('find');

var Playlist = require('./playlist');



var serialPort = new SerialPort(serial_dir, {
  baudrate: 57600,
  parser: serialport.parsers.readline("\n")
}, true);



/*function newplayer(file){
	return new Player(file, function(artist, track){
		serialPort.write(artist+"\t"+track);
	});
}

function check_status(p){
	console.log("\t"+p.seek_position);
	if(p.playing) setTimeout(check_status, 1000, p);
}*/

console.log("Setting up...");
find.file(/\.mp3$/, library_dir, function(files){

	for(var i=0;i<files.length;i++){
		files[i]=fs.realpathSync(files[i]);
	}
	console.log(files);

	var playlist = new Playlist(files);


	serialPort.on('data', function(data){
		console.log('data received:');
		//console.log(data.length);
		//console.log(data[0] == 1);
		if(data[0]==1){
			playlist.next();
		}
	});

	playlist.play();
	//setTimeout(check_status, 10000, player);
	// create player instance
	//var player = new Player('./Test/new/Amazon/The Cure/Seventeen Seconds/07 - A Forest.mp3');

	// play now and callback when playend

});

// // create a player instance from playlist
// var player = Player([
//     __dirname + '/demo.mp3',
//     __dirname + '/demo2.mp3',
//     __dirname + '/demo.mp3',
//     // play .mp3 file from a URL
//     'http://mr4.douban.com/blablablabla/p1949332.mp3'
// ]);

// // play again
// player.play();

// // play the next song, if any
// player.next();

// // add another song to playlist
// player.add('http://someurl.com/anothersong.mp3');

// // event: on playing
// player.on('playing',function(item){
//     console.log('im playing... src:' + item);
// });

// // event: on playend
// player.on('playend',function(item){
//     // return a playend item
//     console.log('src:' + item + ' play done, switching to next one ...');
// });

// // event: on error
// player.on('error', function(err){
//     // when error occurs
//     console.log(err);
// });

// // stop playing
// player.stop();