// --------------------
// Sequelize definer
// Utility functions
// --------------------

// modules
var _ = require('lodash');

// exports
var utils = module.exports = {
	// acts on object, inserts key/value pair at position specified by index (integer)
	objectSplice: function(obj, key, value, index) {
		// extract values after index position
		var temp = {};
		if (index === undefined) index = 0;

		var i = 0;
		for (var thisKey in obj) {
			if (i >= index) {
				temp[thisKey] = obj[thisKey];
				delete obj[thisKey];
			}
			i++;
		}

		// insert new key/value
		obj[key] = value;

		// return values back to obj
		for (thisKey in temp) {
			obj[thisKey] = temp[thisKey];
		}

		// done
		return obj;
	},

	// acts on object, inserts key/value pair at 1st position
	unshift: function(obj, key, value) {
		return utils.objectSplice(obj, key, value, 0);
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

	// string format conversion from camelCase or underscored format to human-readable format
	// e.g. 'fooBar' -> 'Foo Bar', 'foo_bar' -> 'Foo Bar'
	humanize: function(str) {
		if (str === null || str === undefined || str == '') return '';
		str = ('' + str).replace(/[-_\s]+(.)?/g, function(match, c) {return c ? c.toUpperCase() : '';});
		return str.slice(0, 1).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
	},

	uppercaseFirst: function(str) {
		return str.slice(0, 1).toUpperCase() + str.slice(1);
	},

	lowercaseFirst: function(str) {
		return str.slice(0, 1).toLowerCase() + str.slice(1);
	},

	// if value is function, run it with arguments and return result, otherwise return input
	functionValue: function(val) {
		if (!_.isFunction(val)) return val;

		var args = Array.prototype.slice.call(arguments, 1);
		return val.apply(null, args);
	}
};
