
var ID3 = require('id3');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var through = require('through');
var events = require("events");

function create_speaker(){
	return new Speaker({
	  channels: 2,          // 2 channels
	  bitDepth: 16,         // 16-bit samples
	  sampleRate: 44100     // 44,100 Hz sample rate
	});
}

function Player(file, seek_position){
	if(!file) return;
	if(!seek_position) seek_position=0;
	this.file = file;
	this.speaker = create_speaker();
	this.decoder = new lame.Decoder();

	this.buffer = fs.createReadStream(file);
	this.buffer.read(seek_position);

	var that = this;
	this.t = through(function(data){
		that.seek_position += data.length;
		console.log(that.seek_position);
		this.queue(data);
	}, function(){
		that.emit("end");
		this.queue(null);
	});
	
	this.playing = false;
	this.paused = false;
	this.seek_position = 0; //ms

	this.id3 = new ID3(fs.readFileSync(file));
	this.tags = this.id3.getTags();
	events.EventEmitter.call(this);
}

Player.super_ = events.EventEmitter;
Player.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Player,
        enumerable: false
    }
});

Player.prototype.play = function(){
	console.log("play called");
	if(this.playing) return true;
	if(this.paused){
		this.decoder.pipe(this.speaker);
		//this.t.resume();
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
Player.prototype.stop = function(){
	if(!this.playing) return false;
	//this.t.pause();
	this.speaker.end();
	this.emit("stop");
};
Player.prototype.pause = function(){
	console.log("pause called");
	if(this.paused || !this.playing) return false;
	//this.t.pause();
	this.speaker.end();
	//make a new one so we can continue later
	this.speaker = create_speaker();
	this.paused = true;
	this.playing = false;
	this.emit("pause");
}

Player.prototype.seek_step = function(){
	this.seek_position += 500;
}

module.exports = Player;