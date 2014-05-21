var _       = require('underscore');
var events  = require("events");

function MenuGUI(context, previous_context, library, io) {
  events.EventEmitter.call(this);
  /* context = {artist: '' or null, album:'' or null, index:8 or null}*/
  var that = this;
  if (!context) { return; }
  this.context = context;
  if (!library) { return; }
  this.library = library;
  if (!io) { return; }
  this.io = io;
  if (!previous_context) {
    this.previous_context = {artist: null, album: null, index: null};
  } else {
    this.previous_context = previous_context;
  }
  if (!context.artist) {
    this.page = 'artists';
    library.get_artists(function (list, tracks) {
      that.menu_items = list;
      that.tracks = tracks;
      that.emit('play_ready');
    });
  } else if (!context.album) {
    this.page = 'albums';
    library.get_albums(function (list, tracks) {
      that.menu_items = list;
      that.tracks = tracks;
      that.emit('play_ready');
    }, context.artist);
  } else {
    this.page = 'tracks';
    library.get_tracks(function (list, tracks) {
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

  this.length = this.tracks.length;
  if (this.index > this.length) {
    this.index = this.length;
  }

  this.draw();

  io.on('next', this.next);
  io.on('prev', this.prev);
  io.on('play_pause', this.select);
  // io.on('mode')
  io.on('menu')
  // io.on('shuffle_all')
}

MenuGUI.super_ = events.EventEmitter;
MenuGUI.prototype = Object.create(events.EventEmitter.prototype, {
  constructor: {
    value: MenuGUI,
    enumerable: false
  }
});

//TODO should have direction
MenuGUI.prototype.draw = function () {
  io.send('display', [this.menu_items[this.index],
                      this.menu_items[this.index + 1]].join("\t")
  );
};

MenuGUI.prototype.next = function () {
  //Scroll protection
  this.index = Math.min(this.index + 1, this.length);
  this.draw();
};

MenuGUI.prototype.prev = function () {
  this.index = Math.max(this.index - 1, 0);
  this.draw();
};

MenuGUI.prototype.select = function () {
  var selected = this.menu_items[this.index];
  var new_gui;
  this.io.clear.bind(io);
  switch (this.page){
    case 'artists':
      return new MenuGUI({artist: selected}, this.context, this.library, this.io);
      break;
    case 'albums':
      return new MenuGUI({artist: this.context.artist, album: selected}, this.context, this.library, this.io);
      break;
    case 'tracks':
      return new PlayGUI(this.tracks, this.context, this.library, this.io);
      break;
  }

  MenuGUI.prototype.open
};

function PlayGUI(tracks, previous_context, library, io) {
    var next, prev, pause, play;
    var playlist = library.make_playlist(tracks);
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