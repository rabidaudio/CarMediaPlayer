var _ = require('underscore');
var Player = require('./player');

function Playlist(file_array){
	this.players = [];
	this.files = file_array;
	var that = this;
	_.each(file_array,function(e,i,a){
		that.players.push( new Player(e) );
	});
	this.now_playing = 0;
	this.length = this.files.length;

	this.players[0].on("pause", function(){
		console.log("playlist pause");
	});
}

Playlist.prototype.change = function(index){
	this.players[this.now_playing].stop();
	this.now_playing = index;
	return this.players[this.now_playing].play();
}
Playlist.prototype.next = function(){
	console.log("playlist next called");
	if(this.now_playing == this.length) return false;
	return this.change(this.now_playing+1);
}
Playlist.prototype.prev = function(){
	console.log("playlist prev called");
	if(this.now_playing == 0) return false;
	return this.change(this.now_playing-1);
}

Playlist.prototype.play = function(){
	return this.current().play();
}
Playlist.prototype.pause = function(){
	return this.current().pause();
}

Playlist.prototype.stop = function(){
	this.current().stop();
}

Playlist.prototype.current = function(){
	return this.players[this.now_playing];
}
Playlist.prototype.on = function(event_name, callback){
	/*_.each(this.players,function(e,i,a){
		this.players[i].on(event_name, callback);
	});*/
	this.current().on(event_name, callback);
}

module.exports = Playlist;