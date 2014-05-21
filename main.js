
var library_dir = './Test/new';


var fs       = require('fs');
var find     = require('find');

var io       = require('./io');
var Library  = require("./db");

console.log("Setting up...");

// var gui_menu_context = true;
// var inital_track_context = {artist: null, album: null, track: null};

// var gui = new GUI.MenuGUI( Library.get_context(inital_track_context) );

// var playlist = 

function main(io) {

  // io.on('next', function (){
  //   if (gui_menu_context) {
  //     var display = gui.next();
  //     io.display(display);
  //   } else {

  //   }
  // });


  Library.get_tracks(function (list, tracks) {
    var next, prev, play_pause, play;
    var playlist = Library.make_playlist(tracks);


    playlist.on("play", function (tags) {
      //TODO some gui module should control display formatting
      console.log("Now playing " + tags.title);
      io.display(tags.artist + "\t" + tags.title + " - " + tags.album);
    });
    playlist.on('stop', io.clear.bind(io));

    next       = playlist.next.bind(playlist);
    prev       = playlist.prev.bind(playlist);
    play_pause = playlist.play_pause.bind(playlist);
    play       = playlist.play.bind(playlist);

    io.on('prev', prev);
    io.on('next', next);
    io.on('play_pause', play_pause);
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
require("repl").start({
  useGlobal: true
});