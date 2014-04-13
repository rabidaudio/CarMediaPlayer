var fs      = require('fs');
var events  = require("events");
var lame    = require('lame');
var Speaker = require('speaker');
var through = require('through');

var tags    = require('./tags');

var time_interval = 50;

function create_speaker() {
  return new Speaker({
    channels   : 2,     // 2 channels
    bitDepth   : 16,    // 16-bit samples
    sampleRate : 44100  // 44,100 Hz sample rate
  });
}

function Player(file) {
  if (!file) { return; }
  this.file    = file;
  this.speaker = create_speaker();
  this.decoder = new lame.Decoder();

  this.buffer = fs.createReadStream(file);

  var that = this;
  this.t = through(function (data) {
    that.seek_position += data.length;
    //console.log(that.seek_position);
    this.queue(data);
  }, function () {
    that.emit("end");
    this.queue(null);
  });

  this.playing       = false;
  this.paused        = false;
  this.seek_position = 0; //bytes
  this.time          = 0; //ms
  this.timer         = undefined;

  this.tags = tags(file); //TODO get from database instead
  events.EventEmitter.call(this);
}

Player.super_ = events.EventEmitter;
Player.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value      : Player,
    enumerable : false
  }
});

Player.prototype.play = function () {
  console.log("play called");
  if (this.playing) { return true; }
  if (this.paused) {
    this.decoder.pipe(this.speaker);
    this.timer   = setInterval(this.time_step.bind(this), time_interval);
    this.paused  = false;
    this.playing = true;
  } else {
    this.buffer.pipe(this.t).pipe(this.decoder).pipe(this.speaker);
    this.timer   = setInterval(this.time_step.bind(this), time_interval);
    this.playing = true;
  }
  this.emit("play", this.tags);
};
Player.prototype.stop = function () {
  if (!this.playing) { return false; }
  this.speaker.end();
  clearInterval(this.timer);
  this.emit("stop");
};
Player.prototype.pause = function () {
  console.log("pause called");
  if (this.paused || !this.playing) { return false; }
  this.speaker.end();
  clearInterval(this.timer);
  //make a new one so we can continue later
  this.speaker = create_speaker();
  this.paused  = true;
  this.playing = false;
  this.emit("pause");
};

Player.prototype.time_step = function () {
  this.time += time_interval;
  //console.log(this.time);
};

module.exports = Player;