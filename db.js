var fs       = require('fs');
var find     = require('find');
// var mongoose = require('mongoose');
var nosql    = require('nosql').load('test.nosql');
var shuffle  = require('shuffle-array');

var Tags     = require('./tags');

// var mongoUri    = 'mongodb://localhost/library';
var library_dir = './Test/new';

// var songSchema = mongoose.Schema({
//  file        : String,
//  kind        : String,
//  artist      : String,
//  artist_sort : String,
//  album       : String,
//  album_sort  : String,
//  title       : String,
//  track_num   : Number,
//  year        : Number,
//  genre       : [String],
// });
// var Song = mongoose.model('Song', songSchema);

// mongoose.connect(mongoUri);

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
    // db.drop();
find.file(/\.mp3$/, library_dir, function (files) {

    //module.exports = new Library(library_dir);
});
// });