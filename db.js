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

//TODO don't reload the entire library at every boot
Library.init = function (directory, callback) {
  find.file(/\.mp3$/, directory, function (files) {
    var tags = [];
    var t;
    _.forEach(files, function (e, i) {
      t = getTags(e);
      t.id = i;
      tags.push(t);
    });

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
    var tracks;
    var artists = _.chain(results)
      .sortBy(function (e) {
        //clever clever! http://stackoverflow.com/questions/16426774/underscore-sortby-based-on-multiple-attributes
        return [e.artist_sort, e.year, e.album_sort, e.track_num].join("_");
      })
      .tap(function (a) {
        tracks = a;
      })
      .pluck('artist')
      .uniq(true)
      .value();
    callback(artists, tracks);
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
    var tracks;
    var albums = _.chain(results)
      .sortBy(function (e) {
        return [e.artist_sort, e.year, e.album_sort, e.track_num].join("_");
      })
      .tap(function (a) {
        tracks = a;
      })
      .pluck('album')
      .uniq(true)
      .value();
    callback(albums, tracks);
  });
};

Library.get_tracks = function (callback, album, artist) {
  Library.nosql.all(function (doc) {
    if (doc.artist.match(artist) && doc.album.match(album)) {
      return doc;
    }
  }, function (results) {
    var tracks;
    var songs = _.chain(results)
      .sortBy(function (e) {
        return [e.artist_sort, e.year, e.album_sort, e.track_num].join("_");
      })
      .tap(function (a) {
        tracks = a;
      })
      .pluck('title')
      .value();
    callback(songs, tracks);
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