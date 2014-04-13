var ID3 = require('id3');
var fs  = require('fs');

// https://www.npmjs.org/package/musicmetadata

require('./hasProp');

function Tags(file) {
  var id3 = new ID3(fs.readFileSync(file));
  var tags = id3.getTags();
  var data = {
    file        : file,
    raw_tags    : tags,
    artist      : tags.TPE1.data || '',
    artist_sort : tags.TSOP.data || tags.TPE1.data || '',
    album       : tags.TALB.data || '',
    album_stort : tags.TSOA.data || tags.TALB.data || '',
    title       : tags.TIT2.data || '',
    track_num   : tags.TRCK.data.match(/^[0-9]+/)[0],
    year        : tags.TYER.data || '',
    genre       : (tags.TCON.data || '').split(/\s?\/\s?/),
  };
  data.db_format = {
    //$id          : null,
    $file        : file,
    $kind        : "mp3",
    $artist      : data.artist,
    $artist_sort : data.artist_sort,
    $album       : data.album,
    $album_stort : data.album_stort,
    $title       : data.title,
    $track_num   : data.track_num,
    $year        : data.year,
    $genre       : data.genre,
  };
  return data;
}

/*function db_format(){
    return {
        $file: this.file,
        $kind: "mp3",
        $artist: this.artist,
        $artist_sort: this.artist_sort,
        $album: this.album,
        $album_stort:this.album_stort,
        $title:this.title,
        $track_num:this.track_num,
        $year:this.year,
        $genre:this.genre,
    };
}*/

module.exports = Tags;

// { TIT2: 
//    { id: 'TIT2',
//      size: 19,
//      description: 'Title/songname/content description',
//      data: 'At Night' },
//   TPE1: 
//    { id: 'TPE1',
//      size: 19,
//      description: 'Lead performer(s)/Soloist(s)',
//      data: 'The Cure' },
//   TRCK: 
//    { id: 'TRCK',
//      size: 5,
//      description: 'Track number/Position in set',
//      data: '9/10' },
//   TALB: 
//    { id: 'TALB',
//      size: 37,
//      description: 'Album/Movie/Show title',
//      data: 'Seventeen Seconds' },
//   TPOS: 
//    { id: 'TPOS',
//      size: 4,
//      description: 'Part of a set',
//      data: '1/1' },
//   TCON: 
//    { id: 'TCON',
//      size: 11,
//      description: 'Content type',
//      data: 'Rock' },
//   TMED: 
//    { id: 'TMED',
//      size: 7,
//      description: 'Media type',
//      data: 'CD' },
//   TXXX: 
//    [ { id: 'TXXX',
//        size: 27,
//        description: 'User defined text information frame',
//        data: 'SCRIPT' },
//      { id: 'TXXX',
//        size: 61,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Album Type' },
//      { id: 'TXXX',
//        size: 133,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Album Artist Id' },
//      { id: 'TXXX',
//        size: 121,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Artist Id' },
//      { id: 'TXXX',
//        size: 45,
//        description: 'User defined text information frame',
//        data: 'BARCODE' },
//      { id: 'TXXX',
//        size: 119,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Album Id' },
//      { id: 'TXXX',
//        size: 51,
//        description: 'User defined text information frame',
//        data: 'CATALOGNUMBER' },
//      { id: 'TXXX',
//        size: 35,
//        description: 'User defined text information frame',
//        data: 'ASIN' },
//      { id: 'TXXX',
//        size: 71,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Album Status' },
//      { id: 'TXXX',
//        size: 77,
//        description: 'User defined text information frame',
//        data: 'MusicBrainz Album Release Country' } ],
//   COMM: 
//    { id: 'COMM',
//      size: 68,
//      description: 'Comments',
//      data: 
//       { language: 'eng',
//         short_description: '',
//         text: 'Amazon.com Song ID: 206576895T\u0000' } },
//   TSO2: 
//    { id: 'TSO2',
//      size: 21,
//      description: 'Unknown',
//      data: 'Cure, The' },
//   TPE3: 
//    { id: 'TPE3',
//      size: 3,
//      description: 'Conductor/performer refinement',
//      data: 'T\u0000' },
//   TPE2: 
//    { id: 'TPE2',
//      size: 19,
//      description: 'Band/orchestra/accompaniment',
//      data: 'The Cure' },
//   PRIV: 
//    { id: 'PRIV',
//      size: 8207,
//      description: 'Private frame',
//      data: undefined },
//   TCOP: 
//    { id: 'TCOP',
//      size: 55,
//      description: 'Copyright message',
//      data: '1980 Elektra Entertainment' },
//   APIC: 
//    { id: 'APIC',
//      size: 147475,
//      description: 'Attached picture',
//      data: 
//       { format: 'image/jpeg',
//         type: 'Cover (back)',
//         description: '' } },
//   UFID: 
//    { id: 'UFID',
//      size: 59,
//      description: 'Unique file identifier',
//      data: undefined },
//   TSOP: 
//    { id: 'TSOP',
//      size: 21,
//      description: 'Unknown',
//      data: 'Cure, The' },
//   TCOM: 
//    { id: 'TCOM',
//      size: 3,
//      description: 'Composer',
//      data: 'T\u0000' },
//   TYER: 
//    { id: 'TYER',
//      size: 11,
//      description: 'Year',
//      data: '1988' },
//   TORY: 
//    { id: 'TORY',
//      size: 11,
//      description: 'Original release year',
//      data: '1980' },
//   TPUB: 
//    { id: 'TPUB',
//      size: 17,
//      description: 'Publisher',
//      data: 'Elektra' },
//   TLAN: 
//    { id: 'TLAN',
//      size: 9,
//      description: 'Language(s)',
//      data: 'eng' },
//   id3: 
//    { version: '2.3.0',
//      major: 3,
//      unsync: false,
//      xheader: false,
//      xindicator: false,
//      size: 157696 } }