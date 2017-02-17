﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_Matcher = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_Matcher.prototype;
		
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
        this.board = null; 
        this.boardUid = -1;    // for loading 
        this._dir = null;
        this.group = null;
        this.groupUid = -1;    // for loading     
	    this.exp_TileUID =0;	
	    this.exp_TileX =0;	        
	    this.exp_TileY =0;
        this._group_name = ""; 
        this._symbol_value = "";        	    	    
        this._symbol_cache = {}; 
        this._tiles_groups = [];
        this._has_matched_pattern = false;
		this._last_tick = null;
        
        this._square_modes = [(this.properties[0] == 1),  // horizontal
                              (this.properties[1] == 1),  // vertical
                              (this.properties[2] == 1),  // isometric-0
                              (this.properties[2] == 1),  // isometric-1
                              ];  
	};
    
    instanceProto._clean_symbol_cache = function ()
    {
        var x,y,z,_entry,_cell;
        for (x in this._symbol_cache)
        {
            _entry = this._symbol_cache[x];
            for (y in _entry)
            {
                _cell = _entry[y];
                for (z in _cell)
                {
                    delete _cell[z];
                }
                delete _entry[y];
            }
            delete this._symbol_cache[x];
        }
    };    
    
    instanceProto._write_symbol_cache = function (_x,_y)
    {
        var tile_uid = this.board.xyz2uid(_x,_y,0);
        if (tile_uid == null)
            return;
	    this.exp_TileUID = tile_uid;
	    this.exp_TileX=_x;
	    this.exp_TileY=_y;
	    this._symbol_value = "";
	    this.runtime.trigger(cr.plugins_.Rex_Matcher.prototype.cnds.OnGetSymbol, this);
        if (this._symbol_cache[_x] == null)
            this._symbol_cache[_x] = {};
        this._symbol_cache[_x][_y] = {symbol:this._symbol_value, 
                                      uid:tile_uid};
    };    
	instanceProto._symbol_at = function(x,y)
	{
	    var s = this._symbol_cache[x];
	    return (s==null)? s:s[y];
	};
	instanceProto.refilled_symbol_array = function(x,y)
	{
        this._clean_symbol_cache();
        var x,y,uid;
        var x_max= this.board.x_max;
        var y_max= this.board.y_max;
        for (y=0; y<=y_max; y++)
        {
            for (x=0; x<=x_max; x++)
                this._write_symbol_cache(x,y);
        }
	};	
	instanceProto.get_match_tiles = function(group_name,pattern_dimation)
	{
        this._group_name = group_name;
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();	
        this._has_matched_pattern = false;
        
        if (pattern_dimation == 1)
            this.runtime.trigger(cr.plugins_.Rex_Matcher.prototype.cnds.OnMatchPattern, this);
        else if (pattern_dimation == 2)
        {
            this.runtime.trigger(cr.plugins_.Rex_Matcher.prototype.cnds.OnMatchTemplatePattern2D, this);
            this.runtime.trigger(cr.plugins_.Rex_Matcher.prototype.cnds.OnMatchPattern2D, this);
        }

        if (!this._has_matched_pattern)
            this.runtime.trigger(cr.plugins_.Rex_Matcher.prototype.cnds.OnNoMatchPattern, this);
	};
    
	instanceProto.pattern_search = function(pattern, is_any_pattern_mode)
	{
        this._tiles_groups.length = 0;
        if (this._dir == null)
            this._dir = this.board.layout.GetDirCount();
        if (this._dir == 4)
            this.pattern_search_square(pattern, is_any_pattern_mode);
        else if (this._dir == 6)
            this.pattern_search_hex(pattern, is_any_pattern_mode);
        // filled this._tiles_groups
        return this._tiles_groups;
	};
    String.prototype.repeat = function( num )
    {
        return new Array( num + 1 ).join( this );
    };
    
	instanceProto.pattern_search_square = function(pattern, is_any_pattern_mode)
	{
        var is_matchN_mode = (typeof(pattern) == "number");        
	    var x,y,i,c,s,is_matched,matched_tiles=[];
	    var pattern_length=(is_matchN_mode)? pattern:pattern.length;
	    var x_max=this.board.x_max;
	    var y_max=this.board.y_max;
	    var m, mode_cnt=this._square_modes.length;
	    for (m=0; m<mode_cnt; m++)
	    {
	        if (!this._square_modes[m])
	            continue;
	            
	        for(y=0;y<=y_max;y++)
	        {
	            for(x=0;x<=x_max;x++)
	            {
	                is_matched = true;
	                matched_tiles.length=0;
                    if (is_matchN_mode)
                        pattern = null;
	                for(i=0;i<pattern_length;i++)
	                {
	                    switch (m)
	                    {
	                    case 0:    // horizontal
	                        s = this._symbol_at(x+i,y);
	                        break;
	                    case 1:    // vertical
	                        s = this._symbol_at(x,y+i);
	                        break;
	                    case 2:    // isometric-0
	                        s = this._symbol_at(x+i,y+i);
	                        break;
	                    case 3:    // isometric-1
	                        s = this._symbol_at(x-i,y+i);
	                        break;
	                    default:
	                        s = null;
	                        break;
	                    }
	                    if ((s==null) || (s.symbol == ""))
	                    {
	                        is_matched = false;
	                        break;
	                    }	                    
                        else if (is_matchN_mode && (pattern==null))
                        {
                            pattern = s.symbol.repeat(pattern_length);
                        }
	                    c = pattern.charAt(i);
	                    if (s.symbol!=c)
	                    {
	                        is_matched = false;
	                        break;
	                    }
                        matched_tiles.push(s);
	                }
	                if (is_matched)
					{
	                    this._tiles_groups.push(matched2uid(matched_tiles));            
						if (is_any_pattern_mode)
						    return;
				    }
	            }
	        }
	    }         	            
	};
	instanceProto.pattern_search_hex = function(pattern, is_any_pattern_mode)
	{	  
        var is_matchN_mode = (typeof(pattern) == "number");   
        var dir,x,y,i,c,s,is_matched,matched_tiles=[];
	    var pattern_length=(is_matchN_mode)? pattern:pattern.length;      
	    var x_max=this.board.x_max;
	    var y_max=this.board.y_max;       
        var cur_x,cur_y,next_x,next_y;
        for(dir=0;dir<3;dir++)  // dir = 0,1,2
        {
	        for(x=0;x<=x_max;x++)
	        {
	            for(y=0;y<=y_max;y++)
	            {
	                is_matched = true;
	                matched_tiles.length=0;
                    if (is_matchN_mode)
                        pattern = null;                    
	                cur_x = x;
	                cur_y = y;
	                for(i=0;i<pattern_length;i++)
	                {	                                        
	                    s = this._symbol_at(cur_x,cur_y);
	                    if ((s==null) || (s.symbol == ""))
	                    {
	                        is_matched = false;
	                        break;
	                    }
                        else if (is_matchN_mode && (pattern==null))
                        {
                            pattern = s.symbol.repeat(pattern_length);
                        }                          
	                    c = pattern.charAt(i);
	                    if (s.symbol!=c)
	                    {
	                        is_matched = false;
	                        break;
	                    }
                        matched_tiles.push(s);                        
                        next_x = this.board.layout.GetNeighborLX(cur_x,cur_y,dir);
	                    next_y = this.board.layout.GetNeighborLY(cur_x,cur_y,dir);
	                    cur_x = next_x;
	                    cur_y = next_y;
	                }
	                if (is_matched)
					{
	                    this._tiles_groups.push(matched2uid(matched_tiles)); 
						if (is_any_pattern_mode)
						    return;						
				    }
	            }
	        }
        }        
	};
	
	var _fill_2d_template_pattern = function (template_pattern, symbol)
	{
	    var i,icnt=template_pattern.length;
	    var j,jcnt;
	    for (i=0; i<icnt; i++)
	    {
	        jcnt = template_pattern[i].length;
	        for (j=0; j<jcnt; j++)
	        {
	            if (template_pattern[i][j] != "")
	                template_pattern[i][j] = symbol;
	        }
	    }
	};
	
	instanceProto.pattern_search_2d = function(pattern, is_template_mode, is_any_pattern_mode)
	{
        pattern = csv2array(pattern);
        this._tiles_groups.length = 0;
        var x,y,i,j,c,s,is_matched,matched_tiles=[];
	    var x_max=this.board.x_max;
	    var y_max=this.board.y_max;
        var pattern_row=pattern.length,pattern_col;
        var is_template_pattern;
	    for(y=0;y<=y_max;y++)
	    {
	        for(x=0;x<=x_max;x++)
	        {
	            is_matched = true;
	            matched_tiles.length=0;
	            if (is_template_mode)
	                is_template_pattern = true;

	            for(i=0;i<pattern_row;i++)
	            {
	                pattern_col = pattern[i].length;
	                for(j=0;j<pattern_col;j++)
	                {
	                    s = this._symbol_at(x+j,y+i);
	                    if (s==null)
	                    {
	                        is_matched = false;
	                        break;
	                    }
	                    	                   
	                    c = pattern[i][j];
	                    if (c=="")
	                    {
	                        continue;
	                    }
	                    else if (is_template_pattern)
	                    {
	                        _fill_2d_template_pattern(pattern, s.symbol);
	                        is_template_pattern = false;	                        
	                    }
	                    else if (s.symbol!=c)
	                    {
	                        is_matched = false;
	                        break;
	                    }
	                      
	                    matched_tiles.push(s);
	                }
	                if (!is_matched)
	                    break;
	            }
	            
	            if (is_matched)     
                {				
	                this._tiles_groups.push(matched2uid(matched_tiles));   
					if (is_any_pattern_mode)
						    return this._tiles_groups;	
			    }
	        }
	    }      
        return this._tiles_groups;
	};
	
	instanceProto.on_match_pattern = function (tiles_groups)
	{       
        var i,cnt=tiles_groups.length;
        var runtime = this.runtime;
        var current_event = runtime.getCurrentEventStack().current_event;
        var _group=this.group.GetGroup(this._group_name)
        for (i=0;i<cnt;i++)
        {              
            _group.SetByUIDList(tiles_groups[i]);            
            runtime.pushCopySol(current_event.solModifiers);
            current_event.retrigger();
            runtime.popSol(current_event.solModifiers);        
        }
        this._has_matched_pattern |= (cnt>0);
	};	
	
	var matched2uid = function(matched_tiles)
	{
	    var cnt=matched_tiles.length;
	    var matched_uid=[];
	    var i;  	    
	    for(i=0;i<cnt;i++)
	    {
	        matched_tiles[i].dirty = true;
	        matched_uid.push(matched_tiles[i].uid);
	    }
	    return matched_uid;
	};	
	
	var csv2array = function(csv_string)
	{
        var arr = csv_string.split("\n");
        var i,arr_cnt=arr.length;
        for (i=0;i<arr_cnt;i++)
            arr[i]=arr[i].split(",");	
        return arr;    
	};
	
	instanceProto.is_tick_changed = function ()
	{       
	    var cur_tick = this.runtime.tickcount;
		var tick_changed = (this._last_tick != cur_tick);
        this._last_tick = cur_tick;
		return tick_changed;
	};
	
	instanceProto.saveToJSON = function ()
	{    
		return { "boarduid": (this.board != null)? this.board.uid:(-1),
		         "groupuid": (this.group != null)? this.group.uid:(-1),
		         "sm": this._square_modes};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	    this.boardUid = o["boarduid"];
		this.groupUid = o["groupuid"];	
		this._square_modes = o["sm"];
		this._last_tick = null;  	 		      
	};
	
	instanceProto.afterLoad = function ()
	{
		if (this.boardUid === -1)
			this.board = null;
		else
		{
			this.board = this.runtime.getObjectByUID(this.boardUid);
			assert2(this.board, "Matcher: Failed to find board object by UID");
		}		
		this.boardUid = -1;
		
		if (this.groupUid === -1)
			this.group = null;
		else
		{
			this.group = this.runtime.getObjectByUID(this.groupUid);
			assert2(this.group, "Matcher: Failed to find instance group object by UID");
		}		
		this.groupUid = -1;						
	};	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();    

	Cnds.prototype.OnGetSymbol = function ()
	{
        return true;
	};
	
	Cnds.prototype.OnMatchPattern = function (pattern)
	{       
        var tiles_groups = this.pattern_search(pattern, false);	    
        this.on_match_pattern(tiles_groups);
        return false;
	};
	
	Cnds.prototype.OnNoMatchPattern = function ()
	{
        return true;
	};
	
	Cnds.prototype.OnMatchPattern2D = function (pattern)
	{       
        var tiles_groups = this.pattern_search_2d(pattern, false, false);	    
        this.on_match_pattern(tiles_groups);
        return false;
	};
	
	Cnds.prototype.OnMatchTemplatePattern2D = function (pattern)
	{
        var tiles_groups = this.pattern_search_2d(pattern, true, false);	    
        this.on_match_pattern(tiles_groups);
        return false;
	};	
	
	Cnds.prototype.HasNoMatchPattern = function ()
	{
        return (!this._has_matched_pattern);
	};	
	// any
	Cnds.prototype.AnyMatchPattern = function (pattern)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();
	    var tiles_groups = this.pattern_search(pattern, true);
        return (tiles_groups.length != 0);
	};	
	
	Cnds.prototype.AnyMatchPattern2D = function (pattern)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();
	    var tiles_groups = this.pattern_search_2d(pattern, false, true);
        return (tiles_groups.length != 0);
	};		
	
	Cnds.prototype.AnyMatchTemplatePattern2D = function (pattern)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();		
	    var tiles_groups = this.pattern_search_2d(pattern, true, true);
        return (tiles_groups.length != 0);
	};	
	// for each
	Cnds.prototype.ForEachMatchPattern = function (pattern, group_name)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();
	    var tiles_groups = this.pattern_search(pattern, false);
	    this._has_matched_pattern = (tiles_groups.length != 0);
	    this._group_name = group_name;
	    this.on_match_pattern(tiles_groups);
        return false;
	};	
	
	Cnds.prototype.ForEachMatchPattern2D = function (pattern, group_name)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();
	    var tiles_groups = this.pattern_search_2d(pattern, false, false);
	    this._has_matched_pattern = (tiles_groups.length != 0);
	    this._group_name = group_name;
	    this.on_match_pattern(tiles_groups);
        return false;
	};		
	
	Cnds.prototype.ForEachMatchTemplatePattern2D = function (pattern, group_name)
	{
	    if (this.is_tick_changed())
		    this.refilled_symbol_array();		
	    var tiles_groups = this.pattern_search_2d(pattern, true, false);
	    this._has_matched_pattern = (tiles_groups.length != 0);
	    this._group_name = group_name;
	    this.on_match_pattern(tiles_groups);
        return false;
	};			
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
    
    Acts.prototype.Setup = function (board_objs, group_objs)
	{
        var board = board_objs.instances[0];
        if (board.check_name == "BOARD")
            this.board = board;
        else
            alert ("Matcher should connect to a board object");
            
        var group = group_objs.instances[0];
        if (group.check_name == "INSTGROUP")
            this.group = group;        
        else
            alert ("Matcher should connect to a instance group object");            
	};  
	Acts.prototype.GetMatchTiles = function (group_name)	
	{
        assert2(this.board, "Matcher should connect to a board object");
        this.get_match_tiles(group_name,1);
	};
    Acts.prototype.SetSymbol = function (symbol_value)
	{
        this._symbol_value = symbol_value;
	};
	Acts.prototype.GetMatchTiles2D = function (group_name)	
	{
        assert2(this.board, "Matcher should connect to a board object");
        this.get_match_tiles(group_name,2);
	};
	Acts.prototype.ForceUpdaeSymbolArray = function ()	
	{
        this.refilled_symbol_array();
	};	
		
	Acts.prototype.SetHorizontalAxisEnable = function (enable)	
	{
        this._square_modes[0] = (enable==1);
	};		
	Acts.prototype.SetVerticalAxisEnable = function (enable)	
	{
        this._square_modes[1] = (enable==1);
	};	     
	Acts.prototype.SetIsometricAxisEnable = function (enable)	
	{	     
        this._square_modes[2] = (enable==1);
        this._square_modes[3] = (enable==1);        
	};	 	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
    Exps.prototype.TileUID = function (ret)
    {
        ret.set_int(this.exp_TileUID);
    };
	
    Exps.prototype.TileX = function (ret)
    {
        ret.set_int(this.exp_TileX);
    };
    	
    Exps.prototype.TileY = function (ret)
    {
        ret.set_int(this.exp_TileY);
    };
}());