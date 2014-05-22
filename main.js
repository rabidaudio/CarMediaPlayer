
var library_dir = './Test/new';


var fs       = require('fs');
var find     = require('find');

var io       = require('./dummy_io');//require('./io');
var Library  = require("./db");

console.log("Setting up...");


function main(io) {
  Library.get_tracks(function (list, tracks) {
    var next, prev, pause, play, play_pause;
    var playlist = Library.make_playlist(tracks);

    playlist.on("play", function (tags) {
      //TODO some gui module should control display formatting
      console.log("Now playing " + tags.title);
      io.send('display', tags.artist + "\t" + tags.title + " - " + tags.album);
    });
    playlist.on('stop', io.clear.bind(io));

    next       = playlist.next.bind(playlist);
    prev       = playlist.prev.bind(playlist);
    play_pause = playlist.play_pause.bind(playlist);
    play       = playlist.play.bind(playlist);

    io.on('prev', prev);
    io.on('next', next);
    // io.on('play_pause', play_pause);

    //I'm sure there is a better way to abstract this, but it looks
    //  elegant in spite of it's verbosity, so we can keep it for now

    playlist.play();
  }, 'Seventeen Seconds');
}

//Initalize library
Library.init(library_dir, function () {
  //When library is ready, connect to IO device
  //  and start main function
  io.open(main);
});

//testing purposes 
// require("repl").start({
//   useGlobal: true
// });