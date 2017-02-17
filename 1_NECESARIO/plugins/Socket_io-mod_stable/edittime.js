function GetPluginSettings()
{
	return {
		"name": "Socket",
		"id": "Socket",
		"description": "Allows you to communicate over the Internet via streaming sockets.",
		"author": "Original work: Zack0Wack0 - LastDataElement modifications by juantar, minify by Johnny Sheffield",
		"help url": "http://www.zack0wack0.com",
		"category": "Web",
		"type":	"object",
		"rotatable": false,
		"dependency":	"socket.io.min.js",
		"flags": pf_singleglobal
	};
};

AddCondition(0,cf_trigger,"On data received","Socket","On data received","Triggered when the socket receives a chunk of data.","OnData");
AddCondition(1,cf_trigger,"On connect","Socket","On connect","Triggered when the socket successfully connects to an address.","OnConnect");
AddCondition(2,cf_trigger,"On error","Socket","On error","Triggered when there is an error connecting to an address.","OnError");
AddCondition(3,cf_trigger,"On disconnect","Socket","On disconnect","Triggered when the socket disconnects from an address.","OnDisconnect");
AddCondition(4, 0, "Is Data Available?", "Socket", "Is Data Available?", "Check if there is still data left in the data stack.", "IsDataAvailable");

AddStringParam("Address","The address (eg. URL or IP) to connect to. Supports cross-domain requests.","\"\"");
AddNumberParam("Port","The port to try and connect to the address through. This should be specific to your server.","80");
AddAction(0,0,"Connect","Socket","Connect to <b>{0}</b>","Connect to an address (eg. URL or IP).","Connect");
AddAction(1,0,"Disconnect","Socket","Disconnect","Disconnect from the current connection.","Disconnect");
AddAnyTypeParam("Data","The data to send through the socket.","\"\"");
AddAction(2, 0, "Send", "Socket", "Send <b>{0}</b>", "Send data through the connection.", "Send");
AddAction(3, 0, "SplitDataReceived", "Socket", "Split Data Received", "Splits the oldest Data Received by comma.", "SplitDataReceived");
AddAnyTypeParam("Event","The event to emit through the socket.","\"\"");
AddAnyTypeParam("Data","The data to emit through the socket.","\"\"");
AddAction(4, 0, "Emit", "Socket", "Send <b>{0}</b>, <i>{1}</i>", "Emit data through the connection.", "Emit");


AddExpression(0,ef_return_string,"Get last address","Socket","LastAddress","Get the last address that the socket connected to.");
AddExpression(1,ef_return_string,"Get last port","Socket","LastPort","Get the last port that the socket connected through.");
AddExpression(2, ef_return_string, "Get last data", "Socket", "LastData", "Get the last chunk of data that was received via the socket. (Warning: this exression actually manupalates the data stack, be careful when evaluating it in Construct)");

AddNumberParam("Index", "Array Index of the element to get");
AddExpression(3, ef_return_string, "Get Received Data Element","Socket",	"LastDataElement", "The element at Index if the received data is splited by a comma.");
ACESDone();

var property_list = [
];

function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");

	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for(property in property_list)
		this.properties[property.name] = property.initial_value;
}
IDEInstance.prototype.OnCreate = function()
{
}
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
IDEInstance.prototype.Draw = function(renderer)
{
}
IDEInstance.prototype.OnRendererReleased = function()
{
}
