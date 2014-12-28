fs      = require('fs');
lame    = require('lame');
Speaker = require('speaker');
through = require('through');
stream_length = require('length-stream');

decoder = new lame.Decoder();
speaker = new Speaker();
buffer = fs.createReadStream('Test/chirp.mp3');

bigbuff = new Buffer(0);

t = through(function (data){
    // bigbuff = Buffer.concat([bigbuff, data]);
    this.queue(data);
}, function(){
    this.queue(null);
});

function streamLength(length){
    cosole.log(length + " bytes");
    console.log((length+0.0)/41100/4 + 'seconds');
}

lstream = stream_length(streamLength);

var time_skip = 1;
var skip_ahead = 0*time_skip*41100*2*2;


function seekAhead(stream, skip_ahead, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  var header = '';
  function onReadable() {
    var chunk;
    while (null !== (chunk = stream.read())) {
      skip_ahead -= chunk.length;
      if (skip_ahead<=0) {
        // found the boundary
        var overshoot = chunk.slice(0 - skip_ahead);

        if (overshoot.length){
            stream.unshift(overshoot);
        }
        stream.removeListener('error', callback);
        stream.removeListener('readable', onReadable);
        // now the body of the message can be read from the stream.
        callback(stream);
      } else {
        // still reading the header.
      }
    }
  }
}

function onErr(error){
    console.error(error);
    // console.log(this);
}

buffer.on('error', onErr);
decoder.on('error', onErr);
speaker.on('error', onErr);


decoder.on('readable', function () {
    var buf = decoder.read(5);
    console.dir(buf);
    decoder.read(0);
});

decoder.on('format', function(data){console.log(data);});


//.pipe(t)
buffer.pipe(decoder);
// seekAhead(decoder, 0, function(d){
//     d.pipe(speaker);
// });
// decoder.pipe(t);
// t.pipe(speaker);
// decoder.pipe(speaker);

speaker.on('end', function(){console.log("end");});

require("repl").start({
  useGlobal: true
});