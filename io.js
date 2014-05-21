var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var events     = require("events");
var _          = require('underscore');
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
// Basically, it gets a list of all the devices that look like they could
//  be USB serial devices. Then it goes through the list, trying to connect
//  to it. If a connection is not established, it replaces itself with
//  a new instance for the next item in the list. This continues until the
//  list runs out or a connection is estabished, at which point it calls the
//  callback with itself.
var serial_dir = _.filter(fs.readdirSync('/dev'), function (device) {
  return device.match(/^ttyACM/);
});

function IO() {
  events.EventEmitter.call(this);
  if (serial_dir.length < 1) {
    throw "No serial devices found.";
  }
  var serialPort = new SerialPort("/dev/" + serial_dir.shift(), {
    baudrate: 9600,
    parser: serialport.parsers.readline("\r\n")
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

/* Since we don't know if the chosen serial device will work,
  we have to do this here rather than in the constructor. */
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
        self.emit(keymap[data]);
      });
      cb(self);
    }
  });
};

// Wrappers for some commands
IO.prototype.clear = function () {
  this.send('clear_display');
};

IO.prototype.display = function (message) {
  this.send('display', message);
}


module.exports = new IO(); //sneaky singleton awesomeness