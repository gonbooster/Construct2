/*

VERSION 0.3

IMPORTANT STUFF

This plugin lets you use some of Playtomic's features, such as counting the number of people who have played your game, or died on level X. You will need a Playtomic  account to use it in your project. Not all Playtomic features are supported (see below for details).

!!!This is not an official Playtomic plugin!!!
!!!This is not an official Scirra or Construct 2 plugin!!!

It's just something quick I made out of necessity. It probably has bugs. We are not
guaranteeing that it will work, or that we will fix it.

The Playtomic documentation recommends that you obfuscate the project's SWFID, GUID & APIKEY but this plugin makes no attempt to do so! USE AT YOUR OWN RISK. Personally, I think if somebody cares enough to try to find them, they probably will do so even if it's obfuscated.

DEMO

A live demo that shows the plugin in action can be seen at:
http://www.funstormgames.com/blog/playtomic-for-construct-2-plugin

DOWNLOAD & INSTALLATION

Download from: http://www.funstormgames.com/blog/playtomic-for-construct-2-plugin
Copy the 'playtomic' folder to '<you Construct 2 install directory>\exporters\html5\plugins'.
Then you can use the plugin from within Construct 2.

TUTORIAL

1) Add a Playtomic object to your Construct 2 project
2) Create a Playtomic account and project at http://www.Playtomic.com
3) From your project's settings on the Playtomic website, copy the SWFID, GUID & APIKEY
4) Enter the SWFID, GUID & APIKEY in the Construct 2 Playtomic object properties
5) When you start the project, the plugin will now try to connect to the Playtomic servers and increase the number of 'Views' by 1.
6) Note: always check to make sure that Playtomic is ready before using the other features. It takes a short moment for the plugin to load, so it will not be ready immediately after layout start.

SUPPORTED PLAYTOMIC FEATURES

- Save Metrics (Views, Plays, etc)
- Load Metrics (Views, Plays, etc)
- Leaderboards
- Player Levels

LICENSE

This plugin has no license. Do whatever you want with it... use commerically, modify,
redistribute, etcetcetc. You don't have to, but it would be nice if you included
somewhere that you got it from:

http://www.funstormgames.com/

DEMO PROJECT ART THANKS TO

Backyard Ninja (Goblin) http://www.dumbmanex.com/
flaivoloka (Main Menu Background) http://www.sxc.hu/profile/flaivoloka

QUESTIONS, COMMENTS, FEEDBACK, BUGS

Please let me know if you find a bug and I will do my best to fix it. I don't have enough time to add all the Playtomic features, so if you need a specific feature and know a little JavaScript, feel free to modify the plugin and add it yourself :)

*/

