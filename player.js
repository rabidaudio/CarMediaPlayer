var fs      = require('fs');
var events  = require('events');
var lame    = require('lame');
var Speaker = require('speaker');
var through = require('through');

var tags    = require('./tags');


// All of these are valid properties, values of Player.state and also events
var states = [
  'unstarted',
  'playing',
  'paused',
  'stopped',
  'ended',
];

// Settings for new Speaker objects
var speaker_options = {
  channels   : 2,     // 2 channels
  bitDepth   : 16,    // 16-bit samples
  sampleRate : 44100  // 44,100 Hz sample rate
};

function Player(file) {
  if (!file) { return; }
  this.file    = file;
  this.speaker = new Speaker(speaker_options);
  this.decoder = new lame.Decoder();

  this.buffer = fs.createReadStream(file);

  var self = this;
  this.t = through(function (data) {
    this.queue(data);
  }, function () {
    self._set_state('ended');
    this.queue(null);
  });

  //inital state
  this._set_state('unstarted');

  this.tags = tags(file); //TODO get from database instead

  events.EventEmitter.call(this);
}

// Normal event object code
Player.super_ = events.EventEmitter;
Player.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value      : Player,
    enumerable : false
  }
});

// Used to update the state of the Player. Valid states are
//  in the global state array. Also emits events. Array.indexOf
//  is a bit inefficient...
Player.prototype._set_state = function (state) {
  var s;
  var state_number = states.indexOf(state);
  if (state_number < 0) {
    throw new Error("Player set to invalid state " + state);
  }
  for (s in states) {
    this[states[s]] = false;
  }
  this[state] = true;
  this.state = state;
  this.emit(state, this.tags);
  return state_number;
};

Player.prototype.play = function () {
  if (this.playing) { return true; }
  if (this.paused) {
    //Reconnect the speaker to the decoder
    this.decoder.pipe(this.speaker);
    this._set_state('playing');
  } else {
    //Connect the chain together
    this.buffer.pipe(this.t).pipe(this.decoder).pipe(this.speaker);
    this._set_state('playing');
  }
};
Player.prototype.stop = function () {
  if (!this.playing) { return false; }
  this.speaker.end();
  this._set_state('stopped');
};
Player.prototype.pause = function () {
  if (this.paused || !this.playing) { return false; }
  this.speaker.end();
  // make a new one so we can continue later
  this.speaker = new Speaker(speaker_options);

  this._set_state('paused');
};
// Helper method for play and pause
Player.prototype.play_pause = function () {
  if (this.paused || !this.playing) {
    this.play();
  } else {
    this.pause();
  }
};

module.exports = Player;


/* Test Code */
p = new Player('Test/chirp.mp3');
P = Player;
// p.play();

require("repl").start({
  useGlobal: true
});