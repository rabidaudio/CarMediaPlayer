var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var events     = require("events");
var underscore = require('underscore');
var fs         = require('fs');

var keymap = {
  '0' : "play_pause",
  '1' : "next",
  '2' : "prev",
  '3' : "menu",
  '4' : "mode",
  '5' : "shuffle_all",
};
var commandmap = {
  'display': 0,
};
//var serial_dir = "/dev/ttyACM0";

//is it elegant? no. functional? yes.
var serial_dir = underscore.filter(fs.readdirSync('/dev'), function (device) {
  return device.match(/^ttyACM/);
});

function IO() {
  events.EventEmitter.call(this);
  if (serial_dir.length < 1) {
    throw "No serial devices found.";
  }
  var serialPort = new SerialPort("/dev/" + serial_dir.shift(), {
    baudrate: 57600,
    parser: serialport.parsers.readline("\n")
  }, false);
  this.serialPort = serialPort;
}

IO.super_ = events.EventEmitter;
IO.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: IO,
    enumerable: false
  }
});
IO.prototype.send = function (command, message) {
  //this.serialPort.write(commandmap[command]+message);
  this.serialPort.write(message);
};

IO.prototype.open = function (cb) {
  var that = this;
  this.serialPort.open(function (err) {
    if (err) {
      console.log(err);
      console.log("trying next device...");
      that = new IO(); //try the next found device
      that.open(cb);
    } else {
      that.serialPort.on('data', function (data) {
        that.emit(keymap[data]);
      });
      cb(that);
    }
  });
};

IO.prototype.clear = function () {
  this.send('display', ' '); //TODO find a better way than sending a space. hacks.
}

module.exports = new IO(); //sneaky singleton awesomeness