var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var events     = require("events");
var underscore = require('underscore');
var fs         = require('fs');

var keymap = [
  "prev",
  "next",
  "play_pause",
  "menu",
  "mode",
  "shuffle_all",
];

var commandmap = {
  'display': 0,
  'clear_display': 1
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
    baudrate: 9600,
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
  this.serialPort.write(commandmap[command] + message);
};

IO.prototype.open = function (cb) {
  var self = this;
  this.serialPort.open(function (err) {
    if (err) {
      console.log(err);
      console.log("trying next device...");
      var next = new IO(); //try the next found device
      next.open(cb);
    } else {
      self.serialPort.on('data', function (data) {
        data = data[0]; //data includes a null or newline character, not sure what 
        self.emit(keymap[data]);
      });
      cb(self);
    }
  });
};

IO.prototype.clear = function () {
  this.send('clear_display');
};

module.exports = new IO(); //sneaky singleton awesomeness