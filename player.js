
//var Player = require('player');
var ID3 = require('id3');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var through = require('through');
//var ps = require('pause-stream')();
var events = require("events");

function P(file, callback){
	if(!file) return;
	this.file = file;
	this.speaker = new Speaker({
	  channels: 2,          // 2 channels
	  bitDepth: 16,         // 16-bit samples
	  sampleRate: 44100     // 44,100 Hz sample rate
	});
	this.decoder = new lame.Decoder();

	this.buffer = fs.createReadStream(file);

	var that = this;
	this.t = through(function(data){
		that.seek_position += data.length;
		//console.log(that.seek_position);
		this.queue(data);
	}, function(){
		console.log("end");
		this.queue(null);
	});
	
	this.playing = false;
	this.paused = false;
	this.seek_position = 0;

	this.id3 = new ID3(fs.readFileSync(file));
	this.tags = this.id3.getTags();
	events.EventEmitter.call(this);
}

P.super_ = events.EventEmitter;
P.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: P,
        enumerable: false
    }
});

P.prototype.play = function(){
	console.log("play called");
	if(this.playing) return true;
	if(this.paused){
		this.t.resume();
		this.paused = false;
		this.playing = true;
	}else{
		//this.buffer.pipe(this.decoder).pipe(this.speaker);
		this.buffer.pipe(this.t).pipe(this.decoder).pipe(this.speaker);
		this.playing = true;
	}
	this.emit("play", this.tags);
	//return this.tags.TSOP.data+"\t"+this.tags.TIT2.data;
}
P.prototype.stop = function(){
	console.log("stop called");
	if(!this.playing) return false;
	console.log("stopping");
	this.t.pause();
	this.speaker.end();
	//this.decoder.end();
	//this.t.end();
	//this.buffer.stop();
	//return true;
	this.emit("stop");
};
P.prototype.pause = function(){
	console.log("pause called");
	if(this.paused || !this.playing) return false;
	console.log("pausing...");
	this.t.pause();
	this.paused = true;
	//return true;
	this.emit("pause");
}

module.exports = P;