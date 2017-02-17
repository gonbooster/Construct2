// ECMAScript 5 strict mode
"use strict";

assert2( cr, "cr namespace not created" );
assert2( cr.plugins_, "cr.plugins_ not created" );

/////////////////////////////////////
// Plugin class
cr.plugins_.Clay = function( runtime )
{
	this.runtime = runtime;
};

( function ()
{
	var pluginProto = cr.plugins_.Clay.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function( plugin )
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	
	var clayRuntime = null;
	var clayInst = null;
	
	var Clay; // All Clay.io methods will be called from this
	var ClayPay; // The Clay.io payment object (new Clay.Payment())
	var ClayRooms; // The Clay.io rooms object (new Clay.Rooms())
	
	var clayReadyTrigger = false;
	var clayFailTrigger = false;
	
	var awardedAchievement = {}; // Info about the achievement that was just awarded
	var fetchedAchievements; // Info about the achievements that were fetched
	
	var screenshotSrc = ''; // Screenshot src stored here for expressions
	var leaderboardData; // expression: object of high scores ( after show is called )
	var leaderboardScoreCount = 0; // The number of scores retrieved ( minus 1 )

	var leaderboardRank = 0; // The rank of the logged in user's most recent / highest score
	var leaderboardRankScore = 0; // The score associated with above rank
	var leaderboardRankName = ''; // The name associated with above rank

	var paymentResponse = 0; // Response from Clay.Payment.checkout
	var roomCount = 0; // # of people in the room the user has joined
	var roomID = 0; // # unique id of the room the user has joined
	var persistentData; // data returned by fetchUserData
	var lastFetchedKey = ''; // key of last fetched fetchUserData
	var lastFetchedLeaderboardId; // key of last fetched fetchUserData
	var fetchedItems; // data returned by fetchItems
	
	var localModalsOpen = 0; // Used for CocoonJS

	var typeProto = pluginProto.Type.prototype;
	
	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class

	pluginProto.Instance = function( type )
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	var preloader = function() {
		if( cr_getC2Runtime().uses_loader_layout ) return false;
		
		var c2runtime = cr_getC2Runtime();
		
		var progress = c2runtime && c2runtime.progress ? c2runtime.progress : 0;

		var canvas, ctx, barWidth, barHeight, barOffsetX, barOffsetY, posY, staticPosY, scaleX, scaleY;
		var c2canvas = document.getElementById( 'c2canvas' );

		canvas = document.createElement( 'canvas' );
		canvas.style.background = '#000';
		ctx = canvas.getContext( '2d' );
		
		var c2canvasdiv = document.getElementById( 'c2canvasdiv' )
		c2canvasdiv.appendChild( canvas );
		
		var clayLogo = new Image();
		clayLogo.src = 'http://clay.io/images/full-logo-free-games.svg';
		
		var c2Logo = new Image();
		c2Logo.src = 'http://clay.io/images/docs/c2.svg';

		var loaderLogo = c2runtime.loaderlogo;
		
		var setup = function() {
			loaderLogo.onload = clayLogo.onload = c2Logo.onload = function() {};
			
			// Resize to canvas height
			canvas.width = c2runtime.width;
			canvas.height = c2runtime.height;
						
			// Overlay
			canvas.style.position = 'absolute';
			canvas.style.zIndex = '5';
			canvas.style.left = c2canvas.offsetLeft + 'px';
			canvas.style.top = c2canvas.offsetTop + 'px';
			canvas.setAttribute( 'style', canvas.getAttribute( 'style' ) +' -ms-touch-action: none;' );
			
			// Size everything based on 1000 x 1000, but scale to size
			scaleX = canvas.width / 1000;
			scaleY = canvas.height / 1000;
			
			posY = 0;
			
			// Draw in project logo if they have one
			var loaderLogoHeight = scaleY * 200;
			var loaderLogoOffsetY = scaleY * 50;
			posY += loaderLogoOffsetY;
			var loaderLogoPosY = posY;
			var drawLoaderLogo = function() {
				var loaderLogoWidth = ( loaderLogo.width / loaderLogo.height ) * loaderLogoHeight;
				var loaderLogoOffsetX = scaleX * 500 - ( loaderLogoWidth / 2 ); // Centered
				ctx.drawImage( loaderLogo, loaderLogoOffsetX, loaderLogoPosY, loaderLogoWidth, loaderLogoHeight );
			};
			// If the image is already loaded
			if( loaderLogo && loaderLogo.complete )
			{
				drawLoaderLogo();
			}
			else if( loaderLogo )
			{
				loaderLogo.onload = function() {
					drawLoaderLogo();
				};
			}

			posY += loaderLogoHeight;
						
			// 75% of the canvas, centered
			barWidth = scaleX * 750;
			barHeight = 100 * scaleY;
			barOffsetX = scaleX * 125;
			barOffsetY = scaleY * 30;
			posY += barOffsetY;
			staticPosY = posY;
			var grd = ctx.createLinearGradient( 0, staticPosY, 0, staticPosY + barHeight);
			grd.addColorStop ( 0, '#fff' );
			grd.addColorStop ( 1, '#ccc' );
			ctx.fillStyle = grd;
			ctx.strokeStyle = '#777';
			ctx.lineWidth = scaleX * 4;
			
			// Padding
			posY += scaleY * 30;
			
			
			var textHeight = scaleY * 30;
			ctx.font = textHeight + 'px sans-serif, Verdana, Arial';
			var measure = ctx.measureText( "Powered By" );
			var textOffsetX = scaleX * 500 - measure.width / 2; // Centered
			var textOffsetY = barHeight + textHeight;
			posY += textOffsetY;
			ctx.fillText( "Powered By", textOffsetX, posY );
			
			// Padding
			posY += scaleY * 10;
			
			var drawClayLogo = function() {
				
				var clayLogoHeight = scaleY * 100;
				var clayLogoWidth = ( clayLogo.width / clayLogo.height ) * clayLogoHeight;
				var clayLogoOffsetX = scaleX * 450 - clayLogoWidth;
				var clayLogoOffsetY = posY;
				ctx.drawImage( clayLogo, clayLogoOffsetX, clayLogoOffsetY, clayLogoWidth, clayLogoHeight );
				
				// Mouse pointer on hover
				var mousedOverClayLogo = false;
				canvas.onmousemove = function( e ) {
					var x = e.pageX || e.clientX;
					var y = e.pageY || e.clientY;
					x -= canvas.offsetLeft;
					y -= canvas.offsetTop;
					if( x >= clayLogoOffsetX && x <= clayLogoOffsetX + clayLogoWidth &&
						y >= clayLogoOffsetY && y <= clayLogoOffsetY + clayLogoHeight )
					{
						mousedOverClayLogo = true
						canvas.style.cursor = 'pointer';
					}
					else if( mousedOverClayLogo )
					{
						mousedOverClayLogo = false;
						canvas.style.cursor = 'default';
					}
				};
				canvas.onclick = function() {
					if( mousedOverClayLogo )
						window.open( 'http://clay.io/play' );
				};
			};
			
			// If the image is already loaded
			if( clayLogo && clayLogo.complete )
			{
				drawClayLogo();
			}
			else if( clayLogo )
			{
				clayLogo.onload = function() {
					drawClayLogo();
				};
			}
			
			var drawC2Logo = function() {
				var c2LogoHeight = scaleY * 100;
				var c2LogoWidth = ( c2Logo.width / c2Logo.height ) * c2LogoHeight;
				var c2LogoOffsetX = scaleX * 650;
				ctx.drawImage( c2Logo, c2LogoOffsetX, posY, c2LogoWidth, c2LogoHeight );
			};
			// If the image is already loaded
			if( c2Logo && c2Logo.complete )
			{
				drawC2Logo();
			}
			else if( c2Logo )
			{
				c2Logo.onload = function() {
					drawC2Logo();
				};
			}
		};
		
		var lastCanvasWidth = c2canvas.width;
		var lastCanvasHeight = c2canvas.height;
		var render = function() {
			// Event listener for canvas resize isn't working quite right, so just check manually
			if( lastCanvasWidth != c2canvas.width || lastCanvasHeight != c2canvas.height )
			{
				// Resize
				setup();
				lastCanvasWidth = c2canvas.width;
				lastCanvasHeight = c2canvas.height;
			}
			
			var actualProgress = c2runtime && c2runtime.progress ? c2runtime.progress : 0;
			// Interpolate
			if( progress < actualProgress )
				progress += 0.01; // Go up 1% at a time
			if( actualProgress >= 1 )
				progress = 1;
				

			var fill = ( progress * barWidth );
			ctx.fillRect( barOffsetX, staticPosY, fill, barHeight );
			ctx.strokeRect( barOffsetX, staticPosY, barWidth, barHeight );	

			// setTimeout should be fine for this...
			if( actualProgress < 1 )
				setTimeout( render, 32 );
			else
				// Remove the loader
				canvas.parentNode.removeChild( canvas );
		};
		
		
		render();

	};

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		if( this.properties[3] == 0 )
			preloader();
		
		clayRuntime = this.runtime;
		clayInst = this;

		// Initialization code for Clay.io
		var debugMode = this.properties[1] == 0;
		var DOMid = this.properties[2] == 0 ? false : 'c2canvasdiv';
		//var defaultExport = this.properties[2] == 0;
		//var windows8 = this.properties[2] == 1;
		
		if( window['c2cocoonjs'] ) {
			
			// Wait for the external frame to load (not sure of a callback...)
			var _this = this
			var clayLoaded = false;
			if( typeof window['Clay'] === 'undefined' )
			{
				window['Clay'] = {};
			}
			
			Clay = window['Clay']; // Will store some data in here to mimic a local version of the API
			Clay['UI'] = { modalsOpen: function() { return localModalsOpen; } };
			CocoonJS['App']['onLoadInTheWebViewSucceed']['addEventListener']( function() {
				// Using Async for now since forward alone throws errors...
				// Webview is shown in Clay API
				//CocoonJS['App']['forwardAsync']( "CocoonJS.App.show(0, 0, " + window.innerWidth / 2 + ", " + window.innerHeight + ");" );
				if( !clayLoaded )
				{
					clayLoaded = true;
					CocoonJS['App']['forwardAsync']( "CocoonJS['App']['hide']();" );
					CocoonJS['App']['forwardAsync']( "load_clay( '" + _this.properties[0] + "', " + debugMode + " );" );
				}
			} );
			CocoonJS['App']['loadInTheWebView']( "webview/webview.html" );

		}
		else
		{
			if( typeof window['Clay'] === 'undefined' )
			{
				window['Clay'] = {};
			}
			
			Clay = window['Clay'];
			Clay['options'] = Clay['options'] || {};
			Clay['options']['debug'] = debugMode;
			Clay['options']['DOMid'] = DOMid;
			Clay['options']['fail'] = function() {
				clayFailTrigger = true;				
			};

			Clay['gameKey'] = this.properties[0];
			Clay['readyFunctions'] = Clay['readyFunctions'] || [];
			Clay['ready'] = function( fn ) {
				Clay['readyFunctions'].push( fn );
			};
			
			Clay['documentReadyFunctions'] = Clay['documentReadyFunctions'] || [];
			Clay['documentReady'] = function( fn ) {
				Clay['documentReadyFunctions'].push( fn );
			};
			
			// So stats log doesn't fail before API is loaded in
			Clay['Stats'] = Clay['Stats'] || {};
			Clay['Stats']['level'] = Clay['Stats']['level'] || function() {  };
			
			if( "chrome-extension:" == document.location.protocol || "file:" == document.location.protocol )
				Clay['PROTOCOL'] = "https://";
			else if( "ms-appx:" == document.location.protocol ) // Could do https, but doesn't play nicely with unsecure ads
			    Clay['PROTOCOL'] = "http://";
			else
				Clay['PROTOCOL'] = document.location.protocol + "//";
				
			
			if( !Clay['source'] ) // if Clay.io isn't already loaded in
			{
				( function() {
					var clay = document.createElement( "script" );
					clay.src = window['Clay']['PROTOCOL'] + "clay.io/api/api.js"; 
					var tag = document.getElementsByTagName( "script" )[0]; tag.parentNode.insertBefore( clay, tag );
				} )();
			}
		
			Clay['ready']( function() {
				// runtime.trigger doesn't work until you're playing the game :/
				// clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.clayready, clayInst );
				clayReadyTrigger = true;
				
				ClayPay = new Clay['Payment']();
			} );
		}
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function( ctx )
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function ( glw )
	{
	};

	//////////////////////////////////////
	// Conditions

	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.clayready = function () {
		var ret = clayReadyTrigger;
		if( ret )
			clayReadyTrigger = false;
		return ret;
	}
	cnds.cdns_failed_to_load = function () {
		var ret = clayFailTrigger;
		if( ret )
			clayFailTrigger = false;
		return ret;
	}
	cnds.cdns_leaderboard_post = function () {
		return true;
	}
	cnds.cdns_leaderboard_fetch = function () {
		return true;
	}
	cnds.cdns_achievement_award = function () {
		return true;
	}
	cnds.cdns_achievement_fetch = function () {
		return true;
	}
	cnds.cdns_screenshot_take = function () {
		return true;
	}
	cnds.cdns_facebook_post = function () {
		return true;
	}
	cnds.cdns_facebook_invite = function () {
		return true;
	}
	cnds.cdns_twitter_post = function () {
		return true;
	}
	cnds.cdns_clay_post = function () {
		return true;
	}
	cnds.cdns_social_share = function () {
		return true;
	}
	cnds.cdns_clay_add_payment_item = function () {
		return true;
	}
	cnds.cdns_clay_checkout = function () {
		return true;
	}
	cnds.cdns_clay_checkout_fail = function () {
		return true;
	}
	cnds.cdns_clay_rooms_show = function () {
		return true;
	}
	cnds.cdns_clay_rooms_full = function () {
		return true;
	}
	cnds.cdns_clay_fetch_data = function () {
		return true;
	}
	cnds.cdns_clay_save_data = function () {
		return true;
	}
	cnds.cdns_clay_prompt_login = function () {
		return true;
	}
	cnds.cdns_clay_prompt_logout = function () {
		return true;
	}
	cnds.cdns_clay_fetch_items = function () {
		return true;
	}
	cnds.cdns_clay_set_game_key = function () {
		return true;
	}
	
	//////////////////////////////////////
	// Actions

	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	window['clay_from_cocoon_ready'] = function ( identifier, username, loggedIn, clearance, hasInstalled ) {
		Clay['isReady'] = true;
		Clay['Player'] = {
			identifier: identifier,
			data: { username: username },
			loggedIn: loggedIn,
			clearance: clearance,
			hasInstalled: function() {
				return hasInstalled;
			}
		};

		clayReadyTrigger = true;
	}
	
	window['clay_from_cocoon_user_ready'] = function( identifier, username, loggedIn, clearance, hasInstalled ) {
		Clay['Player'] = {
			identifier: identifier,
			data: { username: username },
			loggedIn: loggedIn,
			clearance: clearance,
			hasInstalled: function() {
				return hasInstalled;
			}
		};
	}
	window['clay_from_cocoon_fail'] = function () {
		clayFailTrigger = true;
	}
	
	window['clay_modal_count'] = function ( modalsOpen ) {
		localModalsOpen = parseInt( modalsOpen );
	}		
	
	acts.log_play = function () {
		Clay['Stats']['logStat']( { 'name': 'Plays' } );
	}
	
	acts.log_stat = function ( metric, increment ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['Stats']['logStat']( { name: '" + metric + "', quantity: " + increment + " } );" );
			return;
		}
		Clay['Stats']['logStat']( { 'name': metric, 'quantity': increment } );
	}
	
	acts.level_start = function ( level ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['Stats']['level']( { action: 'start', level: level } );" );
			return;
		}
		Clay['Stats']['level']( { 'action': 'start', 'level': level } );
	}
	
	acts.level_success = function ( level ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['Stats']['level']( { action: 'pass', level: level } );" );
			return;
		}
		Clay['Stats']['level']( { 'action': 'pass', 'level': level } );
	}
	
	acts.level_fail = function ( level ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['Stats']['level']( { action: 'fail', level: level } );" );
			return;
		}
		Clay['Stats']['level']( { 'action': 'fail', 'level': level } );
	}
	
	acts.leaderboards_post = function ( playerName, playerPoints, leaderboardID, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			var leaderboardIDStr = '';
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			leaderboardIDStr += leaderboardID;
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			CocoonJS['App']['forwardAsync']( "leaderboards_post( '" + playerName + "', '" + playerPoints + "', " + leaderboardIDStr + ", '" + showNotification + "' );" );
			return;
		}
		
		var scoreObj = {
			"name": playerName
		};
		
		if( playerPoints )
			scoreObj["score"] = playerPoints;
		else
			scoreObj["score"] = 0;
			
		if( showNotification != 0 ) // 0 = yes, 1 = no
			scoreObj["hideUI"] = true;
			
		var leaderboard = new Clay['Leaderboard']( { id: leaderboardID } );
		leaderboard['post']( scoreObj, function() {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_leaderboard_post, clayInst );
		} );
	}
	window['clay_from_cocoon_leaderboards_post'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_leaderboard_post, clayInst );
	}
	
	acts.leaderboards_post_encrypted = function ( leaderboardID, jwt ) {
		if( window['c2cocoonjs'] ) 
		{
			var leaderboardIDStr = '';
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			leaderboardIDStr += leaderboardID;
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			CocoonJS['App']['forwardAsync']( "leaderboards_post_encrypted( " + leaderboardIDStr + ", '" + jwt + "' );" );
			return;
		}
		var leaderboard = new Clay['Leaderboard']( { id: leaderboardID } );
		leaderboard['post']( jwt, function() {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_leaderboard_post, clayInst );
		} );
	}

	acts.leaderboards_show = function ( leaderboardID, timeFrame, type, sort, scoresFrom, numScores ) {
		if( window['c2cocoonjs'] ) 
		{
			var leaderboardIDStr = '';
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			leaderboardIDStr += leaderboardID;
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			CocoonJS['App']['forwardAsync']( "leaderboards_show( " + leaderboardIDStr + ", " + timeFrame + ", " + type + ", " + sort + ", " + scoresFrom + ", " + numScores + " );" );
			return;
		}
		
		var recent = 0;
		if( !numScores )
			numScores = 10;
		switch( timeFrame )
		{
			case 0:
				recent = 0;
				break;
			case 1:
				recent = 3600 * 24 * 30;
				break;
			case 2:
				recent = 3600 * 24 * 7;
				break;
			case 3:
				recent = 3600 * 24;
				break;
			default:
				recent = 0;
		}
		var options = {
			"cumulative": ( type === 1 ),
			"best": ( type === 2 ),
			"self": ( scoresFrom === 1 ) ? true : false,
			"friends": ( scoresFrom === 2 ) ? true : false,
			"recent": recent,
			"sort": ( sort === 1 ) ? 'asc' : 'desc',
			"limit": numScores
		}
		var leaderboard = new Clay['Leaderboard']( { id: leaderboardID } );
		leaderboard['show']( options );
	}

	acts.leaderboards_fetch = function ( leaderboardID, timeFrame, type, sort, scoresFrom, numScores ) {
		if( window['c2cocoonjs'] ) 
		{
			var leaderboardIDStr = '';
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			leaderboardIDStr += leaderboardID;
			if( typeof leaderboardID == 'string' )
				leaderboardIDStr += "'";
			CocoonJS['App']['forwardAsync']( "leaderboards_fetch( " + leaderboardIDStr + ", " + timeFrame + ", " + type + ", " + sort + ", " + scoresFrom + ", " + numScores + " );" );
			return;
		}
		var recent = 0;
		if( !numScores )
			numScores = 10;
		switch( timeFrame )
		{
			case 0:
				recent = 0;
				break;
			case 1:
				recent = 3600 * 24 * 30;
				break;
			case 2:
				recent = 3600 * 24 * 7;
				break;
			case 3:
				recent = 3600 * 24;
				break;
			default:
				recent = 0;
		}
		var options = {
			"cumulative": ( type === 1 ),
			"best": ( type === 2 ),
			"self": ( scoresFrom === 1 ) ? true : false,
			"friends": ( scoresFrom === 2 ) ? true : false,
			"recent": recent,
			"sort": ( sort === 1 ) ? 'asc' : 'desc',
			"limit": numScores,
			"getRank": true
		}
		var leaderboard = new Clay['Leaderboard']( { id: leaderboardID } );
		leaderboard['fetch']( options, function( results ) {
			leaderboardData = results['data'] || [];

			if( results['rank']['rank'] ) {
				leaderboardRank = results['rank']['rank'];
				leaderboardRankScore = results['rank']['row']['score'];
				leaderboardRankName = results['rank']['row']['name'];
			}
			leaderboardScoreCount = results && results['data'] ? results['data'].length - 1 : -1; // minus 1 so we can do 0 -> lbscore
			if( leaderboardScoreCount < 0 ) leaderboardScoreCount = 0;
			lastFetchedLeaderboardId = leaderboardID;
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_leaderboard_fetch, clayInst );
		} );
	}
	window['clay_from_cocoon_leaderboards_fetch'] = function ( id, data, score, rank, rankScore, rankName ) {
		leaderboardData = JSON.parse( data );
		leaderboardScoreCount = score;
		leaderboardRank = rank;
		leaderboardRankScore = rankScore;
		leaderboardRankName = rankName;
		lastFetchedLeaderboardId = id;
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_leaderboard_fetch, clayInst );
	}
	
	acts.leaderboards_hide = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['UI']['closeModal']( 'clay-leaderboard-wrapper' );" );
			return;
		}
		Clay['UI']['closeModal']( 'clay-leaderboard-wrapper' );
	}
	
	// Closes any modal
	acts.close_modal = function( ID ) {
		if( window['c2cocoonjs'] ) 
		{
			if( ID )
				CocoonJS['App']['forwardAsync']( "Clay['UI']['closeModal']( 'clay-" + ID + "-wrapper' );" );
			else
				CocoonJS['App']['forwardAsync']( "Clay['UI']['closeModal']();" );
			return;
		}
		if( ID )
			Clay['UI']['closeModal']( 'clay-' + ID + '-wrapper' );
		else
			Clay['UI']['closeModal']();
	}

	// time = how long to show achiev for
	acts.achievements_award = function ( achievementID, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			var achievementIDStr = '';
			if( typeof achievementID == 'string' )
				achievementIDStr += "'";
			achievementIDStr += achievementID;
			if( typeof achievementID == 'string' )
				achievementIDStr += "'";
				
			CocoonJS['App']['forwardAsync']( "achievements_award( " + achievementIDStr + ", " + showNotification + " );" );
			return;
		}
		
		var options = { id: achievementID };
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;
		
		var achievement = new Clay['Achievement']( options );
		achievement['award']( function( response ) {
			if( response['success'] )
			{
				awardedAchievement[ achievementID ] = response;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_achievement_award, clayInst );
			}
		} );
	}
	window['clay_from_cocoon_achievements_award'] = function ( achievementID, response ) {
		awardedAchievement[ achievementID ] = JSON.parse( response );
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_achievement_award, clayInst );
	}
	
	acts.achievements_fetch = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "achievements_fetch_all();" );
			return;
		}
		Clay['Achievement']['fetchAll']( {}, function( results ) {
			fetchedAchievements = results['data'];

			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_achievement_fetch, clayInst );
		} );
	}
	window['clay_from_cocoon_achievements_fetch'] = function ( data ) {
		fetchedAchievements = JSON.parse( data );
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_achievement_fetch, clayInst );
	}
	
	acts.achievements_award_encrypted = function ( jwt ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "achievements_award_encrypted( '" + jwt + "' );" );
			return;
		}
		
		var achievement = new Clay['Achievement']( { jwt: jwt } );
		achievement['award']( function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_achievement_award, clayInst );
		} );
	}
	acts.achievements_show_all = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "achievements_show_all();" );
			return;
		}
		Clay['Achievement']['showAll']();
	}
	
	acts.screenshot_show = function ( dataURL, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "screenshot_show( '" + dataURL + "', " + showNotification + " );" );
			return;
		}
		
		var screenshot = new Clay['Screenshot']( { prompt: false } );
		screenshot.data = dataURL;
		
		var options = {};
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;
		
		screenshot.save( options, function( response ) {
			if( response.success ) {
				screenshotSrc = response.imageSrc;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_screenshot_take, clayInst );
			}
		} );
	}
	window['clay_from_cocoon_screenshot_show'] = function ( src ) {
		screenshotSrc = src;
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_screenshot_take, clayInst );
	}

	acts.suggestions_show = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "new Clay['Suggestions']();" );
			return;
		}
		
		new Clay['Suggestions']();
	}
	acts.suggestions_hide = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['UI']['closeModal']( 'clay-suggestions-wrapper' );" );
			return;
		}
		
		Clay['UI']['closeModal']( 'clay-suggestions-wrapper' );
	}

	acts.ratings_show = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "new Clay['Ratings']();" );
			return;
		}
		
		new Clay['Ratings']();
	}
	acts.ratings_hide = function () {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "Clay['UI']['closeModal']( 'clay-ratings-wrapper' );" );
			return;
		}
		
		Clay['UI']['closeModal']( 'clay-ratings-wrapper' );
	}
	
	acts.facebook_post = function( message, url, picture, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "facebook_post( '" + message + "', '" + url + "', '" + picture + "', " + showNotification + " );" );
			return;
		}

		var options = { message: message };
		if( url != '' )
			options['link'] = url;
		if( picture != '' )
			options['picture'] = picture;
			
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;

		Clay['Facebook']['post']( options, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_facebook_post, clayInst );
		} );
	}
	window['clay_from_cocoon_facebook_post'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_facebook_post, clayInst );
	}

	acts.facebook_invite = function( caption ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "facebook_invite( '" + caption + "' );" );
			return;
		}
		
		var options = {};
		if( caption !== '' )
			options['caption'] = caption;
		Clay['Facebook']['invite']( options, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_facebook_invite, clayInst );			
		} );
	}
	window['clay_from_cocoon_facebook_invite'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_facebook_invite, clayInst );
	}
	
	acts.twitter_post = function( message, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "twitter_post( '" + message.replace( "'", "\'" ) + "', " + showNotification + " );" );
			return;
		}
				
		var options = { message: message };
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;
			
		Clay['Twitter']['post']( options, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_twitter_post, clayInst );
		} );
	}
	window['clay_from_cocoon_twitter_post'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_twitter_post, clayInst );
	}
	
	acts.clay_post = function( message, showNotification ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_post( '" + message.replace( "'", "\'" ) + "', " + showNotification + " );" );
			return;
		}
			
		var options = { message: message };
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;
			
		Clay['Stream']['post']( options, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_post, clayInst );
		} );
	}
	window['clay_from_cocoon_clay_post'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_post, clayInst );
	}
	
	acts.social_share = function( message ) {
		/*if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_post( '" + message.replace( "'", "\'" ) + "', " + showNotification + " );" );
			return;
		}*/
		
		var options = { message: message };
		/*
		if( showNotification != 0 ) // 0 = yes, 1 = no
			options["hideUI"] = true;*/
			
		Clay['Social']['share']( options, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_social_share, clayInst );
		} );
	}
	/*window['clay_from_cocoon_clay_post'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_post, clayInst );
	}*/
	
	// Payments
	acts.clay_add_payment_item = function( itemID ) {
		if( window['c2cocoonjs'] ) 
		{
			var itemIDStr = '';
			if( typeof itemID == 'string' )
				itemIDStr += "'";
			itemIDStr += itemID;
			if( typeof itemID == 'string' )
				itemIDStr += "'";
			CocoonJS['App']['forwardAsync']( "add_payment_item( " + itemID + " );" );
			return;
		}
		
		ClayPay['addItem']( { id: itemID }, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_add_payment_item, clayInst );
		} );
	}
	window['clay_from_cocoon_add_payment_item'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_add_payment_item, clayInst );
	}
	
	acts.clay_remove_payment_item = function( itemID ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "ClayPay['removeItem']( { id: " + itemID + " } );" );
			return;
		}
		
		ClayPay['removeItem']( { id: itemID } );
	}
	/**
	 * If encrypted, it will be a string instead of obj
	 */
	acts.clay_checkout = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_checkout();" );
			return;
		}
		
		ClayPay['checkout']( function( response ) {
			if( response.success )
			{
				paymentResponse = response.itemIds;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout, clayInst );
			}
			else if( response.jwt ) // encrypted string sent back
			{
				paymentResponse = response.jwt;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout, clayInst );				
			}
			else
			{
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout_fail, clayInst );				
			}
		} );
	}
	window['clay_from_cocoon_clay_checkout'] = function ( response ) {
		paymentResponse = response;
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout, clayInst );
	}
	window['clay_from_cocoon_clay_checkout_fail'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout_fail, clayInst );	
	}
	
	acts.clay_fetch_items = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_fetch_items();" );
			return;
		}
		
		Clay['Player']['fetchItems']( function( items ) {		
			fetchedItems = items;
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_fetch_items, clayInst );				
		} );
	}
	window['clay_from_cocoon_clay_fetch_items'] = function ( items ) {
		fetchedItems = JSON.parse( items );
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_fetch_items, clayInst );				
	}
	
	acts.clay_purchase_game = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_purchase_game();" );
			return;
		}
		
		Clay['Player']['purchaseGame']( function( response ) {
			if( response.success )
			{
				paymentResponse = response.itemIds;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout, clayInst );
			}
			else if( response.jwt ) // encrypted string sent back
			{
				paymentResponse = response.jwt;
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout, clayInst );				
			}
			else
			{
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_checkout_fail, clayInst );				
			}
		} );
	}
	
	
	acts.clay_remove_player_item = function( itemID ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_remove_player_item( " + itemID + " );" );
			return;
		}
		
		Clay['Player']['removeItem']( { id: itemID }, function( response ) {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_remove_player_item, clayInst );
		} );
	}
	window['clay_from_cocoon_remove_player_item'] = function () {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_remove_player_item, clayInst );
	}
	
	// Multiplayer rooms
	acts.clay_rooms = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_rooms();" );
			return;
		}
		
		// Only create the obj if it hasn't been created yet...
		if( !ClayRooms )
		{
			ClayRooms = new Clay['Rooms']( function( roomJoined ) {
				// Called when room is full
				roomCount = roomJoined.count; // # of people in room
				roomID = roomJoined.id; // the room joined
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_rooms_full, clayInst );
			} );
		}
		
		ClayRooms['show']( function( rooms ) {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_rooms_show, clayInst );
		} );
	}
	window['clay_from_cocoon_clay_rooms_show'] = function () {
		fetchedItems = JSON.parse( items );
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_rooms_show, clayInst );
	}
	window['clay_from_cocoon_clay_rooms_full'] = function () {
		fetchedItems = JSON.parse( items );
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_rooms_full, clayInst );
	}
	
	acts.clay_rooms_force_leave = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "ClayRooms['leaveRoom']();" );
			return;
		}
		ClayRooms['leaveRoom']();
	}
	
	// Persistent data Storage
	acts.clay_fetch_data = function( key ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_fetch_data( '" + key.replace( "'", "\'" ) + "' );" );
			return;
		}
		
		Clay['Player']['fetchUserData']( key, function( response ) {
			persistentData = response.data;
			lastFetchedKey = key;
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_fetch_data, clayInst );			
		} );
	}
	window['clay_from_cocoon_clay_fetch_data'] = function ( data, key ) {
		persistentData = JSON.parse( data );
		lastFetchedKey = key;
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_fetch_data, clayInst );	
	}
	
	acts.clay_save_data = function( key, data ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_save_data( '" + key.replace( "'", "\'" ) + "', '" + data.replace( "'", "\'" ) + "' );" );
			return;
		}
		
		Clay['Player']['saveUserData']( key, data, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_save_data, clayInst );	
			else
				Clay['log']( response.error );		
		} );
	}
	window['clay_from_cocoon_clay_save_data'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_save_data, clayInst );	
	}
	
	// Prompt Login
	acts.clay_prompt_login = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_prompt_login();" );
			return;
		}
		
		Clay['Player']['signup']( function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_prompt_login, clayInst );			
		} );
	}
	window['clay_from_cocoon_clay_prompt_login'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_prompt_login, clayInst );			
	}
	
	// Prompt Logout
	acts.clay_prompt_logout = function() {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_prompt_logout();" );
			return;
		}
		
		Clay['Player']['logout']( {}, function( response ) {
			if( response.success )
				clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_prompt_logout, clayInst );		
		} );
	}
	window['clay_from_cocoon_clay_prompt_logout'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_prompt_logout, clayInst );			
		Clay['Player']['clearance'] = 'site';			
		Clay['Player']['data'] = {};
		Clay['Player']['identifier'] = 0;
	}
	
	// Set Game key
	acts.clay_set_game_key = function( key ) {
		if( window['c2cocoonjs'] ) 
		{
			CocoonJS['App']['forwardAsync']( "clay_set_game_key( '" + key + "' );" );
			return;
		}
		
		Clay['Game']['set']( { key: key, options: { debug: this.properties[1] == 0 } }, function() {
			clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_set_game_key, clayInst );				
		} );
	}
	
	window['clay_from_cocoon_clay_set_game_key'] = function () {
		clayRuntime.trigger( cr.plugins_.Clay.prototype.cnds.cdns_clay_set_game_key, clayInst );			
	}
	
	
	// Requested feature, not really related to Clay.io
	acts.cocoon_go_to_link = function( url ) {
		if( window['c2cocoonjs'] )
			CocoonJS['App']['openURL']( url );
		else
			window.open( url );
	}
	
	//////////////////////////////////////
	// Expressions

	pluginProto.exps = {};
	var exps = pluginProto.exps;

	// This value might actually not be completely correct (called too early in Clay)
	exps.Ready = function( ret ) {
		ret.set_int( Clay && Clay['isReady'] ? 1 : 0 );
	}
	exps.ScreenshotSrc = function( ret ) {
		ret.set_string( screenshotSrc );
	}
	exps.AwardedAchievementTitle = function( ret, achievementID ) {
		if( awardedAchievement[ achievementID ] && awardedAchievement[ achievementID ]['title'] )
			ret.set_string( awardedAchievement[ achievementID ]['title'] );
		else
			ret.set_string( '' );
	}
	exps.AwardedAchievementDescription = function( ret, achievementID ) {
		if( awardedAchievement[ achievementID ] && awardedAchievement[ achievementID ]['description'] )
			ret.set_string( awardedAchievement[ achievementID ]['description'] );
		else
			ret.set_string( '' );
	}
	/*exps.AwardedAchievementPoints = function( ret, achievementID ) {
		if( awardedAchievement[ achievementID ] )
			ret.set_int( awardedAchievement[ achievementID ]['points'] );
		else
			ret.set_int( 0 );
	}*/
	exps.AwardedAchievementIcon = function( ret, achievementID ) {
		if( awardedAchievement[ achievementID ] && awardedAchievement[ achievementID ]['icon'] )
			ret.set_string( awardedAchievement[ achievementID ]['icon'] );
		else
			ret.set_string( '' );
	}
	exps.FetchedAchievementTitle = function( ret, index ) {
		if( fetchedAchievements[ index ] && fetchedAchievements[ index ]['title'] )
			ret.set_string( fetchedAchievements[ index ]['title'] );
		else
			ret.set_string( '' );
	}
	exps.FetchedAchievementDescription = function( ret, index ) {
		if( fetchedAchievements[ index ] && fetchedAchievements[ index ]['description'] )
			ret.set_string( fetchedAchievements[ index ]['description'] );
		else
			ret.set_string( '' );
	}
	exps.FetchedAchievementIcon = function( ret, index ) {
		if( fetchedAchievements[ index ] && fetchedAchievements[ index ]['icon'] )
			ret.set_string( fetchedAchievements[ index ]['icon'] );
		else
			ret.set_string( '' );
	}
	/*exps.FetchedAchievementPoints = function( ret, index ) {
		if( fetchedAchievements[ index ] )
			ret.set_int( fetchedAchievements[ index ]['points'] );
		else
			ret.set_int( 0 );
	}*/
	exps.FetchedAchievementEarned = function( ret, index ) {
		if( fetchedAchievements[ index ] )
			ret.set_int( fetchedAchievements[ index ]['earned'] ? 1 : 0 );
		else
			ret.set_int( 0 );
	}
	exps.FetchedAchievementCount = function( ret ) {
		var fetchedAchievementsCount = fetchedAchievements.length > 0 ? fetchedAchievements.length - 1 : -1;
		ret.set_int( fetchedAchievementsCount );
	}
	exps.LeaderboardScoreCount = function( ret ) {
		ret.set_int( leaderboardScoreCount );
	}
	exps.LeaderboardName = function( ret, index ) {
		if( typeof leaderboardData !== 'object' || typeof leaderboardData[index] === 'undefined' )
			ret.set_string( "" );
		else
			ret.set_string( leaderboardData[index]['name'] );
	}
	exps.LeaderboardScore = function( ret, index ) {
		if( typeof leaderboardData !== 'object' || typeof leaderboardData[index] === 'undefined' )
			ret.set_int( 0 );
		else
			ret.set_int( leaderboardData[index]['score'] );
	}
	exps.LeaderboardScoreMe = function( ret, index ) {
		if( typeof leaderboardData !== 'object' || typeof leaderboardData[index] === 'undefined' )
			ret.set_int( 0 );
		else
			ret.set_int( leaderboardData[index]['me'] ? 1 : 0 );
	}
	exps.LeaderboardRank = function( ret ) {
		ret.set_int( leaderboardRank );
	}
	exps.LeaderboardRankName = function( ret ) {		
		ret.set_string( leaderboardRankName );
	}
	exps.LeaderboardRankScore = function( ret ) {
		ret.set_int( leaderboardRankScore );
	}
	// key fetched by fetchUserData
	exps.FetchedLeaderboardID = function( ret ) {
		ret.set_string( lastFetchedLeaderboardId );
	}
	exps.PaymentItemCount = function( ret ) {
		ret.set_int( paymentResponse.length - 1 );
	}
	// Only for unencrypted responses
	exps.PaymentItemId = function( ret, index ) {
		if( typeof paymentResponse[index] === 'undefined' )
			ret.set_int( 0 );
		else
			ret.set_int( paymentResponse[index] );
	}
	// Only for encrypted responses
	exps.EncryptedPaymentResponse = function( ret ) {
		ret.set_string( paymentResponse );
	}
	// # of people in room the player joins
	exps.RoomCount = function( ret ) {
		ret.set_int( roomCount );
	}
	// Unique id of room the player joins
	exps.RoomId = function( ret ) {
		ret.set_int( roomID );
	}
	// data fetched by fetchUserData
	exps.Data = function( ret, index ) {
		var data;
		if( typeof index !== 'undefined' && index !== null )
			data = persistentData[index];
		else
			data = persistentData;
		
		if( typeof data === 'undefined' || data == null )
			ret.set_string( '' );
		else if( typeof data === 'number' && parseInt( data ) == data )
			ret.set_int( data );
		else if( typeof data === 'number' )
			ret.set_float( data );
		else if( typeof data === 'string' )
			ret.set_string( data );
	}
	// key fetched by fetchUserData
	exps.FetchedKey = function( ret ) {
		ret.set_string( lastFetchedKey );
	}
	// For encryption
	exps.PlayerIdentifier = function( ret ) {
		ret.set_string( Clay['Player'] && Clay['Player']['identifier'] ? Clay['Player']['identifier'] : '' ); // props to OneMuppet for a bug fix here
	}
	exps.PlayerUsername = function( ret ) {
		ret.set_string( Clay['Player'] && Clay['Player']['data'] && Clay['Player']['data']['username'] ? Clay['Player']['data']['username'] : 'Anonymous' ); // props to OneMuppet for a bug fix here
	}
	// If they're logged in
	exps.LoggedIn = function( ret ) {
		ret.set_int( Clay['Player'] ? ( Clay['Player']['loggedIn'] ? 1 : 0 ) : 0 );
	}
	// If they're logged in to Clay.io, or just site
	exps.Clearance = function( ret ) {
		ret.set_string( Clay['Player'] ? ( Clay['Player']['clearance'] ) : 'none' );
	}
	// # fetched by fetchItems
	exps.FetchedItemCount = function( ret ) {
		ret.set_int( fetchedItems ? fetchedItems.length - 1 : -1 );
	}
	// data fetched by fetchItems
	exps.FetchedItemId = function( ret, index ) {
		if( typeof fetchedItems[index] === 'undefined' )
			ret.set_int( 0 );
		else
			ret.set_int( fetchedItems[index]['id'] );
	}
	// data fetched by fetchItems
	exps.FetchedItemQuantity = function( ret, index ) {
		if( typeof fetchedItems[index] === 'undefined' )
			ret.set_int( 0 );
		else
			ret.set_int( fetchedItems[index]['quantity'] );
	}
	// Only for unencrypted responses
	exps.EncryptedFetchedItems = function( ret ) {
		ret.set_string( fetchedItems );
	}
	// TODO: encrypted version
	exps.HasInstalled = function( ret ) {
		ret.set_int( Clay['Player'] ? ( Clay['Player']['hasInstalled']() ? 1 : 0 ) : 0 );
	}
	exps.ModalsOpen = function( ret ) {
		ret.set_int( Clay['UI'] && Clay['UI']['modalsOpen'] ? parseInt( Clay['UI']['modalsOpen']() ) : 0 );
	}

}() );