'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = _interopDefault(require('crypto'));
var axios = _interopDefault(require('axios'));
var events = _interopDefault(require('events'));
var extend = _interopDefault(require('extend'));
var fs = _interopDefault(require('fs'));
var request = _interopDefault(require('request'));
var mime = _interopDefault(require('mime'));
var require$$0 = _interopDefault(require('buffer'));
var stream = _interopDefault(require('stream'));
var util = _interopDefault(require('util'));

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * This method is like `_.zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */
function unzip(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function(group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function(index) {
    return arrayMap(array, baseProperty(index));
  });
}

/**
 * Creates an array of grouped elements, the first of which contains the
 * first elements of the given arrays, the second of which contains the
 * second elements of the given arrays, and so on.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to process.
 * @returns {Array} Returns the new array of grouped elements.
 * @example
 *
 * _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 */
var zip = baseRest(unzip);

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

var index = zip;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed$1(_seed_) {
    seed = _seed_;
}

var randomFromSeed = {
    nextValue: getNextValue,
    seed: setSeed$1
};

var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

var alphabet_1 = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

var randomBytes = crypto.randomBytes;

function randomByte() {
    return randomBytes(1)[0] & 0x30;
}

var randomByte_1 = randomByte;

function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByte_1() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

var encode_1 = encode;

/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet_1.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

var decode_1 = decode;

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode_1(alphabet_1.lookup, version);
    str = str + encode_1(alphabet_1.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode_1(alphabet_1.lookup, counter);
    }
    str = str + encode_1(alphabet_1.lookup, seconds);

    return str;
}

var build_1 = build;

function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet_1.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

var isValid = isShortId;

var clusterWorkerId = parseInt(process.env.NODE_UNIQUE_ID || 0, 10);

var index$2 = createCommonjsModule(function (module) {
'use strict';







// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId$$1 = clusterWorkerId || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet_1.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId$$1 = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet_1.characters(newCharacters);
    }

    return alphabet_1.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build_1(clusterWorkerId$$1);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode_1;
module.exports.isValid = isValid;
});

var index$1 = index$2;

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

function parseTimestamp(time) {
  time = parseInt(time, 10);
  const timestamp = new Date(time * 1000);
  if (timestamp.toString() === "Invalid Date") {
    throw TypeError(timestamp);
  }
  return timestamp;
}

function sleep(milseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milseconds);
  });
}

function getRank(topIds, storyId) {
  const index = topIds.indexOf(storyId);
  // return null if story is not among top500
  // rationale: this value will be written to a BigQuery
  // nullable column
  return index > -1 ? index + 1 : null;
}

function computeEntryFromStoryPair(before, after) {
  const {
    story: story_begin,
    timestamp: interval_begin,
    rank: story_rank_begin
  } = before;
  const {
    story: story_end,
    timestamp: interval_end,
    rank: story_rank_end
  } = after;
  const story_point_begin = story_begin.score;
  const story_point_delta = story_end.score - story_point_begin;
  const comment_count_begin = story_begin.descendants;
  const comment_count_delta = story_end.descendants - comment_count_begin;
  const story_createdat = story_begin.time;
  return {
    story_id: story_begin.id,
    story_createdat,
    interval_begin,
    interval_end,
    story_point_begin,
    story_point_delta,
    comment_count_begin,
    comment_count_delta,
    story_rank_begin,
    story_rank_end
  };
}

const HN_API_ROOT = "https://hacker-news.firebaseio.com";
const HN_API_VER = "v0";
const FRONT_PAGE_COUNT = 30;

function validateItemJSON(item) {
  invariant_1(item != null, "Recieved Undefined item");
  invariant_1(typeof item.id === "number", "Invalid item id");
  invariant_1(typeof item.score === "number", "Invalid item score");
  if (item.type === "story") {
    invariant_1(
      typeof item.descendants === "number",
      "Invalid item descendants count"
    );
    invariant_1(item.descendants >= 0, "Invalid item descendants count");
  }
}

class HNApiClient {
  constructor() {
    this._axios = axios.create({
      baseURL: `${HN_API_ROOT}/${HN_API_VER}`
    });
  }
  async maxitem() {
    const { data: maxitem } = this._axios.get("/maxitem.json");
    return maxitem;
  }
  async story(id) {
    const { data: item } = await this._axios.get(`item/${id}.json`);
    try {
      validateItemJSON(item);
      return Object.assign(item, {
        time: parseTimestamp(item.time)
      });
    } catch (err) {
      return Promise.reject(err);
    }
  }
  async stories(...ids) {
    const items = await Promise.all(ids.map(id => this.story(id)));
    return items.filter(s => s.type === "story");
  }
  async topitemIds() {
    // ids returned from this endpoint may contain "job" type of item
    // we are not interested in these
    const { data: topitemIds } = await this._axios.get("/topstories.json");
    return topitemIds;
  }
  async frontpageStories() {
    const topitemIds = await this.topitemIds();
    const storyIds = topitemIds.slice(0, FRONT_PAGE_COUNT);
    const stories = await this.stories(...storyIds);
    return stories.map(s =>
      Object.assign(s, { rank: getRank(topitemIds, s.id) })
    );
  }
}

var emptyModule = {};

var padString_1 = createCommonjsModule(function (module, exports) {
"use strict";
function padString(input) {
    var segmentLength = 4;
    var stringLength = input.length;
    var diff = stringLength % segmentLength;
    if (!diff) {
        return input;
    }
    var position = stringLength;
    var padLength = segmentLength - diff;
    var paddedStringLength = stringLength + padLength;
    var buffer = new Buffer(paddedStringLength);
    buffer.write(input);
    while (padLength--) {
        buffer.write("=", position++);
    }
    return buffer.toString();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = padString;
});

var base64url_1 = createCommonjsModule(function (module, exports) {
"use strict";

function encode(input, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    if (Buffer.isBuffer(input)) {
        return fromBase64(input.toString("base64"));
    }
    return fromBase64(new Buffer(input, encoding).toString("base64"));
}

function decode(base64url, encoding) {
    if (encoding === void 0) { encoding = "utf8"; }
    return new Buffer(toBase64(base64url), "base64").toString(encoding);
}
function toBase64(base64url) {
    base64url = base64url.toString();
    return padString_1.default(base64url)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");
}
function fromBase64(base64) {
    return base64
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
function toBuffer(base64url) {
    return new Buffer(toBase64(base64url), "base64");
}
var base64url = encode;
base64url.encode = encode;
base64url.decode = decode;
base64url.toBase64 = toBase64;
base64url.fromBase64 = fromBase64;
base64url.toBuffer = toBuffer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = base64url;
});

var index$9 = createCommonjsModule(function (module) {
module.exports = base64url_1.default;
module.exports.default = module.exports;
});

var index$11 = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = require$$0.Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = require$$0;
} else {
  // Copy properties from require('buffer')
  copyProps(require$$0, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return require$$0.SlowBuffer(size)
};
});

/*global module, process*/
var Buffer$1 = index$11.Buffer;



function DataStream(data) {
  this.buffer = null;
  this.writable = true;
  this.readable = true;

  // No input
  if (!data) {
    this.buffer = Buffer$1.alloc(0);
    return this;
  }

  // Stream
  if (typeof data.pipe === 'function') {
    this.buffer = Buffer$1.alloc(0);
    data.pipe(this);
    return this;
  }

  // Buffer or String
  // or Object (assumedly a passworded key)
  if (data.length || typeof data === 'object') {
    this.buffer = data;
    this.writable = false;
    process.nextTick(function () {
      this.emit('end', data);
      this.readable = false;
      this.emit('close');
    }.bind(this));
    return this;
  }

  throw new TypeError('Unexpected data type ('+ typeof data + ')');
}
util.inherits(DataStream, stream);

DataStream.prototype.write = function write(data) {
  this.buffer = Buffer$1.concat([this.buffer, Buffer$1.from(data)]);
  this.emit('data', data);
};

DataStream.prototype.end = function end(data) {
  if (data)
    this.write(data);
  this.emit('end', data);
  this.emit('close');
  this.writable = false;
  this.readable = false;
};

var dataStream = DataStream;

var Buffer$3 = require$$0.Buffer; // browserify
var SlowBuffer = require$$0.SlowBuffer;

var index$15 = bufferEq;

function bufferEq(a, b) {

  // shortcutting on type is necessary for correctness
  if (!Buffer$3.isBuffer(a) || !Buffer$3.isBuffer(b)) {
    return false;
  }

  // buffer sizes should be well-known information, so despite this
  // shortcutting, it doesn't leak any information about the *contents* of the
  // buffers.
  if (a.length !== b.length) {
    return false;
  }

  var c = 0;
  for (var i = 0; i < a.length; i++) {
    /*jshint bitwise:false */
    c |= a[i] ^ b[i]; // XOR
  }
  return c === 0;
}

bufferEq.install = function() {
  Buffer$3.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
};

var origBufEqual = Buffer$3.prototype.equal;
var origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = function() {
  Buffer$3.prototype.equal = origBufEqual;
  SlowBuffer.prototype.equal = origSlowBufEqual;
};

function getParamSize(keySize) {
	var result = ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
	return result;
}

var paramBytesForAlg = {
	ES256: getParamSize(256),
	ES384: getParamSize(384),
	ES512: getParamSize(521)
};

function getParamBytesForAlg(alg) {
	var paramBytes = paramBytesForAlg[alg];
	if (paramBytes) {
		return paramBytes;
	}

	throw new Error('Unknown algorithm "' + alg + '"');
}

var paramBytesForAlg_1 = getParamBytesForAlg;

var base64Url = index$9.fromBase64;
var Buffer$4 = index$11.Buffer;



var MAX_OCTET = 0x80;
var CLASS_UNIVERSAL = 0;
var PRIMITIVE_BIT = 0x20;
var TAG_SEQ = 0x10;
var TAG_INT = 0x02;
var ENCODED_TAG_SEQ = (TAG_SEQ | PRIMITIVE_BIT) | (CLASS_UNIVERSAL << 6);
var ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);

function signatureAsBuffer(signature) {
	if (Buffer$4.isBuffer(signature)) {
		return signature;
	} else if ('string' === typeof signature) {
		return Buffer$4.from(signature, 'base64');
	}

	throw new TypeError('ECDSA signature must be a Base64 string or a Buffer');
}

function derToJose(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = paramBytesForAlg_1(alg);

	// the DER encoded param should at most be the param size, plus a padding
	// zero, since due to being a signed integer
	var maxEncodedParamLength = paramBytes + 1;

	var inputLength = signature.length;

	var offset = 0;
	if (signature[offset++] !== ENCODED_TAG_SEQ) {
		throw new Error('Could not find expected "seq"');
	}

	var seqLength = signature[offset++];
	if (seqLength === (MAX_OCTET | 1)) {
		seqLength = signature[offset++];
	}

	if (inputLength - offset < seqLength) {
		throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
	}

	if (signature[offset++] !== ENCODED_TAG_INT) {
		throw new Error('Could not find expected "int" for "r"');
	}

	var rLength = signature[offset++];

	if (inputLength - offset - 2 < rLength) {
		throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
	}

	if (maxEncodedParamLength < rLength) {
		throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
	}

	var rOffset = offset;
	offset += rLength;

	if (signature[offset++] !== ENCODED_TAG_INT) {
		throw new Error('Could not find expected "int" for "s"');
	}

	var sLength = signature[offset++];

	if (inputLength - offset !== sLength) {
		throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
	}

	if (maxEncodedParamLength < sLength) {
		throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
	}

	var sOffset = offset;
	offset += sLength;

	if (offset !== inputLength) {
		throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
	}

	var rPadding = paramBytes - rLength,
		sPadding = paramBytes - sLength;

	var dst = Buffer$4.allocUnsafe(rPadding + rLength + sPadding + sLength);

	for (offset = 0; offset < rPadding; ++offset) {
		dst[offset] = 0;
	}
	signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);

	offset = paramBytes;

	for (var o = offset; offset < o + sPadding; ++offset) {
		dst[offset] = 0;
	}
	signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);

	dst = dst.toString('base64');
	dst = base64Url(dst);

	return dst;
}

function countPadding(buf, start, stop) {
	var padding = 0;
	while (start + padding < stop && buf[start + padding] === 0) {
		++padding;
	}

	var needsSign = buf[start + padding] >= MAX_OCTET;
	if (needsSign) {
		--padding;
	}

	return padding;
}

function joseToDer(signature, alg) {
	signature = signatureAsBuffer(signature);
	var paramBytes = paramBytesForAlg_1(alg);

	var signatureBytes = signature.length;
	if (signatureBytes !== paramBytes * 2) {
		throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
	}

	var rPadding = countPadding(signature, 0, paramBytes);
	var sPadding = countPadding(signature, paramBytes, signature.length);
	var rLength = paramBytes - rPadding;
	var sLength = paramBytes - sPadding;

	var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;

	var shortLength = rsBytes < MAX_OCTET;

	var dst = Buffer$4.allocUnsafe((shortLength ? 2 : 3) + rsBytes);

	var offset = 0;
	dst[offset++] = ENCODED_TAG_SEQ;
	if (shortLength) {
		// Bit 8 has value "0"
		// bits 7-1 give the length.
		dst[offset++] = rsBytes;
	} else {
		// Bit 8 of first octet has value "1"
		// bits 7-1 give the number of additional length octets.
		dst[offset++] = MAX_OCTET	| 1;
		// length, base 256
		dst[offset++] = rsBytes & 0xff;
	}
	dst[offset++] = ENCODED_TAG_INT;
	dst[offset++] = rLength;
	if (rPadding < 0) {
		dst[offset++] = 0;
		offset += signature.copy(dst, offset, 0, paramBytes);
	} else {
		offset += signature.copy(dst, offset, rPadding, paramBytes);
	}
	dst[offset++] = ENCODED_TAG_INT;
	dst[offset++] = sLength;
	if (sPadding < 0) {
		dst[offset++] = 0;
		signature.copy(dst, offset, paramBytes);
	} else {
		signature.copy(dst, offset, paramBytes + sPadding);
	}

	return dst;
}

var ecdsaSigFormatter = {
	derToJose: derToJose,
	joseToDer: joseToDer
};

var Buffer$2 = index$11.Buffer;




var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512" and "none".';
var MSG_INVALID_SECRET = 'secret must be a string or buffer';
var MSG_INVALID_VERIFIER_KEY = 'key must be a string or a buffer';
var MSG_INVALID_SIGNER_KEY = 'key must be a string, a buffer or an object';

function typeError(template) {
  var args = [].slice.call(arguments, 1);
  var errMsg = util.format.bind(util, template).apply(null, args);
  return new TypeError(errMsg);
}

function bufferOrString(obj) {
  return Buffer$2.isBuffer(obj) || typeof obj === 'string';
}

function normalizeInput(thing) {
  if (!bufferOrString(thing))
    thing = JSON.stringify(thing);
  return thing;
}

function createHmacSigner(bits) {
  return function sign(thing, secret) {
    if (!bufferOrString(secret))
      throw typeError(MSG_INVALID_SECRET);
    thing = normalizeInput(thing);
    var hmac = crypto.createHmac('sha' + bits, secret);
    var sig = (hmac.update(thing), hmac.digest('base64'));
    return index$9.fromBase64(sig);
  }
}

function createHmacVerifier(bits) {
  return function verify(thing, signature, secret) {
    var computedSig = createHmacSigner(bits)(thing, secret);
    return index$15(Buffer$2.from(signature), Buffer$2.from(computedSig));
  }
}

function createKeySigner(bits) {
 return function sign(thing, privateKey) {
    if (!bufferOrString(privateKey) && !(typeof privateKey === 'object'))
      throw typeError(MSG_INVALID_SIGNER_KEY);
    thing = normalizeInput(thing);
    // Even though we are specifying "RSA" here, this works with ECDSA
    // keys as well.
    var signer = crypto.createSign('RSA-SHA' + bits);
    var sig = (signer.update(thing), signer.sign(privateKey, 'base64'));
    return index$9.fromBase64(sig);
  }
}

function createKeyVerifier(bits) {
  return function verify(thing, signature, publicKey) {
    if (!bufferOrString(publicKey))
      throw typeError(MSG_INVALID_VERIFIER_KEY);
    thing = normalizeInput(thing);
    signature = index$9.toBase64(signature);
    var verifier = crypto.createVerify('RSA-SHA' + bits);
    verifier.update(thing);
    return verifier.verify(publicKey, signature, 'base64');
  }
}

function createECDSASigner(bits) {
  var inner = createKeySigner(bits);
  return function sign() {
    var signature = inner.apply(null, arguments);
    signature = ecdsaSigFormatter.derToJose(signature, 'ES' + bits);
    return signature;
  };
}

function createECDSAVerifer(bits) {
  var inner = createKeyVerifier(bits);
  return function verify(thing, signature, publicKey) {
    signature = ecdsaSigFormatter.joseToDer(signature, 'ES' + bits).toString('base64');
    var result = inner(thing, signature, publicKey);
    return result;
  };
}

function createNoneSigner() {
  return function sign() {
    return '';
  }
}

function createNoneVerifier() {
  return function verify(thing, signature) {
    return signature === '';
  }
}

var index$13 = function jwa(algorithm) {
  var signerFactories = {
    hs: createHmacSigner,
    rs: createKeySigner,
    es: createECDSASigner,
    none: createNoneSigner,
  };
  var verifierFactories = {
    hs: createHmacVerifier,
    rs: createKeyVerifier,
    es: createECDSAVerifer,
    none: createNoneVerifier,
  };
  var match = algorithm.match(/^(RS|ES|HS)(256|384|512)$|^(none)$/i);
  if (!match)
    throw typeError(MSG_INVALID_ALGORITHM, algorithm);
  var algo = (match[1] || match[3]).toLowerCase();
  var bits = match[2];

  return {
    sign: signerFactories[algo](bits),
    verify: verifierFactories[algo](bits),
  }
};

/*global module*/
var Buffer$5 = require$$0.Buffer;

var tostring = function toString(obj) {
  if (typeof obj === 'string')
    return obj;
  if (typeof obj === 'number' || Buffer$5.isBuffer(obj))
    return obj.toString();
  return JSON.stringify(obj);
};

/*global module*/







function jwsSecuredInput(header, payload, encoding) {
  encoding = encoding || 'utf8';
  var encodedHeader = index$9(tostring(header), 'binary');
  var encodedPayload = index$9(tostring(payload), encoding);
  return util.format('%s.%s', encodedHeader, encodedPayload);
}

function jwsSign(opts) {
  var header = opts.header;
  var payload = opts.payload;
  var secretOrKey = opts.secret || opts.privateKey;
  var encoding = opts.encoding;
  var algo = index$13(header.alg);
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = algo.sign(securedInput, secretOrKey);
  return util.format('%s.%s', securedInput, signature);
}

function SignStream(opts) {
  var secret = opts.secret||opts.privateKey||opts.key;
  var secretStream = new dataStream(secret);
  this.readable = true;
  this.header = opts.header;
  this.encoding = opts.encoding;
  this.secret = this.privateKey = this.key = secretStream;
  this.payload = new dataStream(opts.payload);
  this.secret.once('close', function () {
    if (!this.payload.writable && this.readable)
      this.sign();
  }.bind(this));

  this.payload.once('close', function () {
    if (!this.secret.writable && this.readable)
      this.sign();
  }.bind(this));
}
util.inherits(SignStream, stream);

SignStream.prototype.sign = function sign() {
  try {
    var signature = jwsSign({
      header: this.header,
      payload: this.payload.buffer,
      secret: this.secret.buffer,
      encoding: this.encoding
    });
    this.emit('done', signature);
    this.emit('data', signature);
    this.emit('end');
    this.readable = false;
    return signature;
  } catch (e) {
    this.readable = false;
    this.emit('error', e);
    this.emit('close');
  }
};

SignStream.sign = jwsSign;

var signStream = SignStream;

/*global module*/






var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function isObject$1(thing) {
  return Object.prototype.toString.call(thing) === '[object Object]';
}

function safeJsonParse(thing) {
  if (isObject$1(thing))
    return thing;
  try { return JSON.parse(thing); }
  catch (e) { return undefined; }
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split('.', 1)[0];
  return safeJsonParse(index$9.decode(encodedHeader, 'binary'));
}

function securedInputFromJWS(jwsSig) {
  return jwsSig.split('.', 2).join('.');
}

function signatureFromJWS(jwsSig) {
  return jwsSig.split('.')[2];
}

function payloadFromJWS(jwsSig, encoding) {
  encoding = encoding || 'utf8';
  var payload = jwsSig.split('.')[1];
  return index$9.decode(payload, encoding);
}

function isValidJws(string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

function jwsVerify(jwsSig, algorithm, secretOrKey) {
  if (!algorithm) {
    var err = new Error("Missing algorithm parameter for jws.verify");
    err.code = "MISSING_ALGORITHM";
    throw err;
  }
  jwsSig = tostring(jwsSig);
  var signature = signatureFromJWS(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  var algo = index$13(algorithm);
  return algo.verify(securedInput, signature, secretOrKey);
}

function jwsDecode(jwsSig, opts) {
  opts = opts || {};
  jwsSig = tostring(jwsSig);

  if (!isValidJws(jwsSig))
    return null;

  var header = headerFromJWS(jwsSig);

  if (!header)
    return null;

  var payload = payloadFromJWS(jwsSig);
  if (header.typ === 'JWT' || opts.json)
    payload = JSON.parse(payload, opts.encoding);

  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig)
  };
}

function VerifyStream(opts) {
  opts = opts || {};
  var secretOrKey = opts.secret||opts.publicKey||opts.key;
  var secretStream = new dataStream(secretOrKey);
  this.readable = true;
  this.algorithm = opts.algorithm;
  this.encoding = opts.encoding;
  this.secret = this.publicKey = this.key = secretStream;
  this.signature = new dataStream(opts.signature);
  this.secret.once('close', function () {
    if (!this.signature.writable && this.readable)
      this.verify();
  }.bind(this));

  this.signature.once('close', function () {
    if (!this.secret.writable && this.readable)
      this.verify();
  }.bind(this));
}
util.inherits(VerifyStream, stream);
VerifyStream.prototype.verify = function verify() {
  try {
    var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
    var obj = jwsDecode(this.signature.buffer, this.encoding);
    this.emit('done', valid, obj);
    this.emit('data', valid);
    this.emit('end');
    this.readable = false;
    return valid;
  } catch (e) {
    this.readable = false;
    this.emit('error', e);
    this.emit('close');
  }
};

VerifyStream.decode = jwsDecode;
VerifyStream.isValid = isValidJws;
VerifyStream.verify = jwsVerify;

var verifyStream = VerifyStream;

/*global exports*/



var ALGORITHMS = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512'
];

var ALGORITHMS_1 = ALGORITHMS;
var sign = signStream.sign;
var verify = verifyStream.verify;
var decode$2 = verifyStream.decode;
var isValid$3 = verifyStream.isValid;
var createSign = function createSign(opts) {
  return new signStream(opts);
};
var createVerify = function createVerify(opts) {
  return new verifyStream(opts);
};

var index$7 = {
	ALGORITHMS: ALGORITHMS_1,
	sign: sign,
	verify: verify,
	decode: decode$2,
	isValid: isValid$3,
	createSign: createSign,
	createVerify: createVerify
};

var GOOGLE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var GOOGLE_REVOKE_TOKEN_URL = 'https://accounts.google.com/o/oauth2/revoke?token=';

/**
 * Create a GoogleToken.
 *
 * @param {object}   options  Configuration object.
 */
function GoogleToken(options) {
  if (!(this instanceof GoogleToken)) {
    return new GoogleToken(options);
  }
  this._configure(options);
}

GoogleToken.prototype._mime = mime;

/**
 * Returns whether the token has expired.
 *
 * @return {Boolean} true if the token has expired, false otherwise.
 */
GoogleToken.prototype.hasExpired = function() {
  var now = (new Date()).getTime();
  if (this.token && this.expires_at) {
    return now >= this.expires_at;
  } else {
    return true;
  }
};

GoogleToken.prototype._gp12pem = emptyModule;

/**
 * Returns a cached token or retrieves a new one from Google.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype.getToken = function(callback) {
  var self = this;

  if (!this.hasExpired()) {
    return callback(null, this.token);
  } else {
    if (!this.key && !this.keyFile) {
      callback(new Error('No key or keyFile set.'));
      return;
    } else if (!this.key && this.keyFile) {
      var mimeType = this._mime.lookup(this.keyFile);
      if (mimeType === 'application/json') {
        // json file
        fs.readFile(this.keyFile, handleJSONKey);
      } else {
        // Must be a .p12 file or .pem key
        if (!self.iss) {
          var error = new Error('email is required.');
          error.code = 'MISSING_CREDENTIALS';
          callback(error);
          return;
        }

        if (mimeType === 'application/x-pkcs12') {
          // convert to .pem on the fly
          self._gp12pem(this.keyFile, handleKey);
        } else {
          // assume .pem key otherwise
          fs.readFile(this.keyFile, handleKey);
        }
      }
    } else {
      return this._requestToken(callback);
    }
  }

  function handleJSONKey(err, key) {
    if (err) {
      callback(err);
      return;
    }
    try {
      var body = JSON.parse(key);
      self.key = body.private_key;
      self.iss = body.client_email;
    } catch (e) {
      callback(e);
      return;
    }

    if (!self.key || !self.iss) {
      var error = new Error('private_key and client_email are required.');
      error.code = 'MISSING_CREDENTIALS';
      callback(error);
      return;
    }

    self._requestToken(callback);
  }

  function handleKey(err, key) {
    if (err) {
      callback(err);
      return;
    }
    self.key = key;
    self._requestToken(callback);
  }
};

/**
 * Revoke the token if one is set.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype.revokeToken = function(callback) {
  var self = this;
  if (this.token) {
    this._request(GOOGLE_REVOKE_TOKEN_URL + this.token, function(err, res) {
      if (err) {
        callback(err);
        return;
      }
      self._configure({
        email: self.iss,
        sub: self.sub,
        key: self.key,
        keyFile: self.keyFile,
        scope: self.scope
      });
      callback();
    });
  } else {
    callback(new Error('No token to revoke.'));
  }
};

/**
 * Configure the GoogleToken for re-use.
 * @param  {object} options Configuration object.
 */
GoogleToken.prototype._configure = function(options) {
  var self = this;
  options = options || {};
  this.keyFile = options.keyFile;
  this.key = options.key;
  this._request = request;
  this.token = this.expires_at = this.raw_token = null;
  this.iss = options.email || options.iss;

  if (options.sub) {
    this.sub = options.sub;
  }

  if (typeof options.scope === 'object') {
    this.scope = options.scope.join(' ');
  } else {
    this.scope = options.scope;
  }
};

/**
 * Request the token from Google.
 *
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype._requestToken = function(callback) {
  var self = this;
  var iat = Math.floor(new Date().getTime() / 1000);
  var payload = {
    iss: this.iss,
    scope: this.scope,
    aud: GOOGLE_TOKEN_URL,
    exp: iat + 3600, // 3600 seconds = 1 hour
    iat: iat
  };

  if (this.sub) {
    payload.sub = this.sub;
  }

  var toSign = {
    header: {
      alg: 'RS256',
      typ: 'JWT'
    },
    payload: payload,
    secret: this.key
  };

  return this._signJWT(toSign, function(err, signedJWT) {
    if (err) {
      callback(err, null);
      return;
    }

    return self._request({
      method: 'post',
      url: GOOGLE_TOKEN_URL,
      form: {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: signedJWT
      }
    }, function(err, res, body) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }

      err = err || body.error && new Error(body.error);

      if (err) {
        self.token = null;
        self.token_expires = null;
        callback(err, null);
        return;
      }

      self.raw_token = body;
      self.token = body.access_token;
      self.expires_at = (iat + body.expires_in) * 1000;
      return callback(null, self.token);
    });
  });
};

/**
 * Sign the JWT object, returning any errors in the callback.
 *
 * @param  {object}   opts     The configuration object.
 * @param  {Function} callback The callback function.
 */
GoogleToken.prototype._signJWT = function(opts, callback) {
  try {
    var signedJWT = index$7.sign(opts);
    return callback(null, signedJWT);
  } catch (err) {
    callback(err, null);
  }
};

var index$5 = GoogleToken;

function Token(accessToken, expiry) {
  this.accessToken = accessToken;
  this.expiry = expiry;
}

Token.prototype.isExpired = function () {
  if (!this.accessToken || !this.expiry) return true
  return new Date().getTime() - this.expiry.getTime() > 0
};

var token = Token;

var METADATA_TOKEN_URL = "http://metadata/computeMetadata/v1/instance/service-accounts/default/token";

function Connection(options) {
  if (!(this instanceof Connection)) return new Connection(options)

  events.EventEmitter.call(this);
  this.setMaxListeners(0);

  options = options || {};

  this.credentials = options.credentials;
  this.keyFile = options.keyFile;
  this.scopes = options.scopes || [];

  if (this.credentials && (!this.credentials.client_email || !this.credentials.private_key))
    throw new Error("A credentials object must contain the following keys: client_email, private_key")
}

util.inherits(Connection, events.EventEmitter);

Connection.prototype.connect = function (callback) {
  if (this.token && !this.token.isExpired()) return setImmediate(callback)

  this.once("connected", callback);

  if (this.isConnecting) return

  this.isConnecting = true;
  this.fetchToken(function (err, token$$1) {
    this.isConnecting = false;
    if (err) return this.emit("connected", err)
    this.token = token$$1;
    this.emit("connected");
  }.bind(this));
};

Connection.prototype.createAuthorizedRequest = function (requestOptions, callback) {
  if (typeof requestOptions === "function") {
    callback = requestOptions;
    requestOptions = {};
  }

  this.getToken(function (err, token$$1) {
    if (err) return callback(err)

    callback(null, extend(true, {}, requestOptions, {
      headers: {
        Authorization: "Bearer " + token$$1
      }
    }));
  });
};

Connection.prototype.fetchServiceAccountToken = function (callback) {
  var gtoken = new index$5({
    iss: this.credentials.client_email,
    key: this.credentials.private_key,
    scope: this.scopes
  });

  gtoken.getToken(function (err, token$$1) {
    if (err) return callback(err)
    var exp = new Date(gtoken.expires_at);
    callback(null, new token(token$$1, exp));
  });
};

Connection.prototype.fetchToken = function (callback) {
  if (/*G[AC]E*/!this.keyFile && !this.credentials)
    return request({
      method: "get",
      uri: METADATA_TOKEN_URL,
      headers: {
        "Metadata-Flavor": "Google"
      },
      json: true
    }, function (err, res, body) {
      if (err || !body.access_token) return callback(err)

      var exp = new Date(Date.now() + body.expires_in * 1000);
      callback(null, new token(body.access_token, exp));
    })

  if (!this.credentials)
    return fs.readFile(this.keyFile, function (err, data) {
      if (err) return callback(err)
      this.credentials = JSON.parse(data);
      this.fetchServiceAccountToken(callback);
    }.bind(this))

  this.fetchServiceAccountToken(callback);
};

Connection.prototype.getCredentials = function (callback) {
  if (this.credentials) return setImmediate(callback, null, this.credentials)

  this.connect(function (err) {
    if (err) return callback(err)
    callback(null, this.credentials);
  }.bind(this));
};

Connection.prototype.getToken = function (callback) {
  this.connect(function (err) {
    if (err) return callback(err)
    callback(null, this.token.accessToken);
  }.bind(this));
};

var connection = Connection;

var index$4 = function (options) {
  var connection$$1 = new connection(options);
  var authorize = connection$$1.createAuthorizedRequest.bind(connection$$1);
  authorize.getCredentials = connection$$1.getCredentials.bind(connection$$1);
  authorize.getToken = connection$$1.getToken.bind(connection$$1);
  return authorize
};

class BigQuery {
  constructor(credentials) {
    this._authorize = index$4({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/bigquery",
        // "https://www.googleapis.com/auth/cloud-platform",
        "https://www.googleapis.com/auth/bigquery.insertdata"
      ]
    });
  }
  insert(projectId, datasetId, tableId, rows) {
    // https://cloud.google.com/bigquery/docs/reference/rest/v2/tabledata/insertAll
    // https://github.com/GoogleCloudPlatform/google-cloud-node/blob/ebcda2036a750a0c93ba4cc159e55d9441031f46/packages/bigquery/src/table.js#L1170

    const url = `https://www.googleapis.com/bigquery/v2/projects/${projectId}/datasets/${datasetId}/tables/${tableId}/insertAll`;
    const requestBody = {
      kind: "bigquery#tableDataInsertAllRequest",
      skipInvalidRows: true,
      ignoreUnknownValues: true,
      // templateSuffix: string,
      rows: rows.map(r => ({ json: r }))
    };
    return new Promise((resolve, reject) => {
      this._authorize((err, headers) => {
        if (err) {
          reject(err);
        } else {
          resolve(headers);
        }
      });
    }).then(options => {
      return axios.post(url, requestBody, options);
    });
  }
}

