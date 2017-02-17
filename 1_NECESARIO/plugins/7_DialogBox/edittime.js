function GetPluginSettings()
{
	return {
		"name":			"Dialog Box",
		"id":			"DialogBox",
		"version":    	"1.0",
		"description":	"Add dialogs in your project.",
		"author":		"Gregory Georges",
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/DialogBox.html",
		"category":		"Form controls",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Actions ///////////////////////////////////////////////////

//AddAlert
AddAnyTypeParam("Message:", "Add an alert dialog.", "\"\"");
AddAction (0, 0, "Open an alert dialog", "Dialogs Type", "Alert dialog diplays: {0}", "Open an alert dialog, OK button", "AddAlert");
//AddInput
AddAnyTypeParam("Message:", "Add an input dialog.", "\"\"");
AddAnyTypeParam("Input:", "Set a text by default.", "\"\"");
AddAction (1, 0, "Open an input dialog", "Dialogs Type", "Input dialog diplays: {0}, {1}", "Open an input dialog, Input, OK & Cancel buttons", "AddInput");
//AddConfirm
AddAnyTypeParam("Message:", "Add a confirm dialog.", "\"\"");
AddAction (2, 0, "Open a confirm dialog", "Dialogs Type", "Confirm dialog diplays: {0}", "Open a confirm dialog, OK & Cancel buttons", "AddConfirm");


//////////////////////////////////////////////////////////////
// Conditions ////////////////////////////////////////////////

//isConfirmOkClicked
AddCondition(0, 0, "is OK button clicked", "Confirm Dialog", "User clicked on OK (Confirm)", "User clicked on OK button in Confirm dialog", "isConfirmOkClicked");
//isConfirmCancelClicked
AddCondition(1, 0, "is Cancel button clicked", "Confirm Dialog", "User clicked on Cancel (Confirm)", "User clicked on Cancel Button in Confirm dialog", "isConfirmCancelClicked");
//isInputOkClicked
AddCondition(2, 0, "is OK button clicked", "Input Dialog", "User clicked on OK (Input)", "User clicked on OK button in Input dialog", "isInputOkClicked");
//isInputCancelClicked
AddCondition(3, 0, "is Cancel button clicked (except Safari 5.1+)", "Input Dialog", "User clicked on Cancel (Input)", "User clicked on Cancel Button in Input dialog (doen't work in Safari 5.1+)", "isInputCancelClicked");
//isInputEmpty
AddCondition(4, 0, "is Input is empty", "Input Dialog", "Input is empty)", "User let the input as empty", "isInputEmpty");


//////////////////////////////////////////////////////////////
// Expressions ///////////////////////////////////////////////

//getInputText
AddExpression(0, ef_return_any,"getInputText", "Text", "getInputText", "Return text from the input dialog.");


ACESDone();


//////////////////////////////////////////////////////////////
//PROPERTIES//////////////////////////////////////////////////
var property_list = [
];
	
	
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function"); 
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++) //This loop just goes through the property list you defined above and sets the new instance of the object to default values.
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}



