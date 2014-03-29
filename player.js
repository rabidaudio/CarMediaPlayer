
//var Player = require('player');
var ID3 = require('id3');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var through = require('through');
//var ps = require('pause-stream')();
var events = require("events");

module.exports = function P(file, callback){
	if(!file) return;
	this.file = file;
	this.speaker = new Speaker({
	  channels: 2,          // 2 channels
	  bitDepth: 16,         // 16-bit samples
	  sampleRate: 44100     // 44,100 Hz sample rate
	});
	//-->x.pipe(speaker);
	//speaker.end();
	this.decoder = new lame.Decoder();

	var that = this;
	this.buffer = fs.createReadStream(file);
	this.t = through(function(data){
		that.seek_position += data.length;
		console.log(that.seek_position);
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

	this.prototype = events.EventEmitter;
	
	this.play = function(){
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
	};
	this.stop = function(){
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
	this.pause = function(){
		console.log("pause called");
		if(this.paused || !this.playing) return false;
		console.log("pausing...");
		this.t.pause();
		this.paused = true;
		//return true;
		this.emit("pause");
	}


}

/*
	player.on('playing',function(item){
	    console.log('im playing... src:' + item.src);
		fs.readFile(item.src, {}, function(err, data){
			console.log(data);
			var tags = new ID3(data).getTags();
			console.log(tags);
			serialPort.write(tags.TSOP.data+"\t"+tags.TIT2.data);
		});
	});*/