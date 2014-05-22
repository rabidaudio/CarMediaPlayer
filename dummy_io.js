var events = require("events");
var readline = require('readline');

/* This is a very simple module that immiatates the real
  Serial IO module through stdin/stdout. That way you don't
  have to muck with plugging the device in to test. */

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


function IO() {
  events.EventEmitter.call(this);
  this.rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

IO.super_ = events.EventEmitter;
IO.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: IO,
    enumerable: false
  }
});

IO.prototype.send = function (command, message) {
  console.log(commandmap[command] + message);
};

IO.prototype.open = function (cb) {
  var self = this;
  this.rl.on('line', function (data) {
    data = parseInt(data, 10);
    if (!isNaN(data) && keymap[data]) {
      self.emit(keymap[data]);
    }
  });
  this.rl.prompt();
  cb(this);
};

IO.prototype.clear = function () {
  this.send('clear_display');
};

module.exports = new IO(); //sneaky singleton awesomeness