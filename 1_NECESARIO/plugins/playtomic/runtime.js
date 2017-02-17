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

// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.Playtomic = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.Playtomic.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	var ptReady = false;
	
	// editor properties
	var ptSWFID = 0;
	var ptGUID = "";
	var ptAPIKEY = "";
	var ptLogViewOnLoad = false;

	// used to stop conditions from triggering multiple times
	// useful when you want to do something once when data has done loading
	var triggerPtReady = false;
	var triggerDataViews = false;
	var triggerDataPlays = false;
	var triggerDataPlayTime = false;
	var triggerDataLeaderboards = false;
	var triggerDataLevelList = false;
	var triggerDataLevel = false;
	var triggerDataLevelRating = false;
	var triggerDataLevelSave = false;

	// data is downloaded to these, and then displayed separately
	// useful for pre-downloading data (eg. if you have menu transition
	//	animations you could start loading highscores so theyre ready as soon as the screen is visible)
	var dataViews;
	var dataPlays;
	var dataPlayTime;
	var dataLeaderboardNumscores;
	var dataLeaderboardScores;
	var dataLevelList;
	var dataLevel;
	var dataLevelRating;

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
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		
		ptSWFID = parseInt(this.properties[0]);
		ptGUID = this.properties[1];
		ptAPIKEY = this.properties[2];
		
		// A view is automatically logged by default as soon as the API has loaded.
		// Ideally the developer would log the view manually on start of layout, but this
		// caused problems because the API is usually not yet loaded so we do it this way instead.
		if (this.properties[3] == 0) ptLogViewOnLoad = true;
		else ptLogViewOnLoad = false;

		ptReady = triggerPtReady = true;
		if (ptLogViewOnLoad) acts.log_view();
		
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};

	//////////////////////////////////////
	// Conditions

	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.ptready = function (triggerOnce) {
		var ret = triggerPtReady;
		if (triggerOnce == 0) triggerPtReady = false;
		return ret;
	}

	cnds.data_views = function (triggerOnce) {
		var ret = triggerDataViews;
		if (triggerOnce == 0) triggerDataViews = false;
		return ret;
	}

	cnds.data_plays = function (triggerOnce) {
		var ret = triggerDataPlays;
		if (triggerOnce == 0) triggerDataPlays = false;
		return ret;
	}

	cnds.data_playtime = function (triggerOnce) {
		var ret = triggerDataPlayTime;
		if (triggerOnce == 0) triggerDataPlayTime = false;
		return ret;
	}

	cnds.data_leaderboards = function (triggerOnce) {
		var ret = triggerDataLeaderboards;
		if (triggerOnce == 0) triggerDataLeaderboards = false;
		return ret;
	}

	cnds.data_level_list = function (triggerOnce) {
		var ret = triggerDataLevelList;
		if (triggerOnce == 0) triggerDataLevelList = false;
		return ret;
	}

	cnds.data_level = function (triggerOnce) {
		var ret = triggerDataLevel;
		if (triggerOnce == 0) triggerDataLevel = false;
		return ret;
	}

	cnds.data_level_rate = function (triggerOnce) {
		var ret = triggerDataLevelRating;
		if (triggerOnce == 0) triggerDataLevelRating = false;
		return ret;
	}

	cnds.data_level_save = function (triggerOnce) {
		var ret = triggerDataLevelSave;
		if (triggerOnce == 0) triggerDataLevelSave = false;
		return ret;
	}
	
	//////////////////////////////////////
	// Actions

	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	acts.log_view = function () {
		Playtomic["Log"]["View"](ptSWFID, ptGUID, ptAPIKEY, document.location);
	}
	
	acts.log_play = function () {
		Playtomic["Log"]["Play"]();
	}

	acts.log_levelcounter = function (metricName, levelName, Unique) {
		var unique = false;
		if (Unique == 0) unique = true;
		Playtomic["Log"]["LevelCounterMetric"](metricName, levelName, unique);
	}

	acts.log_levelaverage = function (metricName, levelName, value, Unique) {
		var unique = false;
		if (Unique == 0) unique = true;
		Playtomic["Log"]["LevelAverageMetric"](metricName, levelName, value, unique);
	}

	acts.log_levelranged = function (metricName, levelName, value, Unique) {
		var unique = false;
		if (Unique == 0) unique = true;
		Playtomic["Log"]["LevelRangedMetric"](metricName, levelName, value, unique);
	}

	acts.log_custom = function (metricName, Unique) {
		var unique = false;
		if (Unique == 0) unique = true;
		Playtomic["Log"]["CustomMetric"](metricName, "", unique);
	}

	acts.data_views = function (Year, Month, Day) {
		var options = {
			"year": Year,
			"month": Month,
			"day": Day
		};
		triggerDataViews = false;
		Playtomic["Data"]["Views"](function (data, response) {
			dataViews = data;
			triggerDataViews = true;
			}, options);
	}

	acts.data_plays = function (Year, Month, Day) {
		var options = {
			"year": Year,
			"month": Month,
			"day": Day
		};
		triggerDataPlays = false;
		Playtomic["Data"]["Plays"](function (data, response) {
			dataPlays = data;
			triggerDataPlays = true;
			}, options);
	}

	acts.data_playtime = function (Year, Month, Day) {
		var options = {
			"year": Year,
			"month": Month,
			"day": Day
		};
		triggerDataPlayTime = false;
		Playtomic["Data"]["PlayTime"](function (data, response) {
			dataPlayTime = data;
			triggerDataPlayTime = true;
			}, options);
	}

	acts.leaderboards_save = function (PlayerName, PlayerPoints, LeaderboardName, AllowDuplicates, HighIsBest) {
		var scoreObj = {
			"Name": PlayerName,
			"Points": PlayerPoints
		};
		var options = {
			"allowduplicates": AllowDuplicates == 0 ? true : false,
			"highest": HighIsBest == 0 ? true : false
		};
		Playtomic["Leaderboards"]["Save"](scoreObj, LeaderboardName, null, options)
	}

	acts.leaderboards_load = function (Name, Mode, Page, PerPage, HighIsBest, Website) {
		triggerDataLeaderboards = false;
		var modeString;
		if (Mode == 0) modeString = "alltime";
		else if (Mode == 1) modeString = "last30days";
		else if (Mode == 2) modeString = "last7days";
		else if (Mode == 3) modeString = "today";
		else if (Mode == 4) modeString = "newest";
		var options = {
			"mode": modeString,
			"page": Page,
			"perpage": PerPage,
			"highest": HighIsBest == 0 ? true : false,
			"global": Website == 0 ? true : false
		};
		Playtomic["Leaderboards"]["List"](Name, function(scores, numscores, response){
			dataLeaderboardNumscores = numscores;
			dataLeaderboardScores = scores;
			triggerDataLeaderboards = true;
			}, options)
	}

	acts.level_save = function (PlayerName, LevelName, LevelData) {
		triggerDataLevelSave = false;
		var level = {
			"PlayerName": PlayerName,
			"Name": LevelName,
			"Data": LevelData	
		};
		Playtomic["PlayerLevels"]["Save"](level, function(data, response){
			if (!response.Success) {
				console.log("Error saving " + level.Name + ": " + response.ErrorCode)
			} else {
				triggerDataLevelSave = true;
			}
		});
	}

	acts.level_load_list = function (Order, Page, PerPage) {
		triggerDataLevelList = false;
		var options = {
			"mode": Order == 0 ? 'popular' : 'newest',
			"page": Page,
			"perpage": PerPage	
		};
		Playtomic["PlayerLevels"]["List"](function(data, response){
			dataLevelList = data;
			triggerDataLevelList = true;
		}, options);
	}

	acts.level_load = function (LevelId) {
		triggerDataLevel = false;
		Playtomic["PlayerLevels"]["Load"](LevelId, function (data, response) {
			dataLevel = data;
			triggerDataLevel = true;
			});
	}

	acts.level_rate = function (LevelId, Rating) {
		triggerDataLevelRating = false;
		Playtomic["PlayerLevels"]["Rate"](LevelId, Rating, function (data, response) {
			dataLevelRating = data;
			triggerDataLevelRating = true;
			});
	}
	
	//////////////////////////////////////
	// Expressions

	pluginProto.exps = {};
	var exps = pluginProto.exps;

	exps.Ready = function(ret) {
		ret.set_int(ptReady == true? 1 : 0);
	}

	exps.Views = function (ret) {
		ret.set_int(parseInt(dataViews["Value"]));
	}

	exps.Plays = function (ret) {
		ret.set_int(parseInt(dataPlays["Value"]));
	}

	exps.PlayTime = function (ret) {
		ret.set_string(dataPlayTime["Value"]);
	}

	exps.LeaderboardTotalScores = function (ret) {
		ret.set_int(dataLeaderboardNumscores);
	}

	exps.LeaderboardScores = function (ret) {
		ret.set_int(dataLeaderboardScores.length);
	}

	exps.LeaderboardScoreName = function (ret, Score) {
		if (dataLeaderboardScores[Score] == undefined) ret.set_string("");
		else ret.set_string(dataLeaderboardScores[Score]["Name"]);
	}

	exps.LeaderboardScoreRank = function (ret, Score) {
		if (dataLeaderboardScores[Score] == undefined) ret.set_int(0);
		else ret.set_int(dataLeaderboardScores[Score]["Rank"]);
	}

	exps.LeaderboardScorePoints = function (ret, Score) {
		if (dataLeaderboardScores[Score] == undefined) ret.set_int(0);
		else ret.set_int(dataLeaderboardScores[Score]["Points"]);
	}

	exps.LeaderboardScoreDate = function (ret, Score) {
		if (dataLeaderboardScores[Score] == undefined) ret.set_string("");
		else ret.set_string(dataLeaderboardScores[Score]["SDate"]);
	}

	exps.LeaderboardScoreRDate = function (ret, Score) {
		if (dataLeaderboardScores[Score] == undefined) ret.set_string("");
		else ret.set_string(dataLeaderboardScores[Score]["RDate"]);
	}

	exps.LevelListIds = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["LevelId"]);
	}

	exps.LevelListNames = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["Name"]);
	}

	exps.LevelListPlayerNames = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["PlayerName"]);
	}

	exps.LevelListPlays = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["Plays"]);
	}

	exps.LevelListRatings = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_int(0);
		else ret.set_int(dataLevelList[Level]["Rating"]);
	}

	exps.LevelListVotes = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["Votes"]);
	}

	exps.LevelListScores = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["Score"]);
	}

	exps.LevelListDates = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["SDate"]);
	}

	exps.LevelListRDates = function (ret, Level) {
		if (dataLevelList[Level] == undefined) ret.set_string("");
		else ret.set_string(dataLevelList[Level]["RDate"]);
	}

	exps.LevelData = function (ret) {
		if (dataLevel["Data"] == undefined) ret.set_string("");
		else ret.set_string(dataLevel["Data"]);
	}

}());