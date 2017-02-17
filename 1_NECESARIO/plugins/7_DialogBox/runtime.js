// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.DialogBox = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.DialogBox.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

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

	instanceProto.onCreate = function()
	{
		this.getinput = " ";
		this.ConfirmOK = false;
		this.ConfirmCancel = false; 
		this.InputOK = false;
		this.InputCancel = false; 
		this.InputState = true; 
	};

	
	//////////////////////////////////////
	//Actions/////////////////////////////
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	//ACTION AddAlert
	acts.AddAlert = function (msgAlert)
	{
		alert(msgAlert.toString());
	};
	
	//ACTION AddInput
	acts.AddInput = function (msgInput, defaultInput)
	{
		this.getinput = prompt(msgInput, defaultInput);
		switch(this.getinput)
		{ 
		case "" :  			    this.InputState = true;
								return false;
								break
		case null : 			this.InputOK = false; 
								this.InputCancel = true; 
								this.InputState = true;
								return false;
								break
		default :  			    this.InputOK = true; 
								this.InputCancel = false; 
								this.InputState = false;
								return true;
								break
		};
		
	};
		
	//ACTION AddConfirm
	acts.AddConfirm = function (msgConfirm)
	{
		var answer = window.confirm(msgConfirm.toString());
		if (answer) 
		{
			this.ConfirmOK = true; 
			this.ConfirmCancel = false; 
		} else {
			this.ConfirmOK = false; 
			this.ConfirmCancel = true; 
		};
	};
	
	
	//////////////////////////////////////
	//Conditions/////////////////////////
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//CONDITION isConfirmOkClicked
	cnds.isConfirmOkClicked = function ()
	{	
		return this.ConfirmOK; 
	};
	
	//CONDITION isConfirmCancelClicked
	cnds.isConfirmCancelClicked = function ()
	{	
		return this.ConfirmCancel;
	};
	
	//CONDITION isInputOkClicked
	cnds.isInputOkClicked = function ()
	{	
		return this.InputOK;
	};
	
	//CONDITION isInputCancelClicked
	cnds.isInputCancelClicked = function ()
	{	
		return this.InputCancel; 
	};
	
	//CONDITION isInputEmpty
	cnds.isInputEmpty = function ()
	{	
		return this.InputState;
	};
	

	
	//////////////////////////////////////
	//Expressions/////////////////////////
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	//CONDITION getInputText	
	exps.getInputText = function (ret)
	{
		ret.set_any(this.getinput);
	};
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}());