var _ = require('underscore');
var Player = require('./player');

module.exports = function Playlist(file_array){
	this.players = [];
	this.files = file_array;
	var that = this;
	_.each(file_array,function(e,i,a){
		that.players.push( new Player(e) );
	});
	this.now_playing = 0;
	this.length = this.files.length;

	this.change = function(index){
		this.players[this.now_playing].stop();
		this.now_playing = index;
		return this.players[this.now_playing].play();
	}
	this.next = function(){
		if(this.now_playing == this.length) return false;
		return this.change(this.now_playing+1);
	}
	this.prev = function(){
		if(this.now_playing == 0) return false;
		return this.change(this.now_playing-1);
	}

	this.play = function(){
		return this.players[this.now_playing].play();
	}
	this.pause = function(){
		this.players[this.now_playing].pause();
	}

	this.stop = function(){
		this.players[this.now_playing].stop();
	}

	this.current = function(){
		return this.players[this.now_playing];
	}
	this.on = function(event_name, callback){
		_.each(this.players,function(e,i,a){
			this.players.on(event_name, callback);
		});
	}
}