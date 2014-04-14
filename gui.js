var _       = require('underscore');
var events  = require("events");

var io      = require('./io');
var Library = require("./db.js");

function GUI(context) {
  events.EventEmitter.call(this);
  /* context = {artist: '' or null, album:'' or null, index:8 or null}*/
  var that = this;
  if (!context) { return; }
  this.context = context;
  if (!context.artist) {
    this.page = 'artists';
    Library.get_artists(function (list, tracks) {
      that.menu_items = list;
      that.tracks = tracks;
      that.emit('play_ready');
    });
  } else if (!context.album) {
    this.page = 'albums';
    Library.get_albums(function (list, tracks) {
      that.menu_items = list;
      that.tracks = tracks;
      that.emit('play_ready');
    }, context.artist);
  } else {
    this.page = 'tracks';
    Library.get_tracks(function (list, tracks) {
      that.menu_items = list;
      that.tracks = tracks;
      that.emit('play_ready');
    }, context.album, context.artist);
  }
  if (!context.index) {
    this.index = 0;
  } else {
    this.index = context.index;
  }

  //TODO make abstract setter method on IO
  io.on('next')
  io.on('prev')
  io.on('play_pause')
  io.on('mode')
  io.on('menu')
  io.on('shuffle_all')
}

IO.super_ = events.EventEmitter;
IO.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: IO,
    enumerable: false
  }
});

GUI.prototype.draw = function () {
  io.send('display', [this.menu_items[this.index],
                      this.menu_items[this.index + 1]].join("\t")
    );
};

GUI.prototype.next = function () {
  this.index++;
  this.draw();
};

GUI.prototype.prev = function () {
  this.index--;
  this.draw();
};

GUI.prototype.select = function () {
  var selected = this.menu_items[this.index];
  var new_gui;
  switch (this.page){
    case 'artists':
      return new GUI({artist: selected});
      break;
    case 'albums':
      return new GUI({artist: this.context.artist, album: selected});
      break;
    case 'tracks':
      return new PlayGUI(this.tracks);
      break;
  }
};

function PlayGUI(tracks, previous_context) {
    var next, prev, pause, play;
    var playlist = Library.make_playlist(tracks);
    this.previous_context = previous_context;

    playlist.on("play", function (tags) {
      console.log("Now playing " + tags.title);
      io.send('display', tags.artist + "\t" + tags.title + " - " + tags.album);
    });
    playlist.on('stop', io.clear.bind(io));

    next       = playlist.next.bind(playlist);
    prev       = playlist.prev.bind(playlist);
    pause      = playlist.pause.bind(playlist);
    play       = playlist.play.bind(playlist);
    play_pause = playlist.play_pause.bind(playlist);

    io.on('prev', prev);
    io.on('next', next);
    //io.on('prev', pause);
    //io.on('next', play);
    io.on('play_pause', play_pause);
    io.on('menu', function(){
      this.previous_context.draw();
      //TODO enable/disable events for handoff
    });
    io.on('mode', )

    return playlist;
}

PlayGUI.prototype.draw = function() {
};