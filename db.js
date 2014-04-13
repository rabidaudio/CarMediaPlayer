var fs      = require('fs');
var find    = require('find');
var Nosql   = require('nosql');
var shuffle = require('shuffle-array');
var _       = require('underscore');

var getTags = require('./tags');

var library_dir = './Test/new';
var db_file = 'test.nosql';

function Library(directory, callback) {
  var nosql = Nosql.load(db_file);
  nosql.on('error', function (err) {
    console.error(err);
  });
  nosql.clear();

  find.file(/\.mp3$/, directory, function (files) {
    var tags = [];
    var i;
    for (i in files) {
      tags.push(getTags(files[i]));
    }
    nosql.insert(tags, function () {
      console.log("Library created.");
      callback();
    });
  });
  this.nosql = nosql;
}

Library.prototype.get_artists = function (callback) {
  this.nosql.all(function (doc) {
    return doc;
  }, function (results) {
    var artists = _.chain(results)
      .sortBy(function (e) {
        return e.artist_sort;
      })
      .pluck('artist')
      .uniq(true)
      .value();
    console.log(artists);
    callback(artists);
  });
};

var debug = new Library(library_dir, function(){
  debug.get_artists(function(a){console.log(a);});
});

// module.exports = new Library(library_dir);