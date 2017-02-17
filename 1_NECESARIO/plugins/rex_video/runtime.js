// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_Video = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.Rex_Video.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// Not supported in directCanvas
		if (this.runtime.isDomFree)
			return;
            
        this.elem = document.createElement("video");
        var source = document.createElement('source');
        this.elem.appendChild(source);
        source.src = this.properties[0]; 
        //  append other sources
        source = document.createElement('source');
        this.elem.appendChild(source);
        source.src = this.properties[1];  
        source = document.createElement('source');
        this.elem.appendChild(source);
        source.src = this.properties[2];
        //          
        this.elem.poster = this.properties[3];            
        this.elem.autoplay = (this.properties[4]==1); 
        this.elem.controls = (this.properties[5]==1);   
        this.elem.preload = ["auto","metadata","none"][this.properties[6]];
        this.elem.loop = (this.properties[7]==1);  
        this.elem.muted = (this.properties[8]==1);
        this.elem.id = this.properties[9];
      
        jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
        
        this._pre_ended = false;
        this._checked_is_playing = false;
							
		this.updatePosition();
		
		this.runtime.tickMe(this);
		
		this.currentTimeSave = null;
	};
	
	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
			return;
            
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
        this.check_ended();
        this.check_playing();
	};
	
	instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
			
		jQuery(this.elem).show();
		
		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};
	    
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function(glw)
	{
	};
    	
	instanceProto.check_ended = function ()
	{
        if (!this._pre_ended && this.elem.ended)
        {
            this._checked_is_playing = false;
            this.runtime.trigger(cr.plugins_.Rex_Video.prototype.cnds.OnEnded, this);
		}
            
        this._pre_ended = this.elem.ended;
	};    
	
	instanceProto.check_playing = function()
	{		
		if((!this._checked_is_playing) && 
		   (this.elem.currentTime != this.elem.initialTime))
		{		        
			this._checked_is_playing = true;
			this.runtime.trigger(cr.plugins_.Rex_Video.prototype.cnds.OnPlay, this);				
		}
	};

	instanceProto.IsPlaying = function()
	{		
		return ((!this.elem.paused) && (!this.elem.ended));
	};	
	
	instanceProto.saveToJSON = function ()
	{ 
		return { "src0": this.elem.children[0].src,
		         "src1": this.elem.children[1].src,
		         "src2": this.elem.children[2].src,
                 "ctl": this.elem.controls,
                 "vol": this.elem.volume,
                 "post": this.elem.poster,
                 "lop": this.elem.loop,
                 "mut": this.elem.muted,
                 "ap": this.elem.autoplay,
                 "vis": this.visible,
                 "ct": this.elem.currentTime,
                 "ip": this.IsPlaying(),
                 };
	};
    
	instanceProto.loadFromJSON = function (o)
	{
	    this.elem.children[0].src = o["src0"];
        this.elem.children[1].src = o["src1"];
        this.elem.children[2].src = o["src2"];
        this.elem.controls = o["ctl"];
        this.elem.volume = o["vol"];
        this.elem.poster = o["post"];
        this.elem.loop = o["lop"];  
        this.elem.muted = o["mut"];  
        this.elem.autoplay = o["ap"];
        this.visible = o["vis"];
        this.currentTimeSave = o["ct"];
        
        var is_playing = o["ip"];
        if (is_playing && (this.elem.autoplay == 0))
        {
            var video_obj = this.elem;
            var plugin = this;
            video_obj.addEventListener("canplay", 
                function()
                {
                    log("play");
                    video_obj.currentTime = plugin.currentTimeSave;
                    video_obj.play();
                }
            );            
        }
	}; 
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();
    
	Cnds.prototype.OnEnded = function ()
	{
		return true;
	};
	
	Cnds.prototype.IsEnded = function ()
	{
		return this.elem.ended;
	};
	
	Cnds.prototype.OnPlay = function ()
	{
		return true;
	};	
	
	Cnds.prototype.IsPlaying = function ()
	{
		return this.IsPlaying();
	};    
	
	Cnds.prototype.CompareCurrentTime = function (cmp, d)
	{
	    if (this.IsPlaying())	        
		    return cr.do_cmp(this.elem.currentTime, cmp, d);
		else
		    return false;
	};	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();

	Acts.prototype.SetSource = function (src)
	{
		this.elem.children[0].src = src;
	};      
    
	Acts.prototype.Play = function ()
	{	    
        this._checked_is_playing = false;		    
		this.elem.play();	
	};  

	Acts.prototype.Stop = function ()
	{
		this.elem.pause();
		this.elem.initialTime = 0;
		this.elem.currentTime = 0;
		this._checked_is_playing = false;
	};  
	Acts.prototype.Pause = function ()
	{
		this._checked_is_playing = false;
		this.elem.pause();
	}; 

	Acts.prototype.SetControls = function (is_enable)
	{
		this.elem.controls = (is_enable==1);
	};   

	Acts.prototype.SetVolume = function (volume)
	{
		this.elem.volume = cr.clamp(volume, 0, 1);
	};   
    
	Acts.prototype.SetPoster = function (poster)
	{
		this.elem.poster = poster;
	};      

	Acts.prototype.SetLoop = function (is_enable)
	{
		this.elem.loop = (is_enable==1);
	};

	Acts.prototype.SetMuted = function (is_enable)
	{
		this.elem.muted = (is_enable==1);
	};

	Acts.prototype.SetAutoplay = function (is_enable)
	{
		this.elem.autoplay = (is_enable==1);
	};    
	
	Acts.prototype.SetVisible = function (vis)
	{		
		this.visible = (vis !== 0);
	};
	
	Acts.prototype.Seek = function (t)
	{		
	    if (!this.elem.currentTime)
	        return;
		this.elem.currentTime = t;
	};   
	
	Acts.prototype.Image2Canvas = function (objType)
	{		
	    if (objType == null)
	        return;
	    
		var sol = objType.getCurrentSol();
		var instances;
		if (sol.select_all)
			instances = sol.type.instances;
		else
			instances = sol.instances;
        var i, cnt=instances.length, canvas_obj, ctx;
        debugger;
        for (i=0; i<cnt; i++)
        {
            canvas_obj = instances[i];
            ctx = canvas_obj.ctx;
            ctx.save();
			ctx.scale(canvas_obj.canvas.width/this.elem.videoWidth, canvas_obj.canvas.height/this.elem.videoHeight);
			ctx.rotate(-canvas_obj.angle);
			ctx.translate(-canvas_obj.bquad.tlx, -canvas_obj.bquad.tly);            
			ctx.drawImage(this.elem, 0, 0);
			ctx.restore();
        }
        this.runtime.redraw = true;
	};   	
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
	Exps.prototype.CurrentTime = function (ret)
	{
		ret.set_float(this.elem.currentTime);
	};
	
	Exps.prototype.IsPaused = function (ret)
	{
		ret.set_int(this.elem.paused);
	};  
	
	Exps.prototype.IsMuted = function (ret)
	{
		ret.set_int(this.elem.muted);
	};  
	
	Exps.prototype.Volume = function (ret)
	{
		ret.set_float(this.elem.volume);
	};     
	
	Exps.prototype.ReadyState = function (ret)
	{
		ret.set_int(this.elem.readyState);
	};  
	     
	Exps.prototype.SourceHeight = function (ret)
	{
		ret.set_float(this.elem.videoHeight);
	};  
		
	Exps.prototype.SourceWidth = function (ret)
	{
		ret.set_float(this.elem.videoWidth);
	};  	
}());