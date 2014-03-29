
var library_dir = './Test/new';
var serial_dir = "/dev/ttyACM0";

var fs = require('fs');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var find = require('find');

var Playlist = require('./playlist');



console.log("Setting up...");

var serialPort = new SerialPort(serial_dir, {
  baudrate: 57600,
  parser: serialport.parsers.readline("\n")
}, true);

find.file(/\.mp3$/, library_dir, function(files){

	for(var i=0;i<files.length;i++){
		files[i]=fs.realpathSync(files[i]);
	}
	console.log(files);

	var playlist = new Playlist(files);
	playlist.on("play", function(tags){
		serialPort.write( tags.TSOP.data + "\t" + tags.TIT2.data );
	});


	serialPort.on('data', function(data){
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
	});

	serialPort.write( playlist.play() );
});