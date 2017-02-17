// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.URLImage = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.URLImage.prototype;
		
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
		
		// any other properties you need, e.g...
		this.imageObj = new Image();
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		//this.imageObj.src = "http://static4.scirra.net/images/logo.png";
	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
		ctx.drawImage(this.imageObj, this.x, this.y, this.width,
						  this.height);
	};

	//////////////////////////////////////
	// Conditions

	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.LoadURL = function (myparam)
	{
		this.imageObj.src = myparam;
		//this.runtime.redraw = true;
	};
	
	//////////////////////////////////////
	// Expressions
	// pluginProto.exps = {};
	// var exps = pluginProto.exps;
	
	////the example expression
	// exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	// {
		// ret.set_int(1337);				// return our value
	//	ret.set_float(0.5);			// for returning floats
	//	ret.set_string("Hello");		// for ef_return_string
	//	ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	// };

}());