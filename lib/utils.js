/* --------------------
 * sequelize-definer module
 * Utility functions
 * ------------------*/

'use strict';

// Modules
const _ = require('lodash');

// Exports

module.exports = {
	objectSplice,
	unshift,
	pop,
	setNoUndef,
	defaultNoUndef,
	extendNoUndef,
	defaultsNoUndef,
	humanize,
	uppercaseFirst,
	lowercaseFirst,
	functionValue
};

// Acts on object, inserts key/value pair at position specified by index (integer)
function objectSplice(obj, key, value, index) {
	// Extract values after index position
	const temp = {};
	if (index === undefined) index = 0;

	let i = 0;
	for (const thisKey in obj) {
		if (i >= index) {
			temp[thisKey] = obj[thisKey];
			delete obj[thisKey];
		}
		i++;
	}

	// Insert new key/value
	obj[key] = value;

	// Return values back to obj
	for (const thisKey in temp) {
		obj[thisKey] = temp[thisKey];
	}

	// Done
	return obj;
}

// Acts on object, inserts key/value pair at 1st position
function unshift(obj, key, value) {
	return objectSplice(obj, key, value, 0);
}

// Removes obj[key] and returns it
function pop(obj, key) {
	const value = obj[key];
	delete obj[key];
	return value;
}

// setNoUndef(obj, key [,value] [,value] [,value])
// Sets obj[key] = value, but deleting undefined values
function setNoUndef(obj, key, ...values) {
	for (const value of values) {
		if (value !== undefined) {
			obj[key] = value;
			return obj;
		}
	}

	delete obj[key];

	return obj;
}

// defaultNoUndef(obj, key [,value] [,value] [,value])
// Sets obj[key] = value if obj[key] is undefined
function defaultNoUndef(obj, key, ...values) {
	if (obj[key] === undefined) {
		for (const value of values) {
			if (value !== undefined) {
				obj[key] = value;
				break;
			}
		}
	}

	return obj;
}

// extendNoUndef: function(obj [,fromObj] [,fromObj] [,fromObj])
// Sets all keys from fromObj onto obj, deleting undefined values
function extendNoUndef(obj, ...fromObjs) {
	for (const fromObj of fromObjs) {
		_.forIn(fromObj, (value, key) => {
			if (value === undefined) {
				delete obj[key];
			} else {
				obj[key] = value;
			}
		});
	}

	return obj;
}

// defaultsNoUndef: function(obj [,fromObj] [,fromObj] [,fromObj])
// Sets all keys from fromObj onto obj where obj[key] is undefined, ignoring undefined values
function defaultsNoUndef(obj, ...fromObjs) {
	for (const fromObj of fromObjs) {
		_.forIn(fromObj, (value, key) => {
			if (obj[key] === undefined && value !== undefined) obj[key] = value;
		});
	}

	return obj;
}

// String format conversion from camelCase or underscored format to human-readable format
// e.g. 'fooBar' -> 'Foo Bar', 'foo_bar' -> 'Foo Bar'
function humanize(str) {
	if (str == null || str === '') return '';
	str = (`${str}`).replace(/[-_\s]+(.)?/g, (match, c) => (c ? c.toUpperCase() : ''));
	return str.slice(0, 1).toUpperCase() + str.slice(1).replace(/([A-Z])/g, ' $1');
}

function uppercaseFirst(str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function lowercaseFirst(str) {
	return str.slice(0, 1).toLowerCase() + str.slice(1);
}

// If value is function, run it with arguments and return result, otherwise return input
function functionValue(val, ...args) {
	if (!_.isFunction(val)) return val;
	return val(...args);
}
