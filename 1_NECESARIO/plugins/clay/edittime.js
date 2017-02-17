function GetPluginSettings()
{
	var returnObj = {
		'name':			'Clay.io',		// as appears in 'insert object' dialog, can be changed as long as 'id' stays the same
		'id':			'Clay',			// this is used to identify this plugin and is saved to the project; never change it
		'version':		'0.2.8',		// ( float in x.y format ) Plugin version - C2 shows compatibility warnings based on this
		'description':	'Integrates Leaderboards and Achievements. Requires a Clay.io account.',
		'author':		'Clay.io',
		'help url':		'http://clay.io/docs/scirra',
		'category':		'Web',					// Prefer to re-use existing categories, but you can set anything here
		'type':			'object',				// either 'world' ( appears in layout and is drawn ), else 'object'
		'rotatable':	false,					// only used when 'type' is 'world'.  Enables an angle property on the object.
		'flags':		pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  'type' must be 'object'.
		/*'dependency':   'clay.css;socket.io.js;clay.js;'*/
	};
	
	/* not accessible yet
	// Unless it's a default export, we're going to need the API files
	// CocoonJS
	if( this.properties && this.properties['Export Mode'] && this.properties['ExportMode'] == 1 )
		returnObj['dependency'] = "clay.css;socket.io.js;clay-domless.js;";
	else if( this.properties && this.properties['Export Mode'] && this.properties['ExportMode'] == 2 )
		returnObj['dependency'] = "clay.css;socket.io.js;clay.js;";
	*/
	
	return returnObj;
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam( label, description [, initial_string = '0'] )			// a number
// AddStringParam( label, description [, initial_string = '\'\''] )		// a string
// AddAnyTypeParam( label, description [, initial_string = '0'] )			// accepts either a number or string
// AddCmpParam( label, description )										// combo with equal, not equal, less, etc.
// AddComboParamOption( text )											// ( repeat before 'AddComboParam' to add combo items )
// AddComboParam( label, description [, initial_selection = 0] )			// a dropdown list parameter
// AddObjectParam( label, description )									// a button to click and pick an object type
// AddLayerParam( label, description )									// accepts either a layer number or name ( string )
// AddLayoutParam( label, description )									// a dropdown list with all project layouts
// AddKeybParam( label, description )										// a button to click and press a key ( returns a VK )
// AddAnimationParam( label, description )								// a string intended to specify an animation name
// AddAudioFileParam( label, description )								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition( id,					// any positive integer to uniquely identify this condition
//				flags,				// ( see docs ) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name );		// corresponding runtime function name

// Api loaded
AddCondition( 0, cf_none, 'Clay.io Ready', 'General', 'Clay.io Ready', 'Triggered when Clay.io is ready to be used ( happens some time after start of layout ).', 'clayready' );
AddCondition( 19, cf_none, 'Clay.io Failed to Load', 'General', 'Clay.io Failed to Load', 'Triggered if Clay.io can\'t connect to backend.', 'cdns_failed_to_load' );

// Leaderboard score posted	
AddCondition( 1, cf_trigger, 'Leaderboard Score Posted', 'Leaderboards', 'Leaderboard Score Posted', 'Triggered when a leaderboard score is successfully posted.', 'cdns_leaderboard_post' );
// LB Scores fetched
AddCondition( 7, cf_trigger, 'Leaderboard Scores Fetched', 'Leaderboards', 'Leaderboard Scores Fetched', 'Triggered when leaderboard scores are successfully fetched.', 'cdns_leaderboard_fetch' );

// Achievement awarded
AddCondition( 2, cf_trigger, 'Achievement Awarded', 'Achievements', 'Achievement Awarded', 'Triggered when an achievement is successfully rewarded.', 'cdns_achievement_award' );
AddCondition( 20, cf_trigger, 'Achievements Fetched', 'Achievements', 'Achievement Fetched', 'Triggered when the list of achievements is fetched.', 'cdns_achievement_fetch' );

// Screenshot taken
AddCondition( 3, cf_trigger, 'Screenshot Posted', 'Miscellaneous', 'Screenshot Posted', 'Triggered a screenshot is taken and saved to Clay.io.', 'cdns_screenshot_take' );

// Facebook posted
AddCondition( 4, cf_trigger, 'Facebook Message Posted', 'Social', 'Facebook Message Posted', 'Triggered when a message is successfully posted to Facebook.', 'cdns_facebook_post' );
// Facebook invited
AddCondition( 17, cf_trigger, 'Facebook Friends Invited', 'Social', 'Facebook Friends Invited', 'Triggered when at least one person is successfully invited to play your game from Facebook.', 'cdns_facebook_invite' );
// Twitter posted
AddCondition( 5, cf_trigger, 'Tweet Posted', 'Social', 'Tweet Posted', 'Triggered when a tweet is successfully posted to Twitter.', 'cdns_twitter_post' );
// Clay posted
AddCondition( 6, cf_trigger, 'Clay.io Stream Posted', 'Social', 'Clay.io Stream Posted', 'Triggered when a stream is successfully posted to Clay.io.', 'cdns_clay_post' );

// Social Shared
AddCondition( 37, cf_trigger, 'Social Message Shared', 'Social', 'Social Message Shared', 'Triggered when a message is successfully shared with "Social Share".', 'cdns_social_share' );

// Item added
AddCondition( 8, cf_trigger, 'Item Added to Cart', 'Payments', 'Add Item to Cart', 'Triggered when an item is added to the Clay.io cart.', 'cdns_clay_add_payment_item' );
// Successful checkout
AddCondition( 9, cf_trigger, 'Successful Payment', 'Payments', 'Successful Payment', 'Triggered on the successful purchase of item(s).', 'cdns_clay_checkout' );
// Failed checkout
AddCondition( 10, cf_trigger, 'Failed Payment', 'Payments', 'Failed Payment', 'Triggered on the failed purchase of item(s).', 'cdns_clay_checkout_fail' );

// Multiplayer rooms shown
AddCondition( 11, cf_trigger, 'Rooms Modal Shown', 'Multiplayer', 'Rooms Modal Shown', 'Triggered when the multiplayer rooms list is displayed.', 'cdns_clay_rooms_show' );
// Multiplayer room joined
AddCondition( 12, cf_trigger, 'Room Filled', 'Multiplayer', 'Rooms Joined', 'Triggered when the room the player is in fills up (start the game at this time, and associate players based on Clay.io -> RoomId).', 'cdns_clay_rooms_full' );

// Data stored
AddCondition( 13, cf_trigger, 'Data Fetched', 'Data', 'Data Fetched', 'Triggered when data is fetched from Clay.io.', 'cdns_clay_fetch_data' );
// Data fetched
AddCondition( 14, cf_trigger, 'Data Stored', 'Data', 'Data Stored', 'Triggered when data is successfully saved to Clay.io.', 'cdns_clay_save_data' );

// Successful Login
AddCondition( 15, cf_trigger, 'On Login (From Prompt Action)', 'Miscellaneous', 'On Login (From Prompt Action)', 'Triggered when a user successfully logs in after you prompt them with the login modal.', 'cdns_clay_prompt_login' );
// Successful Logout
AddCondition( 22, cf_trigger, 'On Logout (From Prompt Action)', 'Miscellaneous', 'On Logout (From Prompt Action)', 'Triggered when a user successfully logs out.', 'cdns_clay_prompt_logout' );

// Items fetched
AddCondition( 16, cf_trigger, 'Items Fetched', 'Payments', 'Items Fetched', 'Triggered when items are fetched after "Fetch Items".', 'cdns_clay_fetch_items' );

// Player Item Removed
AddCondition( 21, cf_trigger, 'Player Item Removed', 'Payments', 'Player Item Removed', 'Triggered when an item in the player\' inventory is removed', 'cdns_clay_remove_player_item' );

// Game key set (changed)
AddCondition( 18, cf_trigger, 'Game Key Changed', 'Miscellaneous', 'Game Key Changed', 'Triggered when the game key is changed (typically you won\'t need to use this)', 'cdns_clay_set_game_key' );
////////////////////////////////////////
// Actions

// AddAction( id,				// any positive integer to uniquely identify this action
//			 flags,				// ( see docs ) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name );		// corresponding runtime function name

// Log Play
AddAction( 1, af_none, 'Log Play', 'Log', 'Increment Plays by 1', "Call Clay.Stats.log( 'Play' )", 'log_play' );
// Log Stat
AddStringParam( 'Metric Name', 'The name of the metric you want to log ( eg deaths or restarts ). Must be text or number.' );
AddNumberParam( 'Increment Amount', 'The amount to increment this metric by each time it\'s called.', 1 );
AddAction( 2, af_none, 'Custom Statistic', 'Log', 'Increment metric {0} by {1}.', 'These metrics track how many times something occurs in your levels, for instance deaths and restarts.', 'log_stat' );
// Log Level Start
AddStringParam( 'Level Name', 'The name of the level.' );
AddAction( 34, af_none, 'Start Level', 'Log', 'Start Level', 'Call when a level starts. Stats will be collected like time spent in level, fails, etc... but be sure to end the level', 'level_start' );
// Log Level Fail
AddStringParam( 'Level Name', 'The name of the level.' );
AddAction( 35, af_none, 'End Level (Fail)', 'Log', 'End Level (Fail)', 'Call when a level ends and the player didn\'t succeed. Stats will be collected like time spent in level, fails, etc... but be sure to end the level', 'level_fail' );
// Log Level Pass
AddStringParam( 'Level Name', 'The name of the level.' );
AddAction( 36, af_none, 'End Level (Success)', 'Log', 'End Level (Success)', 'Call when a level ends and the player succeeded. Stats will be collected like time spent in level, fails, etc... but be sure to end the level', 'level_success' );

// Save Leaderboard Data
AddStringParam( 'Player Name', 'The player\'s name as it should appear on the leaderboard. (Optional, Clay.io will ask for one if not specified)' );
AddNumberParam( 'Player Score', 'The player\'s score as it should appear on the leaderboard.' );
AddAnyTypeParam( 'Leaderboard ID', 'The ID of the leaderboard the score should be saved to (can be found in the Clay.io developer dashboard)' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );		
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a high score is posted.', initial_selection = 0 )	
AddAction( 3, af_none, 'Post Leaderboard Score', 'Leaderboards', 'Post Leaderboard Score', 'Call Clay.Leaderboard.post()', 'leaderboards_post' );
// Save Encrypted Leaderboard Data
AddStringParam( 'JWT', 'ADVANCED: The JSON Web Token generated by your game\'s backend server (use "Post Leaderboard Score" if this makes no sense to you)' );
AddNumberParam( 'Leaderboard ID', 'The ID of the leaderboard the score should be saved to (can be found in the Clay.io developer dashboard)' );
AddAction( 25, af_none, 'Post Encrypted Leaderboard Score', 'Leaderboards', 'Post Encrypted Leaderboard Score', 'ADVANCED: Posts a leaderboard score (using an encrypted format)', 'leaderboards_post_encrypted' );
// Load Leaderboard Data
AddAnyTypeParam( 'Leaderboard ID', 'The ID of the leaderboard the score should be posted to (can be found in the Clay.io developer dashboard)' );
AddComboParamOption( 'All time' );	
AddComboParamOption( 'Last 30 Days' );	
AddComboParamOption( 'Last 7 Days' );	
AddComboParamOption( 'Last 24 Hours' );		
AddComboParam( 'Time Frame', 'What scores to show.', initial_selection = 0 )	
AddComboParamOption( 'Individual' );	
AddComboParamOption( 'Cumulative' );	
AddComboParamOption( 'Best' );	
AddComboParam( 'High Score', 'Type' , initial_selection = 0 )	
AddComboParamOption( 'Descending' );	
AddComboParamOption( 'Ascending' );	
AddComboParam( 'Sort', 'Sorting the scores from highest to lowest (descending) or lowest to highest (ascending)' , initial_selection = 0 )	
AddComboParamOption( 'All' );	
AddComboParamOption( 'Personal' );
AddComboParamOption( 'Friends' );	
AddComboParam( 'Scores From', 'Show scores from everyone, just the player, or just the player\'s Facebook/Clay.io friends' , initial_selection = 0 );
AddNumberParam( 'Number of Scores', 'How many high scores should be shown (default 10)', initial_selection = 10 );
AddAction( 16, af_none, 'Fetch Leaderboard Object', 'Leaderboards', 'Fetch Leaderboard Object', 'Fetches an object of scores stored as the expression: "LeaderboardData". This is a bit more advanced, use "Show Leaderboard" to simply display.', 'leaderboards_fetch' );

AddAnyTypeParam( 'Leaderboard ID', 'The ID of the leaderboard the score should be saved to (can be found in the Clay.io developer dashboard)' );
AddComboParamOption( 'All time' );	
AddComboParamOption( 'Last 30 Days' );	
AddComboParamOption( 'Last 7 Days' );	
AddComboParamOption( 'Last 24 Hours' );		
AddComboParam( 'Time Frame', 'What scores to show.', initial_selection = 0 )	
AddComboParamOption( 'Individual' );	
AddComboParamOption( 'Cumulative' );	
AddComboParamOption( 'Best' );	
AddComboParam( 'High Score', 'Type' , initial_selection = 0 )	
AddComboParamOption( 'Descending' );	
AddComboParamOption( 'Ascending' );	
AddComboParam( 'Sort', 'Sorting the scores from highest to lowest (descending) or lowest to highest (ascending)' , initial_selection = 0 )	
AddComboParamOption( 'All' );	
AddComboParamOption( 'Personal' );
AddComboParamOption( 'Friends' );	
AddComboParam( 'Scores From', 'Show scores from everyone, just the player, or just the player\'s Facebook/Clay.io friends' , initial_selection = 0 );
AddNumberParam( 'Number of Scores', 'How many high scores should be shown (default 10)', initial_selection = 10 );
AddAction( 4, af_none, 'Show Leaderboard', 'Leaderboards', 'Show Leaderboard', 'Shows the Clay.io leaderboard', 'leaderboards_show' );
// Hide Leaderboard
AddAction( 5, af_none, 'Hide Leaderboard', 'Leaderboards', 'Hide Leaderboard', 'Hides the Clay.io leaderboard', 'leaderboards_hide' );

// Award Achievement
AddAnyTypeParam( 'Achievement ID', 'The ID of the achievement to award ( can be found in the Clay.io developer dashboard )' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when an achievement is awarded.', initial_selection = 0 )	
AddAction( 6, af_none, 'Award Achievement', 'Achievements', 'Award Achievement', 'Awards an achievement you specify to the player', 'achievements_award' );
// Award Encrypted Achievement
AddStringParam( 'JWT', 'ADVANCED: The JSON Web Token generated by your game\'s backend server (use "Award Achievement" if this makes no sense to you)' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when an achievement is awarded.', initial_selection = 0 )	
AddAction( 24, af_none, 'Award Encrypted Achievement', 'Achievements', 'Award Encrypted Achievement', 'ADVANCED: Awards an achievement you specify to the player (using an encrypted format)', 'achievements_award_encrypted' );
// Show all achievements
AddAction( 8, af_none, 'Show All Achievements', 'Achievements', 'Show All Achievements', 'Displays all the achievements for this game, and whether or not the user has them', 'achievements_show_all' );
// Fetch all achievements
AddAction( 32, af_none, 'Fetch All Achievements', 'Achievements', 'Fetch All Achievements', 'Fetches all the achievements for this game, and whether or not the user has them. See README for more info', 'achievements_fetch' );

// Screenshots
AddStringParam( 'Screenshot Data URL', 'Select from the expressions box. System -> Layout -> CanvasSnapshot' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a screenshot is posted.', initial_selection = 0 );
AddAction( 7, af_none, 'Post Screenshot to Clay.io', 'Miscellaneous', 'Post Screenshot to Clay.io', 'Posts a screenshot of the game in its current state to their Clay.io account (requires them to login to Clay.io)', 'screenshot_show' );

// Call cross promotion window
AddAction( 9, af_none, 'Show Cross Promotion Modal Window', 'Miscellaneous', 'Show Cross Promotion Modal Window', 'Shows the cross promotion window (clicks to other games earn you credits which mean clicks to your game)', 'suggestions_show' );
AddAction( 10, af_none, 'Hide Cross Promotion Modal Window', 'Miscellaneous', 'Hide Cross Promotion Modal Window', 'Hides the Clay.io cross promotion window', 'suggestions_hide' );

// Show ratings window
AddAction( 11, af_none, 'Show Ratings Modal Window', 'Miscellaneous', 'Show Ratings Modal Window', 'Shows the Clay.io rating box where users can rate your game from 1 to 5 stars', 'ratings_show' );
AddAction( 12, af_none, 'Hide Ratings Modal Window', 'Miscellaneous', 'Hide Ratings Window', 'Hides the Clay.io ratings window', 'ratings_hide' );

// Facebook post
AddStringParam( 'Message', 'The message to post on their wall' );
AddStringParam( 'Link', 'A URL to include in the Facebook post ( optional )' );
AddStringParam( 'Picture', 'A URL to an image to include the Facebook post ( optional )' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a message is posted.', initial_selection = 0 );
AddAction( 13, af_none, 'Post to Facebook Wall', 'Social', 'Post to Facebook Wall', 'Posts a message to the player\'s Facebook wall (they must be signed into Clay.io and grant you permission)', 'facebook_post' );
// Facebook invite
AddStringParam( 'Message', 'The message that will be posted along with a link to your game (leave as "" for default message)' );
AddAction( 29, af_none, 'Invite Facebook Friends', 'Social', 'Invite Facebook Friends', 'Opens a modal window with a list of the player\'s Facebook friends and allows them to select friends to invite. Invites will be posted to the selected friends\' walls', 'facebook_invite' );

// Tweet
AddStringParam( 'Message', 'The message to post on their Twitter account' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a message is posted.', initial_selection = 0 );
AddAction( 14, af_none, 'Tweet', 'Social', 'Tweet', 'Posts a tweet to the player\'s Twitter account (they must be signed into Clay.io and grant you permission)', 'twitter_post' );
// Clay.io Stream post
AddStringParam( 'Message', 'The message to post on their Clay.io wall' );
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a message is posted.', initial_selection = 0 );
AddAction( 15, af_none, 'Post to Clay.io Wall', 'Social', 'Post to Clay.io Wall', 'Posts a stream to the player\'s Clay.io Wall (they must be signed into Clay.io)', 'clay_post' );

// General Share
AddStringParam( 'Message', 'The message to post' );
/*
AddComboParamOption( 'Yes' );	
AddComboParamOption( 'No' );
AddComboParam( 'Show Notification', 'If yes, a small indicator is shown when a message is posted.', initial_selection = 0 );
*/
AddAction( 39, af_none, 'Share on Twitter OR Facebbok', 'Social', 'Share on Twitter OR Facebbok', 'Gives the Player the option to share a message (and optionally screenshot) on Facebook or Twitter', 'social_share' );


// Payments add item
AddNumberParam( 'Item ID', 'The ID of the item to add to cart (can be found in the Clay.io developer dashboard)' );
AddAction( 17, af_none, 'Add Item to Cart', 'Payments', 'Add Item to Cart', 'Adds an item to the Clay.io cart, which can be purchased by the user when the "Checkout" action is called', 'clay_add_payment_item' );
// Payments remove item
AddNumberParam( 'Item ID', 'The ID of the item to remove from cart (can be found in the Clay.io developer dashboard)' );
AddAction( 18, af_none, 'Remove Item from Cart', 'Payments', 'Remove Item from Cart', 'Removes an item from the Clay.io cart', 'clay_remove_payment_item' );
// Payments remove player item
AddNumberParam( 'Item ID', 'The ID of the item to remove from the player\'s inventory (can be found in the Clay.io developer dashboard)' );
AddAction( 37, af_none, 'Remove Item from Player Inventory', 'Payments', 'Remove Item from Player Inventory', 'Removes an item from Player\'s Clay.io Inventory', 'clay_remove_player_item' );
// Payments checkout
AddAction( 19, af_none, 'Checkout', 'Payments', 'Checkout', 'Begins the checkout process where a user is asked to purchase the items in their cart', 'clay_checkout' );

// Payments purchase game
AddAction( 28, af_none, 'Purchase Game', 'Payments', 'Purchase Game', 'Allows the user to purchase your game if your game is not a free game', 'clay_purchase_game' );

// Multiplayer show rooms
AddAction( 21, af_none, 'Show Rooms List', 'Multiplayer', 'Show Rooms List', 'Display a list of rooms the player can join, or create a room themself.', 'clay_rooms' );
// Boot from room
AddAction( 20, af_none, 'Boot Player From Room', 'Multiplayer', 'Boot Player From Room', 'Forces the player out of the room they are currently in.', 'clay_rooms_force_leave' );

// Persistent data store
AddStringParam( 'Key', 'A unique key/identifier for this piece of data (for example: "CurrentLevel")' );
AddAnyTypeParam( 'Data', 'The data to be associated with this key' );
AddAction( 22, af_none, 'Store User Data', 'Data', 'Store User Data', 'Stores data that is associated with the current player.', 'clay_save_data' );
// Persistent data fetch
AddStringParam( 'Key', 'The unique key/identifier for the data you are fetching (for example: "CurrentLevel")' );
AddAction( 23, af_none, 'Fetch User Data', 'Data', 'Fetch User Data', 'Grabs data associated with the current player.', 'clay_fetch_data' );

// Prompt login
AddAction( 26, af_none, 'Prompt Login', 'Miscellaneous', 'Prompt Login', 'Asks the user to login to Clay.io (or just enter their name).', 'clay_prompt_login' );
// Prompt logout
AddAction( 38, af_none, 'Prompt Logout', 'Miscellaneous', 'Prompt Logout', 'Asks the user to log out of Clay.io', 'clay_prompt_logout' );

// Fetch Items
AddAction( 27, af_none, 'Fetch Items', 'Payments', 'Fetch Items', 'Fetches an array of every item this player owns (has purchased).', 'clay_fetch_items' );

// CocoonJS go to link (no related to clay.io)
AddStringParam( 'URL', 'The URL to open' );
AddAction( 30, af_none, 'CocoonJS Go To Link', 'Miscellaneous', 'CocoonJS Go To Link', 'Opens a link in the CocoonJS System browser', 'cocoon_go_to_link' );

// CocoonJS go to link (no related to clay.io)
AddStringParam( 'Key', 'The new API key to use' );
AddAction( 31, af_none, 'Change Game Key', 'Miscellaneous', 'Change Game Key', 'Changes the Clay.io API key (if you don\'t know what this action is, you don\'t need to use it)', 'clay_set_game_key' );

// CocoonJS go to link (no related to clay.io)
AddStringParam( 'Modal Name', 'Blank, or one of: login, leaderboard, payment, screenshot, suggestions, rate' );
AddAction( 33, af_none, 'Close Modal Window', 'Miscellaneous', 'Close Modal Window', 'Manually closes a modal window', 'close_modal' );

////////////////////////////////////////
// Expressions

// AddExpression( id,			// any positive integer to uniquely identify this expression
//				 flags,			// ( see docs ) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters ( one return flag must be specified )
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. 'foo' for 'myobject.foo' - also the runtime function name
//				 description );	// description in expressions panel

AddExpression( 0, ef_return_number, 'Clay.io Ready', 'General', 'Ready', 'Whether or not Clay.io is ready to be used.' );
AddExpression( 1, ef_return_string, 'Screenshot SRC', 'General', 'ScreenshotSrc', 'The URL to the screenshot that was taken' );

AddExpression( 26, ef_return_string | ef_variadic_parameters, 'Achievement Awarded Title', 'Achievements', 'AwardedAchievementTitle', 'Use Clayio.AwardedAchievementTitle(achievementID) to fetch the title of that awarded achievement (if awarded successfully)' );
AddExpression( 27, ef_return_string | ef_variadic_parameters, 'Achievement Awarded Description', 'Achievements', 'AwardedAchievementDescription', 'Use Clayio.AwardedAchievementDescription(achievementID) to fetch the description of that awarded achievement (if awarded successfully)' );
AddExpression( 28, ef_return_string | ef_variadic_parameters, 'Achievement Awarded Icon', 'Achievements', 'AwardedAchievementIcon', 'Use Clayio.AwardedAchievementIcon(achievementID) to fetch the icon URL of that awarded achievement (if awarded successfully)' );
//AddExpression( 29, ef_return_number | ef_variadic_parameters, 'Achievement Awarded Points', 'Achievements', 'AwardedAchievementPoints', 'Use Clayio.AwardedAchievementTitle(achievementID) to fetch the # of Clay.io points of that awarded achievement (if awarded successfully)' );


AddExpression( 35, ef_return_number | ef_variadic_parameters, 'Fetched Achievement Count', 'Achievements', 'FetchedAchievementCount', 'The number of achievements retrieved (use as max value in loop - this value is 1 less than the actual number since indices start at 0)' );
AddExpression( 30, ef_return_string | ef_variadic_parameters, 'Fetched Achievement Title', 'Achievements', 'FetchedAchievementTitle', 'Use Clayio.FetchedAchievementTitle(loopindex) to get the title of this fetched achievement' );
AddExpression( 31, ef_return_string | ef_variadic_parameters, 'Fetched Achievement Description', 'Achievements', 'FetchedAchievementDescription', 'Use Clayio.FetchedAchievementDescription(loopindex) to get the description of this fetched achievement' );
AddExpression( 32, ef_return_string | ef_variadic_parameters, 'Fetched Achievement Icon', 'Achievements', 'FetchedAchievementIcon', 'Use Clayio.FetchedAchievementIcon(loopindex) to get the icon URL of this fetched achievement' );
//AddExpression( 33, ef_return_number | ef_variadic_parameters, 'Fetched Achievement Points', 'Achievements', 'FetchedAchievementPoints', 'Use Clayio.FetchedAchievementPoints(loopindex) to get the # of Clay.io points of that fetched achievement' );
AddExpression( 34, ef_return_number | ef_variadic_parameters, 'Fetched Achievement Earned', 'Achievements', 'FetchedAchievementEarned', 'Clayio.FetchedAchievementEarned(loopindex) returns 1 if the user has earned that fetched achievement, 0 otherwise' );


AddExpression( 2, ef_return_number, 'Leaderboard Score Count', 'Leaderboards', 'LeaderboardScoreCount', 'The number of scores retrieved (use as max value in loop - this value is 1 less than the actual number since indices start at 0)' );
AddExpression( 3, ef_return_string | ef_variadic_parameters, 'Fetched Leaderboard Name', 'Leaderboards', 'LeaderboardName', 'Pass the loop index in parenthesis' );
AddExpression( 4, ef_return_number | ef_variadic_parameters, 'Fetched Leaderboard Score', 'Leaderboards', 'LeaderboardScore', 'Pass the loop index in parenthesis' );
AddExpression( 36, ef_return_number | ef_variadic_parameters, 'Fetched Score Posted By "Me"', 'Leaderboards', 'LeaderboardScoreMe', 'Pass the loop index in parenthesis' );
AddExpression( 21, ef_return_number, 'Leaderboard Recent Ranking Rank', 'Leaderboards', 'LeaderboardRank', 'If the player is not in the top X results, after using "Fetch Leaderboard", this will contain the player\'s rank' );
AddExpression( 22, ef_return_number, 'Leaderboard Recent Ranking Score', 'Leaderboards', 'LeaderboardRankScore', 'If the player is not in the top X results, after using "Fetch Leaderboard", this will contain the player\'s score' );
AddExpression( 23, ef_return_number, 'Leaderboard Recent Ranking Name', 'Leaderboards', 'LeaderboardRankName', 'If the player is not in the top X results, after using "Fetch Leaderboard", this will contain the player\'s name' );
AddExpression( 24, ef_return_any, 'Last Fetched Leaderboard ID', 'Leaderboards', 'FetchedLeaderboardID', 'The ID (you specified) of the leaderboard fetched in the most recent "Fetch Leaderboard" action' );

AddExpression( 5, ef_return_number, 'Payment Items Purchased Count', 'Payments', 'PaymentItemCount', 'The number of items purchased (use as max value in loop - this value is 1 less than the actual number since indices start at 0)' );
AddExpression( 6, ef_return_number | ef_variadic_parameters, 'Item Purchased', 'Payments', 'PaymentItemId', 'Pass the loop index in parenthesis' );
AddExpression( 7, ef_return_string, 'Encrypted Payment String', 'Payments', 'EncryptedPaymentResponse', 'Use if you have encrypted payments enabled on Clay.io - this needs to be unencyrpted with a backend' );

AddExpression( 8, ef_return_number, 'Number of Players in Room', 'Multiplayer', 'RoomCount', 'This has a value after a room has been joined, and is the total number of players in that room.' );
AddExpression( 9, ef_return_number, 'Unique ID of Room', 'Multiplayer', 'RoomId', 'This has a value after a room has been joined, and is a unique integer identifier associated with the room.' );

AddExpression( 10, ef_return_any | ef_variadic_parameters, 'Fetched Data', 'Data', 'Data', 'Depending on the type of data you are fetching with "Fetch User Data", this can be an integer, float, string, or array (to which you would need place in a loop and pass loopcount)' );
AddExpression( 18, ef_return_string, 'Last Fetched Key', 'Data', 'FetchedKey', 'The Key of the data fetched in the most recent "Fetch User Data" action' );

AddExpression( 11, ef_return_string, 'Player Identifier (for encryption)', 'General', 'PlayerIdentifier', 'Pass this value to your backend server if you wish to use encryption (more steps necessary, see Clay.io Encryption Docs)' );
AddExpression( 17, ef_return_string, 'Player Username', 'General', 'PlayerUsername', 'Be sure to call after "Clay.io Ready"' );
AddExpression( 12, ef_return_number, 'Logged In', 'General', 'LoggedIn', 'Will return 1 if the user is logged in, 0 otherwise' );
AddExpression( 25, ef_return_string, 'Clearance', 'General', 'Clearance', "Gives 'clay' if the user is logged into Clay.io, 'site' if they've just entered their name, or 'none' if neither" );
AddExpression( 13, ef_return_number, 'Fetched Item Count', 'Payments', 'FetchedItemCount', 'The number of items retrieved (use as max value in loop - this value is 1 less than the actual number since indices start a 0)' );
AddExpression( 14, ef_return_number | ef_variadic_parameters, 'Fetched Item ID', 'Payments', 'FetchedItemId', 'Pass the loop index in parenthesis' );
AddExpression( 15, ef_return_number | ef_variadic_parameters, 'Fetched Item Quantity', 'Payments', 'FetchedItemQuantity', 'Pass the loop index in parenthesis' );
AddExpression( 16, ef_return_string, 'Encrypted Fetched Items String', 'Payments', 'EncryptedFetchedItems', 'Use if you have encrypted payments enabled on Clay.io - this needs to be unencyrpted with a backend' );
AddExpression( 19, ef_return_number, 'Has Installed Game', 'Payments', 'HasInstalled', '1 if the user has installed (purchased if a paid game) your game, 0 otherwise' );
AddExpression( 20, ef_return_number, 'Modals Open', 'General', 'ModalsOpen', 'Returns the number of Clay.io modals that are currently open' );

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property( ept_integer,		name,	initial_value,	description )		// an integer value
// new cr.Property( ept_float,		name,	initial_value,	description )		// a float value
// new cr.Property( ept_text,		name,	initial_value,	description )		// a string
// new cr.Property( ept_color,		name,	initial_value,	description )		// a color dropdown
// new cr.Property( ept_font,		name,	'Arial,-16', 	description )		// a font with the given face name and size
// new cr.Property( ept_combo,		name,	'Item 1',		description, 'Item 1|Item 2|Item 3' )	// a dropdown list ( initial_value is string of initially selected item )
// new cr.Property( ept_link,		name,	link_text,		description, 'firstonly' )		// has no associated value; simply calls 'OnPropertyChanged' on click

var property_list = [
	new cr.Property( ept_text, 'API Key', '', 'The API Key for your Clay.io project.' ),
	new cr.Property( ept_combo,	'Debug Mode', 'Disabled', 'If enabled, achievements won\'t show up in the live feed, and high scores won\'t pollute live data. Make sure to disable before publishing your game!', 'Enabled|Disabled' ),
	new cr.Property( ept_combo,	'Use Clay.io Styles', 'Enabled', 'Advanced: If disabled, it won\'t look as pretty, but you can customize it a bit more.', 'Enabled|Disabled' ),
	new cr.Property( ept_combo,	'Use Clay.io Loader', 'Disabled', 'If enabled, will show an upgraded loading splash while the game loads.', 'Enabled|Disabled' )
	//new cr.Property( ept_combo,	'Export Mode', 'Default', 'Switch when exporting to Windows 8 (and change it back to Default when exporting to anything else)', 'Default|Windows 8' )
];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2( this instanceof arguments.callee, 'Constructor called as a function' );
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function( instance )
{
	return new IDEInstance( instance );
}

// Class representing an individual instance of an object in the IDE
function IDEInstance( instance, type )
{
	assert2( this instanceof arguments.callee, 'Constructor called as a function' );
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for ( var i = 0; i < property_list.length; i++ )
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function( property_name )
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function( renderer )
{
}

// Called by the IDE when the renderer has been released ( ie. editor closed )
// All handles to renderer-created resources ( fonts, textures etc ) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}