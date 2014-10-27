// --------------------
// utility functions
// --------------------

// modules
var _ = require('lodash');

// exports
var utils = module.exports = {
	// acts on object, inserts key/value pair at 1st position
	unshift: function(obj, key, value) {
		var temp = {};
		
		for (var thisKey in obj) {
			temp[thisKey] = obj[thisKey];
			delete obj[thisKey];
		}
		
		obj[key] = value;
		
		for (var thisKey in temp) {
			obj[thisKey] = temp[thisKey];
		}
		
		return obj;
	},
	
	// removes obj[key] and returns it
	pop: function(obj, key) {
		var value = obj[key];
		delete obj[key];
		return value;
	},
	
	// setNoUndef(obj, key [,value] [,value] [,value])
	// sets obj[key] = value, but deleting undefined values
	setNoUndef: function(obj, key) {
		var value;
		for (var i = 2; i < arguments.length; i++) {
			value = arguments[i];
			if (value !== undefined) {
				obj[key] = value;
				break;
			}
		}
		
		if (value === undefined) delete obj[key];
		
		return obj;
	},
	
	// defaultNoUndef(obj, key [,value] [,value] [,value])
	// sets obj[key] = value if obj[key] is undefined
	defaultNoUndef: function(obj, key) {
		if (obj[key] !== undefined) return obj;
		
		var value;
		for (var i = 2; i < arguments.length; i++) {
			value = arguments[i];
			if (value !== undefined) {
				obj[key] = value;
				break;
			}
		}
		
		return obj;
	},
	
	// extendNoUndef: function(obj [,fromObj] [,fromObj] [,fromObj])
	// sets all keys from fromObj onto obj, deleting undefined values
	extendNoUndef: function(obj) {
		var fromObj;
		for (var i = 1; i < arguments.length; i++) {
			fromObj = arguments[i];
			_.forIn(fromObj, function(value, key) {
				if (value === undefined) {
					delete obj[key];
				} else {
					obj[key] = value;
				}
			});
		}
		
		return obj;
	},
	
	// defaultsNoUndef: function(obj [,fromObj] [,fromObj] [,fromObj])
	// sets all keys from fromObj onto obj where obj[key] is undefined, ignoring undefined values
	defaultsNoUndef: function(obj) {
		var fromObj;
		for (var i = 1; i < arguments.length; i++) {
			fromObj = arguments[i];
			_.forIn(fromObj, function(value, key) {
				if (obj[key] === undefined && value !== undefined) obj[key] = value;
			});
		}
		
		return obj;
	},
	
	// string format conversion
	camelToHuman: function(str) {
		return str[0].toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
	},
	
	// checks if str ends with needle
	endsWith: function(str, needle) {
		return str.slice(str.length - needle.length) == needle;
	},
	
	// if value is function, run it with arguments and return result, otherwise return input
	functionValue: function(val) {
		if (!_.isFunction(val)) return val;
		
		var args = Array.prototype.slice.call(arguments, 1);
		return val.apply(args);
	}
};
