var fs       = require('fs');
var find     = require('find');
var Nosql    = require('nosql');
var shuffle  = require('shuffle-array');
var _        = require('underscore');

var getTags  = require('./tags');
var Playlist = require('./playlist');

var db_file     = 'library.nosql';

var Library = {};

Library.nosql = Nosql.load(db_file);
Library.nosql.on('error', function (err) {
  console.error(err);
});
Library.nosql.clear();

Library.init = function (directory, callback) {
  find.file(/\.mp3$/, directory, function (files) {
    var tags = [];
    var i, t;
    for (i in files) {
      t = getTags(files[i]);
      t.id = i;
      tags.push(t);
    }
    Library.nosql.insert(tags, function () {
      console.log("Library created.");
      callback();
    });
  });
};

Library.get_artists = function (callback) {
  Library.nosql.all(function (doc) {
    return doc;
  }, function (results) {
    var artists = _.chain(results)
      .sortBy(function (e) {
        return e.artist_sort;
      })
      .pluck('artist')
      .uniq(true)
      .value();
    callback(artists);
  });
};

Library.get_albums = function (callback, artist) {
  //TODO optimize by pushing to an array of known albums, and skipping the rest
  //if (!artist) { artist = /.*/; }
  Library.nosql.all(function (doc) {
    if (doc.artist.match(artist)) {
      return doc;
    }
  }, function (results) {
    var albums = _.chain(results)
      .sortBy(function (e) {
        return e.album_sort;
      })
      .pluck('album')
      .uniq(true)
      .value();
    callback(albums);
  });
};

Library.get_tracks = function (callback, album, artist) {
  //if (!artist) { artist = /.*/; }
  //if (!album) { album = /.*/; }
  Library.nosql.all(function (doc) {
    if (doc.artist.match(artist) && doc.album.match(album)) {
      return doc;
    }
  }, function (results) {
    var albums = _.chain(results)
      .sortBy(function (e) {
        return e.track_num;
      })
/*      .map(function (e) {
        return {
          id: e.id,
          title: e.title
        };
      })*/
      .value();
    callback(albums);
  });
};

Library.make_playlist = function (tracks) {
  var files = _.pluck(tracks, 'file');
  return new Playlist(files);
};

/*Library.init(library_dir, function(){
  Library.get_artists(function(a){console.log(a);});
  Library.get_albums(function(a){console.log(a);});
  Library.get_albums(function(a){console.log(a);}, 'The Cure');
  Library.get_tracks(function(a){console.log(a);});
  Library.get_tracks(function(a){console.log(a);}, null, 'The Cure');
  Library.get_tracks(function(a){console.log(a);}, 'Seventeen Seconds');
});*/

module.exports = Library;