function GetPluginSettings()
{
	return {
		"name":			"Playtomic",			// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"Playtomic",			// this is used to identify this plugin and is saved to the project; never change it
		"version":		"0.5",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Uses Playtomic to save and load data. Requires a Playtomic account.",
		"author":		"Funstorm Ltd",
		"help url":		"http://www.funstormgames.com",
		"category":		"Web",					// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal,		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
		"dependency":	"playtomic.v2.1.min.js" //
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

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

// Api loaded				
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(0, cf_none, "Playtomic Ready", "General", "Playtomic Ready", "Triggered when Playtomic is ready to be used (happens some time after start of layout).", "ptready");
// View Data Done Loading				
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(1, cf_none, "View Data Loaded", "Data", "View Data Loaded", "Triggered when view data has finished loading.", "data_views");
// Play Data Done Loading
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(2, cf_none, "Play Data Loaded", "Data", "Play Data Loaded", "Triggered when play data has finished loading.", "data_plays");
// PlayTime Data Done Loading
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(3, cf_none, "Playtime Data Loaded", "Data", "Playtime Data Loaded", "Triggered when playtime data has finished loading.", "data_playtime");
// Leaderboards Data Done Loading
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(4, cf_none, "Leaderboard Data Loaded", "Leaderboards", "Leaderboard Data Loaded", "Triggered when leaderboard data has finished loading.", "data_leaderboards");
// Level List Done Loading
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(5, cf_none, "Level List Loaded", "Level Sharing", "Level List Loaded", "Triggered when level list data has finished loading.", "data_level_list");
// Level Data Done Loading
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(6, cf_none, "Level Data Loaded", "Level Sharing", "Level Data Loaded", "Triggered when level data has finished loading.", "data_level");
// Level Data Done Saving
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(7, cf_none, "Level Data Saved", "Level Sharing", "Level Data Saved", "Triggered when level data has finished saving.", "data_level_save");
// Level Data Done Rating
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Trigger Once", "Trigger only once? (resets upon reloading)" , initial_selection = 0)	
AddCondition(8, cf_none, "Level Rated", "Level Sharing", "Level Rated", "Triggered when level data has finished rating.", "data_level_rate");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// Log View
AddAction(0, af_none, "Log View", "Log", "Increment View by 1", "Call Playtomic.Log.View", "log_view");
// Log Play
AddAction(1, af_none, "Log Play", "Log", "Increment Plays by 1", "Call Playtomic.Log.Play", "log_play");
// Log Level Counter
AddStringParam("Metric Name", "The name of the metric you want to log (eg deaths or restarts). Must be text or number.");
AddStringParam("Level Name", "The name of the level you want to log (eg tutorial or 2). Must be text or number.");
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Unique", "Unique" , initial_selection = 1)	
AddAction(2, af_none, "Increment Level Counter", "Log", "Increment metric {0} for level {1} by 1.", "These metrics track how many times something occurs in your levels, for instance deaths and restarts.", "log_levelcounter");
// Log Level Average
AddStringParam("Metric Name", "The name of the metric you want to log (eg deaths or restarts). Must be text or number.");
AddStringParam("Level Name", "The name of the level you want to log (eg tutorial or 2). Must be text or number.");
AddStringParam("Value", "The value you want to include in the average(eg 27). Must be a number.");
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Unique", "Unique" , initial_selection = 1)	
AddAction(3, af_none, "Level Average Metric", "Log", "Increment metric {0} for level {1} by 1.", "These metrics track the average of something in your levels, for instance the average time to finish a level or the average number of retries. It also tracks the minimum and maximums.", "log_levelaverage");
// Log Level Ranged
AddStringParam("Metric Name", "The name of the metric you want to log (eg deaths or restarts). Must be text or number.");
AddStringParam("Value", "The value you want to include in the average(eg 27). Must be a number.");
AddStringParam("Level Name", "The name of the level you want to log (eg tutorial or 2). Must be text or number.");
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Unique", "Unique" , initial_selection = 1)	
AddAction(4, af_none, "Level Ranged Metric", "Log", "Increment metric {0} for level {1} by 1.", "These metrics track metrics with values, for instance in a golf game you might track how many shots it takes to complete each level, or you might track the % of coins collected on each level.", "log_levelranged");
// Log Custom
AddStringParam("Metric Name", "The name of the metric you want to log (eg muted music or played level). Must be text or number.");
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Unique", "Unique" , initial_selection = 1)	
AddAction(5, af_none, "Log Custom", "Log", "Log custom metric {0}.", "Call Playtomic.Log.CustomMetric", "log_custom");
// Load View Data
AddAction(6, af_none, "Load View Data", "Data", "Load View Data", "Call Playtomic.Data.Views", "data_views");
// Load Play Data
AddAction(7, af_none, "Load Play Data", "Data", "Load Play Data", "Call Playtomic.Data.Plays", "data_plays");
// Load Playtime Data
AddAction(8, af_none, "Load Playtime Data", "Data", "Load Playtime Data", "Call Playtomic.Data.Playtime", "data_playtime");
// Save Leaderboard Data
AddStringParam("Player Name", "The player's name as it should appear on the leaderboard.");
AddNumberParam("Player Score", "The player's score as it should appear on the leaderboard.");
AddStringParam("Leaderboard Name", "The name of the leaderboard the score should be saved to (eg 'highscore' or 'level1'.");
AddComboParamOption("Yes");	
AddComboParamOption("No");	
AddComboParam("Allow Duplicates", "Save multiple scores per player?" , initial_selection = 0)	
AddComboParamOption("High Points");	
AddComboParamOption("Low Points");	
AddComboParam("High Score", "Whether a high or low amount of points is a highscore." , initial_selection = 0)	
AddAction(9, af_none, "Save Leaderboard Data", "Leaderboards", "Save Leaderboard Data", "Call Playtomic.Leaderboards.Save", "leaderboards_save");
// Load Leaderboard Data
AddStringParam("Leaderboard Name", "The name of the leaderboard the scores should be loaded from (eg 'highscore' or 'level1'.");
AddComboParamOption("Alltime");	
AddComboParamOption("Last 30 Days");	
AddComboParamOption("Last 7 Days");	
AddComboParamOption("Today");	
AddComboParamOption("Newest (unranked)");	
AddComboParam("Mode", "What scores to show." , initial_selection = 0)	
AddNumberParam("Page", "Which page of leaderboard scores to load.", initial_string = 1);
AddNumberParam("Scores Per Page", "How many leaderboard scores should appear on each page.", initial_string = 10);
AddComboParamOption("High Points");	
AddComboParamOption("Low Points");	
AddComboParam("High Score", "Whether a high or low amount of points is a highscore." , initial_selection = 0)	
AddComboParamOption("All");	
AddComboParamOption("Current");	
AddComboParam("Website", "Show scores submitted from all websites or just the one the player is on." , initial_selection = 0)	
AddAction(10, af_none, "Load Leaderboard Data", "Leaderboards", "Load Leaderboard Data", "Call Playtomic.Leaderboards.Load", "leaderboards_load");
// Save Level Data
AddStringParam("Player Name", "Name of the player that created the level.");
AddStringParam("Level Name", "Name of the level.");
AddStringParam("Level Data", "Level data (can store anything as long as it's a string and not larger than ~3MB.");
AddAction(11, af_none, "Save Level Data", "Level Sharing", "Save Level Data", "Call Playtomic.Leaderboards.Load", "level_save");
// Load Level List
AddComboParamOption("Most Popular");	
AddComboParamOption("Newest");	
AddComboParam("Order", "What order to show levels in." , initial_selection = 0)	
AddNumberParam("Page", "Which page of levels to list.", initial_string = 1);
AddNumberParam("Levels Per Page", "How many levels should appear on each page.", initial_string = 10);
AddAction(12, af_none, "Load Level List", "Level Sharing", "Load Level List", "Load a list of saved levels.", "level_load_list");
// Load Level Data
AddAnyTypeParam("Level Id", "The Id of the level you want to load. Use level list action and level list id expression to get level Ids.");
AddAction(13, af_none, "Load Level Data", "Level Sharing", "Load Level <b>{0}</b> Data", "Load a level.", "level_load");
// Rate Level
AddStringParam("Level Id", "The level Id of the level to rate.");
AddNumberParam("Rating", "Rating (1-10).");
AddAction(14, af_none, "Rate Level", "Level Sharing", "Rate Level <b>{0}</b>", "Rate an uploaded level.", "level_rate");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddExpression(0, ef_return_number, "Ready", "General", "Ready", "Whether or not Playtomic is ready to be used.");
AddExpression(1, ef_return_number, "Views", "Data", "Views", "Return the number of views. Must use load action to load this data first.");
AddExpression(2, ef_return_number, "Plays", "Data", "Plays", "Return the number of plays. Must use load action to load this data first.");
AddExpression(3, ef_return_number, "PlayTime", "Data", "PlayTime", "Return the number of playtime. Must use load action to load this data first.");
AddExpression(4, ef_return_number, "LeaderboardTotalScores", "Leaderboards", "LeaderboardTotalScores", "The total number of scores saved to the leaderboard. Must use load action to load this data first.");
AddExpression(5, ef_return_number, "LeaderboardScores", "Leaderboards", "LeaderboardScores", "The number of scores loaded from a leaderboard. Must use load action to load this data first.");
AddExpression(6, ef_return_string | ef_variadic_parameters, "LeaderboardScoreName", "Leaderboards", "LeaderboardScoreName", "Player name of a leaderboard entry. Specify which score with LeaderboardScoreName(scorenumber). Must use load action to load this data first.");
AddExpression(7, ef_return_number | ef_variadic_parameters, "LeaderboardScoreRank", "Leaderboards", "LeaderboardScoreRank", "Player rank of a leaderboard entry. Specify which score with LeaderboardScoreRank(scorenumber). Must use load action to load this data first.");
AddExpression(8, ef_return_number | ef_variadic_parameters, "LeaderboardScorePoints", "Leaderboards", "LeaderboardScorePoints", "Player score of a leaderboard entry. Specify which score with LeaderboardScorePoints(scorenumber). Must use load action to load this data first.");
AddExpression(9, ef_return_string | ef_variadic_parameters, "LeaderboardScoreDate", "Leaderboards", "LeaderboardScoreDate", "Date of a leaderboard entry. Specify which score with LeaderboardScoreDate(scorenumber). Must use load action to load this data first.");
AddExpression(10, ef_return_number | ef_variadic_parameters, "LeaderboardScoreRDate", "Leaderboards", "LeaderboardScoreRDate", "Date of a leaderboard entry, RELATIVE to the current date (eg '7 minutes ago'. Specify which score with LeaderboardScoreRDate(scorenumber). Must use load action to load this data first.");
AddExpression(11, ef_return_string | ef_variadic_parameters, "LevelListIds", "Level Sharing", "LevelListIds", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(12, ef_return_string | ef_variadic_parameters, "LevelListNames", "Level Sharing", "LevelListNames", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(13, ef_return_string | ef_variadic_parameters, "LevelListPlayerNames", "Level Sharing", "LevelListPlayerNames", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(14, ef_return_number | ef_variadic_parameters, "LevelListPlays", "Level Sharing", "LevelListPlays", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(15, ef_return_number | ef_variadic_parameters, "LevelListRatings", "Level Sharing", "LevelListRatings", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(16, ef_return_number | ef_variadic_parameters, "LevelListVotes", "Level Sharing", "LevelListVotes", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(17, ef_return_number | ef_variadic_parameters, "LevelListScores", "Level Sharing", "LevelListScores", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(18, ef_return_string | ef_variadic_parameters, "LevelListDates", "Level Sharing", "LevelListDates", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(19, ef_return_string | ef_variadic_parameters, "LevelListRDates", "Level Sharing", "LevelListRDates", "Return the level id. Useful for loading level data using id. Must use load action to load this data first.");
AddExpression(20, ef_return_string, "LevelData", "Level Sharing", "LevelData", "The player level data. Must use load action to load this data first.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
	new cr.Property(ept_text, 	"SWFID",	"",		"The SWFID for your Playtomic project."),
	new cr.Property(ept_text, 	"GUID",		"",		"The GUID for your Playtomic project."),
	new cr.Property(ept_text, 	"API Key",	"",		"The API Key for your Playtomic project."),
	new cr.Property(ept_combo, 	"Log View on Load",	"Yes",		"Whether to automatically call Playtomic.Log.View when the Playtomic API has finished loading.", "Yes|No")
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
	return new IDEInstance(instance);
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
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
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