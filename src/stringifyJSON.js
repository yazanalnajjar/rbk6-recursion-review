// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:


var isObject = function(object) {
  return Object.prototype.toString.call(object) === '[object Object]';
};

var stringifyArray = function(object) {
  return '[' + _(object).map(function(item, index) {
    return stringifyJSON(item);
  }).join(',') + ']';
};

var stringifyObject = function(object) {
  var strings = [];

  _.each(object, function(item, key) {
    if (_.isUndefined(item) || _.isFunction(item)) {
      return;
    }

    strings.push(stringifyJSON(key) + ':' + stringifyJSON(item));
  });

  return '{' + strings.join(',') + '}';
};

var stringifyJSON = function(obj) {
  // your code goes here

  if (Array.isArray(obj)) {
    return stringifyArray(obj);
  } else if (isObject(obj)) {
    return stringifyObject(obj);
  } else if (typeof obj === 'string') {
    return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  } else {
    return obj + '';
  }
  };