function GetPluginSettings()
{
	return {
		"name":			"Image Button",
		"id":			"imageButton",
		"version":    	"0.1",
		"description":	"Create a button with customized image", 
		// iScroll is a project created by Matteo Spinelli's - More informations on the project website - http://cubiq.org/iscroll-4
		"author":		"Gregory Georges",
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/ImageButton.html",
		"category":		"Form controls",
		"type":			"world",			// in layout
		"rotatable":	false,
		"flags":		pf_size_aces | pf_position_aces/*,
		"dependency":   ""*/
		
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

//////////////////////////////////////////////////////////////
// Actions////////////////////////////////////////////////////


AddAction (0, 0, "Enabled", "Image Button", "Enabled Image Button", "Enabled the image button", "enabledButton");
AddAction (1, 0, "Disabled", "Image Button", "Disabled Image Button", "Disabled the image button", "disabledButton");


//////////////////////////////////////////////////////////////
// Conditions ////////////////////////////////////////////////

	
AddCondition(0, cf_trigger, "On clicked", "Image Button", "On clicked", "Triggered when the image button is clicked.", "onClicked");
AddCondition(1, 0, "Is disabled", "Image Button", "Is disabled", "Return true when the image button is disabled.", "isDisabled");
//////////////////////////////////////////////////////////////
// Expressions////////////////////////////////////////////////

/*get inputText
	AddAnyTypeParam("\">input line ID<\"", "Set the ID of the input line :", "\"\""); 
AddExpression(0, ef_return_string, "Get input text", "General", "inputText", "Get the input form's text.");*/


ACESDone();


//////////////////////////////////////////////////////////////
//PROPERTIES//////////////////////////////////////////////////
var property_list = [

//*MAIN*/new cr.Property(ept_link, "▬ General", "", "","", "readonly"),
	/*00*/new cr.Property(ept_text,   	 "Normal",				 "",		"Choose the picture for the normal status of your image button."),
	/*01*/new cr.Property(ept_text,   	 "▫ Hover (Optional)",	 "",		"Choose the picture displayed when the cursor is over the image button (Optional)"),	
	/*02*/new cr.Property(ept_text,  	 "Pressed",				 "",		"Choose the picture for the pressed status of your image button."),
	/*03*/new cr.Property(ept_text,  	 "Disabled",			 "",		"Choose the picture for the disabled status of your image button."),
	/*04*/new cr.Property(ept_combo,  	 "▫ Disabled at start",	 "No",		"Choose whether the image button is disabled at start.", "Yes|No"),		
	/*05*/new cr.Property(ept_text,  	 "ID (Optional)",	   	 "", 		"Set an ID to the image button (Optional)"),
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


	this.font = null;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(77, 28));
}

// Called when double clicked in layout
IDEInstance.prototype.OnClicked = function()
{

}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{

}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{	
	//renderer.LoadTexture('test.png');
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 10, false, false); 

	
	renderer.SetTexture(null);
	var q = this.instance.GetBoundingQuad();
	if (this.properties["▫ Disabled at start"] == "Yes") 
	{ renderer.Fill(q, cr.RGB(170, 170, 170)); } else { renderer.Fill(q, cr.RGB(220, 220, 220)); }
	renderer.Outline(q,cr.RGB(0, 0, 0));
	
	var d = this.instance.GetSize(); // get the instance size
	
	cr.quad.prototype.offset.call(q, 0, 6);
	if (this.properties["▫ Disabled at start"] == "Yes") 
	{
						this.font.DrawText("Disabled I-B", 
							q,
							cr.RGB(110, 110, 110), 
							ha_center);	
	} else {
						this.font.DrawText("Image Button", 
							q,
							cr.RGB(0, 0, 0), 
							ha_center);	
	};
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
	//renderer.ReleaseTexture('test.png');
}



