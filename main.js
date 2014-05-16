
var library_dir = './Test/new';


var fs       = require('fs');
var find     = require('find');

var io       = require('./io');
var Library  = require("./db");

console.log("Setting up...");


function main(io) {
  Library.get_tracks(function (list, tracks) {
    var next, prev, pause, play;
    var playlist = Library.make_playlist(tracks);

    playlist.on("play", function (tags) {
      console.log("Now playing " + tags.title);
      io.send('display', tags.artist + "\t" + tags.title + " - " + tags.album);
    });
    playlist.on('stop', io.clear.bind(io));

    next  = playlist.next.bind(playlist);
    prev  = playlist.prev.bind(playlist);
    pause = playlist.pause.bind(playlist);
    play  = playlist.play.bind(playlist);

    io.on('prev', prev);
    io.on('next', next);
    // io.on()

    playlist.play();
  }, 'Seventeen Seconds');
}

Library.init(library_dir, function () {
  io.open(main);
});

//testing purposes 
require("repl").start({
  useGlobal: true
});