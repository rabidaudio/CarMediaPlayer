var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var events = require("events");

var keymap = {
	'0': "play_pause",
	'1': "next",
	'2': "prev",
	'3': "menu",
	'4': "mode",
	'5': "shuffle_all",
}
var commandmap = {
	'ready': 1,
	'display': 0,
}
var serial_dir = "/dev/ttyACM0";
//_.filter(fs.readdirSync('/dev'), function(device){ return device.match(/^ttyACM/); });

function IO(){
	events.EventEmitter.call(this);
	serialPort = new SerialPort(serial_dir, {
	  baudrate: 57600,
	  parser: serialport.parsers.readline("\n")
	}, false);

	var that = this;
	serialPort.open(function(err){
		if(err) throw err;
		serialPort.on('data', function(data){
			console.log("data recvd");
			//var command = data.toString().trim();
			//var command = data.trim();
			//console.log(command);
			//console.log(keymap[command]);
			that.emit(keymap[data]);
		});
		//callback();
	});
	this.serialPort = serialPort;
}

IO.super_ = events.EventEmitter;
IO.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: IO,
        enumerable: false
    }
});
IO.prototype.send = function(command, message){
	//this.serialPort.write(commandmap[command]+message);
	this.serialPort.write(message);
}


module.exports = new IO();