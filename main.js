
var library_dir = './Test/new';


var fs = require('fs');
var find = require('find');
var shuffle = require('shuffle-array');

var Playlist = require('./playlist');
var io = require('./io');


console.log("Setting up...");

//var playlist;

function main(io) {
  find.file(/\.mp3$/, library_dir, function (files) {
    var next, prev, pause, play, i;

    shuffle(files);
    for (i = 0; i < files.length; i++) {
      files[i] = fs.realpathSync(files[i]);
    }

    var playlist = new Playlist(files);
    playlist.on("play", function (tags) {
      console.log("Now playing " + tags.title);
      io.send('display', tags.artist + "\t" + tags.title + " - " + tags.album);
    });

    next  = playlist.next.bind(playlist);
    prev  = playlist.prev.bind(playlist);
    pause = playlist.pause.bind(playlist);
    play  = playlist.play.bind(playlist);

    io.on('prev', prev);
    io.on('next', next);
    //io.on('prev', pause);
    //io.on('next', play);

    playlist.play();
  });
}

io.open(main);

//testing purposes 
require("repl").start({
  useGlobal: true
});