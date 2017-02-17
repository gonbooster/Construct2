﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_SLGHexTx = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_SLGHexTx.prototype;
		
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
        this.check_name = "LAYOUT";
        this.SetPOX(this.properties[0]);
        this.SetPOY(this.properties[1]);
        this.SetWidth(this.properties[2]);
        this.SetHeight(this.properties[3]);
        this.is_up2down = (this.properties[4]==1);
	};
	instanceProto.SetPOX = function(pox)
	{
        this.PositionOX = pox;       
	}; 
	instanceProto.SetPOY = function(poy)
	{
        this.PositionOY = poy;
	};   
	instanceProto.GetPOX = function()
	{
        return this.PositionOX;       
	}; 
	instanceProto.GetPOY = function()
	{
        return this.PositionOY;
	}; 	
	instanceProto.SetWidth = function(width)
	{
        this.width = width;
        this.half_width = width/2;        
	};
	instanceProto.SetHeight = function(height)
	{
        this.height = height; 
        this.half_height = height/2;
	};   
	instanceProto.LXYZ2PX = function(logic_x, logic_y, logic_z)
	{
	    var px;
	    if (this.is_up2down)
	        px = (logic_x*this.width)+this.PositionOX;
	    else
	        px = (logic_x*this.width)+((logic_y%2)*this.half_width)+this.PositionOX;
        return px;
	};
	instanceProto.LXYZ2PY = function(logic_x, logic_y, logic_z)
	{
	    var py;
	    if (this.is_up2down)
	        py = (logic_y*this.height)+((logic_x%2)*this.half_height)+this.PositionOY;
	    else
	        py = (logic_y*this.height)+this.PositionOY;
        return py;
	};   
	instanceProto.PXY2LX = function(physical_x,physical_y)
	{
	    var lx;
	    if (this.is_up2down)
	        lx = Math.round((physical_x-this.PositionOX)/this.width);
	    else
	    {
	        var ly = this.PXY2LY(physical_x,physical_y);
		    lx = Math.round((physical_x - this.PositionOX - ((ly%2)*this.half_width))/this.width);
	    }	    
		return lx;
	};
	instanceProto.PXY2LY = function(physical_x,physical_y)
	{
	    var ly;
	    if (this.is_up2down)
	    {
	        var lx = this.PXY2LX(physical_y,physical_x);
		    ly = Math.round((physical_y - this.PositionOY - ((lx%2)*this.half_height))/this.height); 
	    }
	    else
	        ly = Math.round((physical_y-this.PositionOY)/this.height);
	    return ly;
	};	
	instanceProto.CreateItem = function(obj_type,x,y,z,layer)
	{	
        return this.runtime.createInstance(obj_type, layer,this.LXYZ2PX(x,y,z),this.LXYZ2PY(x,y,z) );        
	}; 	
	instanceProto.GetNeighborLX = function(x, y, dir)
	{
	    var dx;
	    if (this.is_up2down)
	    {
	        dx = ((dir==0) || (dir==5))? 1:
			     ((dir==2) || (dir==3))? (-1):
                                         0;  
	    }
	    else
	    {
	        if ((y%2) == 1)
		    {
		        dx = ((dir==0) || (dir==1) || (dir==5))? 1:
		    	     (dir==3)?                          (-1):
                                                       0;
            }												  
            else
		    {
		        dx = ((dir==2) || (dir==3) || (dir==4))? (-1):
		    	     (dir==0)?                           1:
                                                         0;
            }
	    }	   
		return (x+dx);
	};
	instanceProto.GetNeighborLY = function(x, y, dir)
	{
	    var dy;
	    if (this.is_up2down)
	    {
	        if ((x%2) == 1)
		    {
		        dy = ((dir==0) || (dir==1) || (dir==2))? 1:
		    	     (dir==4)?                          (-1):
                                                       0;
            }												  
            else
		    {
		        dy = ((dir==3) || (dir==4) || (dir==5))? (-1):
		    	     (dir==1)?                           1:
                                                         0;
            }	        
	    }
		else
		{
		    dy = ((dir==1) || (dir==2))? 1:
			     ((dir==4) || (dir==5))? (-1):
                                         0;
		}          
        return (y+dy);						 
	};	
	instanceProto.GetDirCount = function()
	{  
        return 6;						 
	};
	
	var dxy2dir = function (dx, dy, x, y, is_up2down)
	{
	    var dir;
	    if (is_up2down)
	    {
	        if ((x%2) == 1)
	        {
	            dir = ((dx==1) && (dy==1))?   0:
                      ((dx==0) && (dy==1))?   1:
	                  ((dx==-1) && (dy==1))?  2:
                      ((dx==-1) && (dy==0))?  3:
	                  ((dx==0) && (dy==-1))?  4: 
	                  ((dx==1) && (dy==0))?   5:
	                  null;  //fixme
	        }		 
	        else
	        {
	            dir = ((dx==1) && (dy==0))?   0:
                      ((dx==0) && (dy==1))?   1:
	                  ((dx==-1) && (dy==0))?  2:
                      ((dx==-1) && (dy==-1))? 3:
	                  ((dx==0) && (dy==-1))?  4:
	                  ((dx==1) && (dy==-1))?  5: 
	                  null;	 //fixme
	        }
	    }
	    else
	    {
	        if ((y%2) == 1)
	        {
	            dir = ((dx==1) && (dy==0))?   0:
	                  ((dx==1) && (dy==1))?   1:
                      ((dx==0) && (dy==1))?   2:
	                  ((dx==-1) && (dy==0))?  3:
                      ((dx==0) && (dy==-1))?  4:
	                  ((dx==1) && (dy==-1))?  5: 
	                  null;  //fixme
	        }		 
	        else
	        {
	            dir = ((dx==1) && (dy==0))?   0:
	                  ((dx==0) && (dy==1))?   1:
                      ((dx==-1) && (dy==1))?  2:
	                  ((dx==-1) && (dy==0))?  3:
                      ((dx==-1) && (dy==-1))? 4:
	                  ((dx==0) && (dy==-1))?  5: 
	                  null;	 //fixme
	        }     
	    }	
	};
	instanceProto.XYZ2LA = function(xyz_o, xyz_to)
	{  
	    var dx = xyz_to.x - xyz_o.x;
	    var dy = xyz_to.y - xyz_o.y;	    
	    var vmax = Math.max(Math.abs(dx), Math.abs(dy));
	    if (vmax != 0)
	    {
	        dx = dx/vmax;
	        dy = dy/vmax;
	    }

	    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y, this.is_up2down); 
	    var angle;	    
	    if (this.is_up2down)
	    {
	        angle = (dir != null)? ((dir*60)+30):
	                               (-1);
	    }
	    else
	    {
	        angle = (dir != null)? dir*60:
	                               (-1);
	    }
        return angle;				 
	};
	instanceProto.XYZ2Dir = function(xyz_o, xyz_to)
	{  
	    var dx = xyz_to.x - xyz_o.x;
	    var dy = xyz_to.y - xyz_o.y;	    
	    var vmax = Math.max(Math.abs(dx), Math.abs(dy));
	    if (vmax != 0)
	    {
	        dx = dx/vmax;
	        dy = dy/vmax;
	    }
	    
	    var dir = dxy2dir(dx, dy, xyz_o.x, xyz_o.y, this.is_up2down);  
	    return dir;
	};		
	
	instanceProto.saveToJSON = function ()
	{
		return { "w": this.width,
                 "h": this.height,
                 "ox": this.PositionOX,
                 "oy": this.PositionOY};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
        this.SetWidth(o["w"]);
        this.SetHeight(o["h"]);   
        this.SetPOX(o["ox"]);
        this.SetPOY(o["oy"]);          
	};	    
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();      
    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
	
    Acts.prototype.SetCellSize = function (width, height)
    {        
        this.SetWidth(width);
        this.SetHeight(height);
	};
    Acts.prototype.SetOffset = function (x, y)
    {        
        this.SetPOX(x);
        this.SetPOY(y);
	}; 
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
	
	Exps.prototype.Width = function (ret)
	{
	    ret.set_float(this.width);
	};
	Exps.prototype.Height = function (ret)
    {
	    ret.set_float(this.height);
	};
	Exps.prototype.POX = function (ret)
	{
	    ret.set_float(this.PositionOX);
	};
	Exps.prototype.POY = function (ret)
    {
	    ret.set_float(this.PositionOY);
	};	
}());