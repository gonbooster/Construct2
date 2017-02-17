// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.imageButton = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.imageButton.prototype;
		
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
		// variables
		this.disabled = [true,false][this.properties[4]]; //permet de définir quand le bouton est disabled
		
		// defini le curseur
		var style_css = "<style type=\"text/css\">  .imagebutton{ cursor: default; } </style>";
		jQuery(style_css).appendTo("head");
		
		// preload les trois images //A VERIFIER
		var load_image = new Image();
		var image_url = new Array();
		image_url[0] = this.properties[0];
		image_url[1] = this.properties[1];
		image_url[2] = this.properties[2];
		image_url[3] = this.properties[3];
		var i = 0;
		for(i = 0; i <= 3; i++) 
		{ load_image.src = image_url[i]; };
			
		// create button	
		this.elem = document.createElement("img");
		this.elem.className = "imagebutton";
		if (this.properties[5] != "") { this.elem.id = this.properties[5]; };
		if (this.disabled == true) { this.elem.src = this.properties[3]; } else { this.elem.src = this.properties[0]; };
		
		//append
		jQuery(this.elem).appendTo("body");		

		
		//on click
		this.elem.onclick = (function (self) {
			return function() {
			self.runtime.trigger(cr.plugins_.imageButton.prototype.cnds.onClicked, self);
			//if (self.disabled == false) { self.elem.src = self.properties[2]; };
			}; })(this);
			
		//hover
		this.elem.onmouseover = (function (self) {
			return function() {
			if (self.disabled == false && self.properties[1] != "") { self.elem.src = self.properties[1]; };
			}; })(this);
		this.elem.onmouseout = (function (self) {
			return function() {
			if (self.disabled == false && self.properties[1] != "") { self.elem.src = self.properties[0]; };
			}; })(this);	
			
		//on down - on release	
		this.elem.onmousedown = (function (self) {
			return function() {
			if (self.disabled == false) { self.elem.src = self.properties[2]; };
			}; })(this);	
		this.elem.onmouseup = (function (self) {
			return function() {
			if (self.disabled == false) { self.elem.src = self.properties[0]; };	
			}; })(this);
		this.elem.onmouserelease = (function (self) {
			return function() {
			if (self.disabled == false) { self.elem.src = self.properties[0]; };
			}; })(this);
		
		// prevent drag n drop
		this.elem.ondragstart = function() { return false; };
			
		//bloque le clic droit
		this.elem.oncontextmenu = function() { return false; };

		this.updatePosition();
		this.runtime.tickMe(this);
	};

	instanceProto.draw = function ()
	{
	};	
		
	instanceProto.drawGL = function(glw)
	{
	};
				
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
		
	instanceProto.tick = function ()
	{
		this.updatePosition();
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
		
		//Truncate to canvas size
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
	

	//////////////////////////////////////
	//Actions/////////////////////////////
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	

	acts.enabledButton = function ()
	{
		this.disabled = false;
		this.elem.src = this.properties[0];
	};

	acts.disabledButton = function ()
	{
		this.disabled = true;
		this.elem.src = this.properties[3];			
	};
	
	
	//////////////////////////////////////
	//Conditions/////////////////////////
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	
	cnds.onClicked = function () 
	{
		if (this.disabled == false) { return true; };
	};

	cnds.isDisabled = function () 
	{
		return this.disabled;
	};	

	//////////////////////////////////////
	//Expressions/////////////////////////
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}());