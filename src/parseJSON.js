// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here


  // The index of the current character
  var index = 0;

  // The current character
  var ch = ' ';
  var escapee = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
  };

  // Move to the next character and check that it is what we expect
  var nextCh = function(c) {
    // If ch is not what we expect, error
    if (c && c !== ch) {
      throw new SyntaxError('Expected "' + c + '" instead of "' + ch + '"');
    }

    ch = json.charAt(index);
    index += 1;

    return ch;
  };

  var numberParse = function() {
    var number;
    var string = '';

    if (ch === '-') {
      string = '-';
      nextCh('-');
    }
    while (ch >= '0' && ch <= '9') {
      string += ch;
      nextCh();
    }
    if (ch === '.') {
      string += ch;
      while (nextCh() && ch >= '0' && ch <= '9') {
        string += ch;
      }
    }

    // Scientific notation
    if (ch === 'e' || ch === 'E') {
      string += ch;
      nextCh();
      if (ch === '-' || ch === '+') {
        string += ch;
        nextCh();
      }
      while (ch >= '0' && ch <= '9') {
        string += ch;
        nextCh();
      }
    }

    number = parseFloat(string, 10);

    // Check that number is valid
    if (!isFinite(number)) {
      throw new SyntaxError('Bad number');
    } else {
      return number;
    }
  };

  var stringParse = function() {
    var hex, i, unicodeValue;
    var string = '';

    if (ch === '"') {
      while (nextCh()) {
        if (ch === '"') {
          nextCh();
          return string;
        }

        // Parse escaped characters
        if (ch === '\\') {
          nextCh();
          if (ch === 'u') {
            unicodeValue = 0;
            for (i = 0; i < 4; i += 1) {
              hex = parseInt(next(), 16);
              if (!isFinite(hex)) {
                break;
              }
              unicodeValue = unicodeValue * 16 + hex;
            }
            string += String.fromCharCode(unicodeValue);
          } else if (typeof escapee[ch] === 'string') {
            string += escapee[ch];
          } else {
            break;
          }
        } else {
          string += ch;
        }
      }
    }
    throw new SyntaxError('Bad string');
  };

  // Remove whitespace between characters
  var compressWhitespace = function() {
    while (ch && ch <= ' ') {
      nextCh();
    }
  };

  var booleanParse = function() {
    switch (ch) {
    case 't':
      nextCh('t');
      nextCh('r');
      nextCh('u');
      nextCh('e');
      return true;
    case 'f':
      nextCh('f');
      nextCh('a');
      nextCh('l');
      nextCh('s');
      nextCh('e');
      return false;
    case 'n':
      nextCh('n');
      nextCh('u');
      nextCh('l');
      nextCh('l');
      return null;
    }
    throw new SyntaxError('Unexpected "' + ch + '"');
  };

  var arrayParse = function() {
    var array = [];

    if (ch === '[') {
      nextCh('[');
      compressWhitespace();
      if (ch === ']') {
        nextCh(']');
        // Array is empty
        return array;
      }
      while (ch) {
        array.push(initiateParse());
        compressWhitespace();
        if (ch === ']') {
          nextCh(']');
          return array;
        }
        nextCh(',');
        compressWhitespace();
      }
    }
    throw new SyntaxError('Bad array');
  };

  var objectParse = function() {
    var key;
    var object = {};

    if (ch === '{') {
      nextCh('{');
      compressWhitespace();
      if (ch === '}') {
        nextCh('}');
        // Object is empty
        return object;
      }
      while (ch) {
        key = stringParse();
        compressWhitespace();
        nextCh(':');
        if (Object.hasOwnProperty.call(object, key)) {
          throw new SyntaxError('Duplicate key "' + key + '"');
        }
        object[key] = initiateParse();
        compressWhitespace();
        if (ch === '}') {
          nextCh('}');
          return object;
        }
        nextCh(',');
        compressWhitespace();
      }
    }
    throw new SyntaxError('Bad object');
  };

  // Initiate parsing of JSON string
  var initiateParse = function() {
    compressWhitespace();
    switch (ch) {
    case '{':
      return objectParse();
    case '[':
      return arrayParse();
    case '"':
      return stringParse();
    case '-':
      return numberParse();
    default:
      return ch >= '0' && ch <= '9' ? numberParse() : booleanParse();
    }
  };

  var result = initiateParse();
  compressWhitespace();
  if (ch) {
    throw new SyntaxError('Syntax error');
  }

  return result;
  };
