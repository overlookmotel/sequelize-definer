// --------------------
// utility functions
// --------------------

// exports
module.exports = function(Sequelize) {
	var Utils = Sequelize.Utils,
		_ = Utils._;
	
	return {
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
	
		// string format conversion
		camelToHuman: function(str) {
			return s[0].toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1');
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
};
