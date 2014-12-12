/*global global define module clearInterval setTimeout*/
;(function(root){

    try {root = window;} catch(e){ try {root = global;} catch(f){} }
    
    function Timelapse(time){
	this.callback = null;
	this.time = time;
	this.paused = undefined;
	
	this._timer = null;
	this._start = 0;
	this._stop = 0;
    }

    Timelapse.prototype = {
	_tick: function(time){
	    if(!this.paused){
		time = time || this.time;
		this._start = Date.now();
		this._timer = setTimeout(this._tock.bind(this),time);
	    }
	},
	_tock: function(){
	    if(!this.callback || this.paused) return;
	    
	    try {
		this.callback();
	    } catch(e){
		this.stop();
		if(typeof(this.onerror) !== 'function') this.throw(e);
		else this.onerror(e);
	    }

	    this._tick();
	},
	start: function(fn,time){
	    if(time) this.time = time;
	    else time = this.time;

	    if(typeof(fn) === 'function'){
		this.callback = fn;
	    }

	    if(this.paused === false){
		this.stop();
	    }
	    
	    if(this._stop){
		time = time - (this._stop - this._start);

		this._stop = 0;
		
		if(time <= 0) time = this.time;
	    }
	    
	    this.paused = false;
	    this._tick(time);
	},
	stop: function(){
	    if(!this.paused){
		this._stop = Date.now();
		clearInterval(this._timer);
		this.paused = true;
	    }
	},
	reset: function(){
	    this.paused = undefined;
	    this._start = 0;
	    this._stop = 0;
	}
    };

    if(module && module.exports) module.exports = Timelapse;
    else if(typeof define ==='function' && define.amd) define(Timelapse);
    else root.Timelapse = Timelapse;

}(this));