﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_Function2 = function(runtime)
{
    this.runtime = runtime;
};

(function ()
{
    var pluginProto = cr.plugins_.Rex_Function2.prototype;
        
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
    
    var funcStack = [];
    var funcStackPtr = -1;
    var isInPreview = false;	// set in onCreate
    
    function FuncStackEntry()
    {
        this.name = "";
        this.retVal = 0;
        this.params = [];
        this.parameter_tables = {};
        this.name2index = {};
        this.name2value = {};  
    };
    
    function pushFuncStack()
    {
        funcStackPtr++;
        
        if (funcStackPtr === funcStack.length)
            funcStack.push(new FuncStackEntry());
            
        return funcStack[funcStackPtr];
    };
    
    function getCurrentFuncStack()
    {
        if (funcStackPtr < 0)
            return null;
            
        return funcStack[funcStackPtr];
    };
    
    function getOneAboveFuncStack()
    {
        if (!funcStack.length)
            return null;
        
        var i = funcStackPtr + 1;
        
        if (i >= funcStack.length)
            i = funcStack.length - 1;
            
        return funcStack[i];
    };
    
    function popFuncStack()
    {
        assert2(funcStackPtr >= 0, "Popping empty function stack");
        
        funcStackPtr--;
    };

    instanceProto.onCreate = function()
    {
        isInPreview = (typeof cr_is_preview !== "undefined");
        
        this.is_debug_mode = (typeof(log) !== "undefined") && (this.properties[0] == 1);
        
        var fs = pushFuncStack();
        fs.name = "__main__";
                
        this.parameter_table_cache = new ObjCacheKlass();        
        this.param_index = 0;
    };
    
    instanceProto.function_call_prelude = function()
    {
        this.param_index = 0;
    };
    
    instanceProto.function_call_finale = function()
    {
        var fs = getCurrentFuncStack();
        hashtable_clean(fs.name2value);
        hashtable_clean(fs.name2index);        
    };
    
    instanceProto.define_param = function (name, default_value)
    {
        var fs = getCurrentFuncStack();
        
        if (!fs)
            return false;
        
        fs.name2index[name] = this.param_index;
        if (this.param_index >= fs.params.length)
        {
            fs.params.length = this.param_index + 1;
            var value = fs.name2value[name];
            if (value == null)
                value = default_value;
            fs.params[this.param_index] = value;
        }
        this.param_index += 1;
        return true;
    };     
    
    instanceProto.param_get = function (param_index_)
    {
        var fs = getCurrentFuncStack();
        if (!fs)
        {
            log("[Construct 2] Rex_Function2 object: used 'Param' expression when not in a function call", "warn");
            return null;
        }
        
        var index_;
        if (typeof(param_index_) == "string")
        {
            index_ = fs.name2index[param_index_];
            if (index_ == null)
            {
                log("[Construct 2] Rex_Function2 object: in function '" + fs.name + "', could not find parameter " + param_index_ , "warn");
                return null;
            }
        }
        else
            index_ = cr.floor(param_index_);
            
        if (index_ >= 0 && index_ < fs.params.length)
        {
            var value = fs.params[index_];
            if (value == null)
            {
                // warn 
                value = 0;
            }
            return value;
        }
        else
        {
            log("[Construct 2] Rex_Function2 object: in function '" + fs.name + "', accessed parameter out of bounds (accessed index " + index_ + ", " + fs.params.length + " params available)", "warn");
            return null;      
        }
        
    };    
    
    var hashtable_clean = function(table)
    {
        var n;
        for(n in table)
            delete table[n];
    }
    
    var ObjCacheKlass = function ()
    {        
        this.lines = [];       
    };
    var ObjCacheKlassProto = ObjCacheKlass.prototype;   
    
	ObjCacheKlassProto.allocLine = function()
	{
		return (this.lines.length > 0)? this.lines.pop(): {};
	};
	ObjCacheKlassProto.freeLine = function (l)
	{
		this.lines.push(l);
	};	   
     
    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    // THIS IS A SPECIAL TRIGGER
    Cnds.prototype.OnFunction = function (name_)
    {                
        var fs = getCurrentFuncStack();
        
        if (!fs)
            return false;
        
        return cr.equals_nocase(name_, fs.name);
    };
    
    Cnds.prototype.CompareParam = function (param_index_, cmp_, value_)
    {
        var param_value = this.param_get(param_index_);
        if (param_value == null)
            return false;
        return cr.do_cmp(param_value, cmp_, value_);
    };
    
    Cnds.prototype.TypeOfParam = function (param_index_, type_cmp)
    {        
        var param_value = this.param_get(param_index_);
        if (param_value == null)
            return false;
            
        var t = (type_cmp == 0)? "number":"string";        
        return (typeof(param_value) == t);
    };    
    
    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};

    Acts.prototype.CallFunction = function (name_, params_)
    {
        var fs = pushFuncStack();
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        cr.shallowAssignArray(fs.params, params_);
        
        if (this.is_debug_mode)
        {
            var i, lead = "+";
            for(i=1; i<funcStackPtr; i++)
                lead += "-";             
            log(lead + fs.name + " : " + fs.params.toString());
        }      
        this.function_call_prelude();
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Rex_Function2.prototype.cnds.OnFunction, this, fs.name);
        this.function_call_finale();
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] Rex_Function2 object: called function '" + name_ + "', but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack();
    };
    
    Acts.prototype.SetReturnValue = function (value_)
    {
        var fs = getCurrentFuncStack();
        
        if (fs)
            fs.retVal = value_;
        else
            log("[Construct 2] Rex_Function2 object: used 'Set return value' when not in a function call", "warn");
    };
    
    Acts.prototype.SetParameter = function (name_, value_, table)
    {
        var fs = getCurrentFuncStack();
        
        var pt = fs.parameter_tables;
        if (!pt.hasOwnProperty(table))
            pt[table] = this.parameter_table_cache.allocLine();
        
        pt[table][name_] = value_;
    };
    
    Acts.prototype.DefineParam = function (name, default_value)
    {
        this.define_param(name, default_value);
    }; 
    
    Acts.prototype.Dump = function ()
    {
        if (!this.is_debug_mode)
            return;

        var fs = getCurrentFuncStack();          
        log("Dump - " + fs.name + ":" +fs.params.toString());
    };    
    
    Acts.prototype.CallFunctionwPT = function (name_, tale_)
    {
        var pt = getCurrentFuncStack().parameter_tables[tale_];
        
        var fs = pushFuncStack();
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        fs.params.length = 0;

        if (pt != null)
        {
            var n;
            for (n in pt)            
                fs.name2value[n] = pt[n];   
            
            hashtable_clean(pt);
        }

        if (this.is_debug_mode)
        {
            var str_name2value = "";
            for(n in fs.name2value)
                str_name2value += (n + "=" + fs.name2value[n]+ ", ");
            var i, lead = "+";
            for(i=1; i<funcStackPtr; i++)
                lead += "-";  
            log(lead+ fs.name + " : " + str_name2value);
        }                   
        this.function_call_prelude();
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Rex_Function2.prototype.cnds.OnFunction, this, fs.name);
        this.function_call_finale();
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] Rex_Function2 object: called function '" + name_ + "', but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack();
    };
    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};

    Exps.prototype.ReturnValue = function (ret)
    {
        // The previous function has already popped - so check one level up the function stack
        var fs = getOneAboveFuncStack();
        
        if (fs)
            ret.set_any(fs.retVal);
        else
            ret.set_int(0);
    };
    
    Exps.prototype.ParamCount = function (ret)
    {
        var fs = getCurrentFuncStack();
        
        if (fs)
            ret.set_int(fs.params.length);
        else
        {
            log("[Construct 2] Rex_Function2 object: used 'ParamCount' expression when not in a function call", "warn");
            ret.set_int(0);
        }
    };
    
    Exps.prototype.Param = function (ret, param_index_)
    {
        ret.set_any(this.param_get(param_index_));
    };
    
    Exps.prototype.Call = function (ret, name_)
    {
        var fs = pushFuncStack();
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        
        // Copy rest of parameters from arguments
        fs.params.length = 0;
        var i, len;
        for (i = 2, len = arguments.length; i < len; i++)
            fs.params.push(arguments[i]);
        
        if (this.is_debug_mode)
        {
            var i, lead = "+";
            for(i=1; i<funcStackPtr; i++)
                lead += "-";                 
            log(lead+ fs.name + " : " + fs.params.toString());
        }        
        this.function_call_prelude();       
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Rex_Function2.prototype.cnds.OnFunction, this, fs.name);
        this.function_call_finale();
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] Rex_Function2 object: expression Rex_Function2.Call('" + name_ + "' ...) was used, but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack();

        ret.set_any(fs.retVal);
    };
    
    Exps.prototype.CallwPT = function (ret, name_)
    {
        var fs = pushFuncStack();
        fs.name = name_.toLowerCase();
        fs.retVal = 0;
        
        // Copy rest of parameters from arguments
        fs.params.length = 0;
        var i, len=arguments.length;
        for (i = 2; i < len; i=i+2)
            fs.name2value[arguments[i]] = arguments[i+1];        
        
        if (this.is_debug_mode)
        {
            var str_name2value = "";
            for(n in fs.name2value)
                str_name2value += (n + "=" + fs.name2value[n]+ ", ");
            var i, lead = "+";
            for(i=1; i<funcStackPtr; i++)
                lead += "-";  
            log(lead+ fs.name + " : " + str_name2value);
        }
        this.function_call_prelude(); 
        // Note: executing fast trigger path based on fs.name
        var ran = this.runtime.trigger(cr.plugins_.Rex_Function2.prototype.cnds.OnFunction, this, fs.name);
        this.function_call_finale();
        
        // In preview mode, log to the console if nothing was triggered
        if (isInPreview && !ran)
        {
            log("[Construct 2] Rex_Function2 object: expression Rex_Function2.Call('" + name_ + "' ...) was used, but no event was triggered. Is the function call spelt incorrectly or no longer used?", "warn");
        }
        
        popFuncStack();

        ret.set_any(fs.retVal);
    };    
    
    pluginProto.exps = new Exps();

}());