var config = {
  projectId : "hnactivity",
  datasetId : "hnstats",
  tableId : "stats"
};

function bqjob(credentials) {
  const bq = new BigQuery(credentials);
  return function(rows) {
    const { projectId, datasetId, tableId } = config;
    return bq.insert(projectId, datasetId, tableId, rows);
  };
}

const SAMPLE_INTERVAL = 60 * 1000; // 60 seconds

async function fetchStats() {
  const taskId = index$1();
  const client = new HNApiClient();
  const beginTimestamp = new Date();

  const stories = await client.frontpageStories();
  const beforeEntries = stories.map(story => {
    return {
      story,
      timestamp: beginTimestamp,
      rank: story.rank
    };
  });
  const timeTook = new Date() - beginTimestamp;

  await sleep(SAMPLE_INTERVAL - timeTook);
  const endTimestamp = new Date();
  const updatedStories = await client.stories(
    ...stories.map(story => story.id)
  );
  const topIdsAfter = await client.topitemIds();
  const afterEntries = updatedStories.map(story => {
    return {
      story,
      timestamp: endTimestamp,
      rank: getRank(topIdsAfter, story.id)
    };
  });
  const entries = index(beforeEntries, afterEntries).map(([before, after]) =>
    Object.assign(computeEntryFromStoryPair(before, after), { task_id: taskId })
  );
  return entries;
}

async function task(credentials) {
  const bqSubmitJob = bqjob(credentials);
  try {
    await fetchStats().then(bqSubmitJob);
    console.log("Submited to BigQuery");
  } catch (err) {
    console.error("Task failed, reason: ", err);
    return Promise.reject(err);
  }
}

function execute(context, callback) {
  const bqCreds = JSON.parse(context.secrets.gcloud);
  task(bqCreds)
    .then(() => {
      console.log("Task Completed");
      callback(null, { success: true });
    })
    .catch(err => {
      console.error("Task failed, reason: ", err);
      callback(err, null);
    });
}

module.exports = execute;
