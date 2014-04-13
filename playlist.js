var Player = require('./player');

function Playlist(file_array) {
  this.players = [];
  this.files = file_array;
  //var that = this;
  /*for(var i=0; i<file_array.length; i++){
    that.players.push( new Player(file_array[i]) );
  }*/
  this.now_playing = 0;
  this.create(file_array[this.now_playing]);
  this.length = this.files.length;

  this.event_list = {};
}

Playlist.prototype.create = function () {
  var np = this.now_playing;
  var p = new Player(this.files[np]);
  var next = this.next.bind(this);
  var event;
  p.on('end', next);
  //add any bound events to this new one
  for (event in this.event_list) {
    p.on(event, this.event_list[event]);
  }
  this.players[np] = p;
  return p;
};

Playlist.prototype.change = function (index) {
  this.current().stop();
  this.now_playing = index;
  this.create();
  return this.current().play();
};
Playlist.prototype.next = function () {
  console.log("playlist next called " + this.now_playing);
  if (this.now_playing === this.length) { return false; }
  return this.change(this.now_playing + 1);
};
Playlist.prototype.prev = function () {
  console.log("playlist prev called " + this.now_playing);
  if (this.now_playing === 0) { return false; }
  return this.change(this.now_playing - 1);
};

Playlist.prototype.play = function () {
  return this.current().play();
};
Playlist.prototype.pause = function () {
  return this.current().pause();
};

Playlist.prototype.stop = function () {
  this.current().stop();
};

Playlist.prototype.current = function () {
  return this.players[this.now_playing];
};
Playlist.prototype.on = function (event_name, callback) {
  var i;
  //add to event list
  this.event_list[event_name] = callback;
  //add to all existing players
  for (i = 0; i < this.length; i++) {
    if (this.players[i]) {
      this.players[i].on(event_name, callback);
    }
  }
};

module.exports = Playlist;