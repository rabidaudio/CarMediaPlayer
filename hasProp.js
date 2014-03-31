module.exports = (function(){
	if(Object.prototype.hasProp === undefined){
	    Object.defineProperty(Object.prototype, 'hasProp', {
	    value: function() {
	        var args = Array.prototype.slice.call(arguments);
	        for( var i=args.length; i-->0; ){
	            if( typeof args[i] !== "string" ){
	                throw new TypeError(typeof args[i] + " given in place of string");
	            }
	            var period = args[i].indexOf('.');
	            if(period>-1){
	               if(!this[args[i].substr(0, period)].hasProp(args[i].substr(period+1))){
	                   return false;
	               }else{
	                   continue;
	               }
	            }
	            if(this[args[i]]==undefined){
	              return false;
	            }
	        }
	        return true;
	    }, enumerable: false
	    });
	}

	if(Object.prototype.nZ === undefined){
		Object.defineProperty(Object.prototype, 'nZ', {
	    value: function(key, alternate_value) {
	    	return (this.hasProp(key) ? this[key] : alternate_value);
	    }, enumerable: false
	    });
	}
})();