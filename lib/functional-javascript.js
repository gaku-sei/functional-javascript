//     Fjs.js 0.17.0
//     https://github.com/gaku-sei/functional-javascript
//     (c) 2014 Kevin Combriat / Beviral

var add, apply, applyWith, and, areArguments, arity, arity0, arity1, arity2, arity3, assoc, attrs, bind, butfirst, butlast, call,
    callWith, clone, comp, complement, concat, concatMap, concatMapkv, conj, cons, cs, curriedFunctions, curry, curry1,
    cycle, dec, del, dir, dir1, div, doc, drop, dropWhile, eq, eq2, eq3, eqOne, eqZero, error, error1, even, every, fdrop, fget, filter,
    first, flatten, flip, fmap, fmapkv, fmapkvo, fmapo, fn, freduce, freducekv, freducer, get, gt, gte, id, inc, interleave, interpose, is,
    isa, isArray, isArrayLike, isBoolean, isDate, isEmpty, isFalse, isFloat, isFunction, isInt, isNull, isNumber, isObject, isString, isTrue,
    isUndefined, join, juxt, keys, last, len, log, log1, lookup, loop, lt, lte, map, mapkv, mapkvo, mapo, marshal, max, merge, min, mul, neq2,
    neq3, not, odd, or, owns, partial, pow, product, rand, randIndex, randInt, range, reduce, reducekv, reducer, repeat, repeatedly, reverse,
    second, shuffle, slice, some, sort, source, sqrt, sub, sum, takeWhile, thread, time, times, unmarshal, use, useAll, values, version, warn,
    warn1, xor, xrange, zip;

// Errors
// ------

/**
 * NotImplementedError error class
 * @augments Error
 * @param {string} message - The message to display
 */
function NotImplementedError(message) {
  this.name = "NotImplementedError";
  this.message = message || '';
}
NotImplementedError.prototype = new Error();
exports.NotImplementedError = NotImplementedError;

/**
 * ArgumentError error class
 * @augments Error
 * @param {string} message - The message to display
 */
function ArgumentError(message) {
  this.name = "ArgumentError";
  this.message = message || '';
}
ArgumentError.prototype = new Error();
exports.ArgumentError = ArgumentError;

// Functions
// ---------

/**
 * Create a function with doc
 * @function
 * @param {...string} docs - Documents string (joined with \\n)
 * @param {function} f - The function to document
 * @returns {function} Documented function
 * @throws {ArgumentError} If f is not a function
 */
exports.fn = fn = function fn() {
  var f = arguments[arguments.length - 1];
  if (typeof f !== 'function')
    throw new ArgumentError('Last argument of fn must be a function');
  f.doc = [].slice.call(arguments, 0, -1).join('\n');
  return f;
};

/**
 * Wrapper for the for statement.
 * loop also checks hasOwnProperty before calling given function.
 * loop is a side-effect only function
 * @function
 * @param {function(*, *)} f - Function used in iteration
 * @param {Array.<*>} xs - Array to iterate over
 * @returns {undefined}
 */
exports.loop = loop = function loop(f, xs) {
  for (var i in xs)
    if (xs.hasOwnProperty(i))
      f.call(null, i, xs[i]);
};

/**
 * General purpose type checker
 * @function
 * @param {string} type - The type to check
 * @returns {function(*): boolean}
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.is = is = function is(type) {
  return function(x) {
    return {}.toString.call(x).slice(8, -1) === type;
  };
};

/**
 * Wrapper for instanceof operator
 * @function
 * @param {*} obj - Object to check
 * @param {...*} classes - Classes to check against obj
 * @returns {boolean}
 * @example
 *   isa({}, Object) // returns true
 * @example
 *   var Foo = function() {}
 *   var foo = new Foo
 *   isa(foo, Foo) // returns true
 * @example
 *   isa(foo, Foo, Object) // returns true
 * @see is
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isa = isa = function isa(obj) {
  var fs = butfirst(arguments);
  for (i in fs)
    if (fs.hasOwnProperty(i) && !(obj instanceof fs[i]))
      return false;
  return true;
};

/**
 * Wrapper for the hasOwnProperty method
 * @function
 * @param {Array.<*>} xs - Array of any type
 * @param {*} prop - Property to check
 * @returns {boolean}
 */
exports.owns = owns = function owns(xs, prop) {
  return xs.hasOwnProperty(prop);
};

/**
 * Negates boolean value
 * @function
 * @param {boolean} bool - Value to negate
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see or
 * @see xor
 */
exports.not = not = function not(bool) {
  return !bool;
};

/**
 * Variadic wrapper for the == operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.eq2 = eq2 = function eq2() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x == y;
    return (x == y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the === operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.eq3 = eq3 = function eq3() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x === y;
    return (x === y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the != operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.neq2 = neq2 = function neq2() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x != y;
    return (x != y) || reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the !== operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see not
 * @see or
 * @see xor
 */
exports.neq3 = neq3 = function neq3() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x !== y;
    return (x !== y) || reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the < operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.lt = lt = function lt() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x < y;
    return (x < y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the > operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.gt = gt = function gt() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x > y;
    return (x > y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the <= operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.lte = lte = function lte() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x <= y;
    return (x <= y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the >= operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.gte = gte = function gte() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x >= y;
    return (x >= y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the && operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.and = and = function and() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x && y;
    return (x && y) && reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Variadic wrapper for the || operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see xor
 */
exports.or = or = function or() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return x || y;
    return (x || y) || reducer(rest[0], rest[1], slice(rest, 1));
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * xor operator
 * @function
 * @param {...*} objs - Objects to test
 * @returns {boolean}
 * @see and
 * @see eq
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 */
exports.xor = xor = function xor() {
  var args = arguments;
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return !x !== !y && (x || y);
    var val1 = (!x !== !y && (x || y));
    var val2 = reducer(rest[0], rest[1], slice(rest, 1));
    return !val1 !== !val2 && (val1 || val2);
  }
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Takes a function and returns a function which does the exact thing
 * except it negates the returned boolean value.
 * @function
 * @param {function(): boolean} f - Function to get complement from
 * @returns {function(): boolean} Complement function
 */
exports.complement = complement = function complement(f) {
  return function() {
    return !apply(f, arguments);
  };
};

/**
 * Uses context and rebinds 'this',
 * it applies a function to an array of arguments.
 * The first argument must be a function,
 * and the second one the context.
 * @function
 * @param {function} f - Function to apply
 * @param {*} ctx - Binding for the 'this' variable
 * @param {Array.<*>} args - Arguments for f
 * @returns {*}
 * @throws {ArgumentError} If f is not a function
 * @see callWith
 * @see call
 * @see apply
 */
exports.applyWith = applyWith = function applyWith(f, cxt, args) {
  if (!isArrayLike(args))
    throw new ArgumentError('args must be an array or some arguments');
  return f.apply(cxt, args);
};

/**
 * Uses context and rebinds 'this',
 * It applies a function to a variable number of arguments.
 * The first argument must be a function,
 * and the second one is the context.
 * @function
 * @param {function} f - Function to call
 * @param {*} ctx - Binding for the 'this' variable
 * @param {...*} args - Arguments for f
 * @returns {*}
 * @see applyWith
 * @see apply
 * @see call
 */
exports.callWith = callWith = function callWith(f, cxt) {
  return applyWith(f, cxt, slice(arguments, 2));
};

/**
 * Rebinds 'this' for function 'f'
 * @function
 * @param {function} f - Function to bind
 * @param {*} ctx - Binding for the 'this' variable
 * @returns {function}
 */
exports.bind = bind = function bind(f, ctx) {
  return partial(callWith, f, ctx);
};

/**
 * Use with caution since arity may leads to cryptic errors!
 * Limit the arguments given to a function.
 * @function
 * @param {number} n - Arity
 * @returns {function(function):function}
 * @example
 *   //In this example, the two first arguments only are passed to the function add.
 *   arity(2)(add)(2, 7, 6) // returns 9
 * @see arity0
 * @see arity1
 * @see arity2
 * @see arity3
 */
exports.arity = arity = function arity(n) {
  return function(f) {
    return function() {
      return apply(f, slice(arguments, 0, n));
    };
  };
};

/**
 * Arity 0 for function f
 * @function
 * @param {function} f - The function to set arity of
 * @returns {function()} A function with an arity set at 0
 * @see arity
 * @see arity1
 * @see arity2
 * @see arity3
 */
exports.arity0 = arity0 = arity(0);

/**
 * Arity 1 for function f
 * @function
 * @param {function} f - The function to set arity of
 * @returns {function(*)} A function with an arity set at 1
 * @see arity
 * @see arity0
 * @see arity2
 * @see arity3
 */
exports.arity1 = arity1 = arity(1);

/**
 * Arity 2 for function f
 * @function
 * @param {function} f - The function to set arity of
 * @returns {function(*, *)} A function with an arity set at 2
 * @see arity
 * @see arity0
 * @see arity1
 * @see arity3
 */
exports.arity2 = arity2 = arity(2);

/**
 * Arity 3 for function f
 * @function
 * @param {function} f - The function to set arity of
 * @returns {function(*, *, *)} A function with an arity set at 3
 * @see arity
 * @see arity0
 * @see arity1
 * @see arity2
 */
exports.arity3 = arity3 = arity(3);

/**
 * Wrapper for the console object.
 * The function returned by cs itself returns its arguments.
 * @function
 * @param {string} method - The console's method to use
 * @returns {function} The console[method] function
 * @example
 *   map(inc, cs('log')(1, 2)) // logs [1, 2] then returns [2, 3]
 *   add(cs('log')(1), 2)      // logs 1 then returns 3
 * @see log
 * @see log1
 * @see dir
 * @see dir1
 * @see warn
 * @see warn1
 * @see error
 * @see error1
 */
exports.cs = cs = function cs(met) {
  return function() {
    var args = arguments.length < 2 ? first(arguments) : slice(arguments);
    console[met](args);
    return args;
  };
};

/**
 * Returns self
 * @function
 * @param {*} x - Object to return
 * @returns {*} Returns x
 */
exports.id = id = function id(x) {
  return x;
};

/**
 * General purpose clone function.
 * The objects and arrays are mutable in JS
 * clone allows to bypass this with ease.
 * Nonetheless, for the moment, clone is very, very long, use with care.
 * @@todo Handle self created objects (?)
 * @function
 * @param {*} x - Object to clone
 * @returns {*} Returns a clone of x
 * @see sort
 * @see assoc
 */
exports.clone = clone = function clone(x) {
  //// JSON.parse / JSON.stringify
  //return JSON.parse(JSON.stringify(x));

  //// Own version
  var cloneArray = function(xs) {
    return map(clone, xs);
  };
  var cloneObject = function(xs) {
    //mapo?
    var y = {};
    for (i in xs)
      y[clone(i)] = clone(xs[i]);
    return y;
  };

  var cloneDate = function(d) {
    return new Date(d.getTime());
  };

  switch(true) {
  case isArrayLike(x): return cloneArray(x);
  case isObject(x): return cloneObject(x);
  case isDate(x): return cloneDate(x);
  default: return x;
  }
};

/**
 * Returns the attribute doc of an object
 * @function
 * @param {*} obj - Object to get doc from
 * @param obj.doc Contains the doc of obj
 * @returns {*|undefined} Doc (usely a string) or undefined
 */
exports.doc = doc = function doc(obj) {
  return obj.doc;
};

/**
 * Return the length attribute of obj
 * @function
 * @param {*} obj - Object to get doc from
 * @param obj.length Contains the length of obj
 * @returns {number|undefined} The length or undefined
 */
exports.len = len = function len(obj) {
  return obj.length;
};

/**
 * Returns a JS Object containing all the properties owned by obj.
 * You may get the attrs of everything.
 * @function
 * @param {*} obj - Object to get attributes from
 * @returns {object} A JS Object containing the attributes of obj
 */
exports.attrs = attrs = function attrs(obj) {
  var attrsObj = {};
  for (var i in obj)
    attrsObj[i] = obj[i];
  return attrsObj;
};

/**
 * Applies a function to an array of arguments.
 * The first argument must be a function,
 * the context is set to void 8.
 * @function
 * @param {function} f - Function to apply
 * @param {Array.<*>} args - Arguments for f
 * @returns {*}
 * @throws {ArgumentError} If f is not a function
 * @see applyWith
 * @see callWith
 * @see call
 */
exports.apply = apply = function apply(f, args) {
  if (!isArrayLike(args))
    throw new ArgumentError('args must be an array or some arguments');
  return applyWith(f, void 8, args);
};

/**
 * Applies a function to a variable number of arguments.
 * The first argument must be a function,
 * the context is set to void 8.
 * @function
 * @param {function} f - Function to call
 * @param {...*} args - Arguments for f
 * @returns {*}
 * @see callWith
 * @see applyWith
 * @see apply
 */
exports.call = call = function call(f) {
  return apply(f, butfirst(arguments));
};

/**
 * Composes functions.
 * @function
 * @param {...function} fs - Functions to compose
 * @returns {function}
 * @example
 *   comp(partial(add, 1), partial(mul, 2))(2)                  // returns 5
 *   comp(partial(mul, 2), partial(add, 1), partial(mul, 3))(4) // returns 26
 */
exports.comp = comp = function comp() {
  return reduce(function(f, g) {
    return function() {
      return call(f, apply(g, arguments));
    };
  }, arguments);
};

/**
 * Wrapper for the Array.prototype.slice function
 * slice returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>} xs - Array to slice
 * @param {number} begin
 * @param {number=} [end=End of the sequence]
 * @returns {Array.<*>}
 * @example
 *   slice(arguments)          // similar to [].slice.call(arguments)
 *   slice([1, 2, 3, 4], 1, 3) // returns [2, 3]
 *   slice([1, 2, 3], -1)      // returns [3]
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice|MDN - slice}
 */
exports.slice = slice = function slice(xs) {
  var args = [].slice.call(arguments).slice(1);
  return applyWith([].slice, xs, args);
};

/**
 * Wrapper for the Array.prototype.join function
 * join replaces ',' with ''
 * @function
 * @param {Array.<*>} xs - Array to join
 * @param {*=} [sep=Empty string] - Separator
 * @returns {string} Joined array
 * @example
 *  join(['foo', 'bar']) // returns 'foobar'
 *  join(['foo', 'bar'], '!') // returns 'foo!bar'
 */
exports.join = join = function join(xs) {
  var sep = second(arguments)||'';
  return callWith([].join, xs, sep);
};

/**
 * Concats several arrays
 * concat returns a shallow copy of the array elements
 * @function
 * @param {...Array.<*>} arrays - Arrays to concat
 * @returns {Array.<*>}
 * @example
 *   concat([1, 2, 3], [4, [5, 6]]) // returns [1, 2, 3, 4, [5, 6]]
 */
exports.concat = concat = function concat() {
  var xs = [];
  for (var i in arguments)
    for (var j in arguments[i])
      xs.push(arguments[i][j]);
  return xs;
};

/**
 * Applies f to each item of xs and returns the results as an array.
 * @function
 * @param {function(*): *} f - Function to apply on each element of xs
 * @param {Array.<*>} xs - Consumed Array
 * @returns {Array.<*>}
 * @example
 *   map(partial(add, 2), [1, 2, 4]) // returns [3, 4, 6]
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map|MDN - map}
 */
exports.map = map = function map(f, xs) {
  // [].map
  return callWith([].map, xs, arity1(f));

  //// Own version (slower)
  //var ret = [];
  //loop(function(i, x) {
  //  ret.push(call(f, x));
  //}, xs);
  //return ret;
};

/**
 * Applies f to each item of xs and returns the results as a JS Object.
 * f must returns an array of length two, since the first element is used a key and the second as a value.
 * @function
 * @param {function(*): *} f - Function to apply on each element of xs
 * @param {Array.<*>} xs - Consumed Array
 * @returns {object}
 * @example
 *   map(partial(add, 2), [1, 2, 4]) // returns [3, 4, 6]
 * @see map
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
*/
exports.mapo = mapo = function mapo(f, xs) {
  return marshal(map(f, xs));
};

/**
 * Like map but mapkv also passes the key to the given function.
 * Notice that if xs is an Array its indexes are automatically casted into Int.
 * @function
 * @param {function(*): *} f - Function to apply on each element of obj
 * @param {object} obj - Consumed JS Object
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 */
exports.mapkv = mapkv = function mapkv(f, obj) {
  var ret = [];
  loop(function(k, v) {
    ret.push(f.call(f, isArrayLike(obj) ? parseInt(k) : k, v));
  }, obj);
  return ret;
};

/**
 * Like mapkv but returns an object.
 * f must returns an array of length two, since the first element is used a key and the second as a value.
 * Be careful, keys can be overwritten.
 * @function
 * @param {function(*): Array(2)} f - Function to apply on each element of obj (must return a pair)
 * @param {object} obj - Consumed JS Object
 * @returns {object}
 * @see map
 * @see mapo
 * @see mapkv
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 */
exports.mapkvo = mapkvo = function mapkvo(f, obj) {
  return marshal(mapkv(f, obj));
};

/**
 * Map f over xs then concats the result
 * @function
 * @param {function(*): *} f - Function to apply on each element of xs
 * @param {Array.<*>} xs - Consumed Array
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 */
exports.concatMap = concatMap = function concatMap(f, xs) {
  return apply(concat, map(f, xs));
};

/**
 * Mapkv f over obj then concats the result
 * @function
 * @param {function(*): *} f - Function to apply on each element of obj
 * @param {object} obj - Consumed JS Object
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see fmap
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 */
exports.concatMapkv = concatMapkv = function concatMapkv(f, obj) {
  return apply(concat, mapkv(f, obj));
};

/**
 * Returns an array of the items in coll for which pred(x) returns true
 * fitler returns a shallow copy of the array elements
 * @function
 * @param {function(*): boolean} pred - Function to apply on each element of xs
 * @param {Array.<*>} xs - Array to filter
 * @returns {Array.<*>} Filtered Array
 */
exports.filter = filter = function filter(pred, xs) {
  //// [].filter
  //return callWith([].filter, xs, arity1(pred));

  // Own version (faster)
  var ys = [];
  loop(function(_, x) {
    if (pred(x)) ys.push(x);
  }, xs);
  return ys;
};

/**
 * Sort element of an array.
 * You can pass a sorter function to sort.
 * Wrapper for the [].sort function.
 * sort returns a shallow copy of the array elements
 * @@todo Use quicksort
 * @function
 * @param {function=} [pred=undefined] - Function to apply on each element of xs
 * @param {Array.<*>} xs - Array to sort
 * @returns {Array.<*>} Sorted Array
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort|MDN - sort}
 */
exports.sort = sort = function sort(comp, xs) {
  if (isUndefined(xs)) {
    xs = comp;
    comp = void 8;
  }
  var i = xs.length, ys = Array(i);
  loop(function(i, x) {
    ys[i] = x;
  }, xs);
  return callWith([].sort, ys, comp);
};

/**
 * Returns a shuffled Array
 * shuffle returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>} xs - Array to shuffle
 * @returns {Array.<*>} Shuffled Array
 */
exports.shuffle = shuffle = function shuffle(xs) {
  var ys = Array(xs.length);
  for (i in xs) {
    var r = randInt(i);
    ys[i] = ys[r];
    ys[r] = xs[i];
  }
  return ys;
};

/**
 * Zips arrays together.
 * zip returns a shallow copy of the array elements
 * @function
 * @param {...Array.<*>} arrays - Arrays to zip
 * @returns {Array.<*>} Zipped arrays
 * @example
 *   zip([1, 2, 3], [4, 5, 6]) // returns [[1, 4], [2, 5], [3, 6]]
 */
exports.zip = zip = function zip() {
  var ret = [],
      args = arguments,
      len = apply(min , map(exports.len, args));
  if (args.length == 1) return first(args);
  for (var i = 0; i < len; i++) {
    ret.push(map(exports.cfget(i), args));
  }
  return ret;
};

/**
 * Flattens an ArrayLike object
 * flatten returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>|Argument.<*>} xs - ArrayLike object to flatten
 * @returns {Array.<*>} ArrayLike object flattened
 * @see isArrayLike
 */
exports.flatten = flatten = function flatten(xs) {
  return reduce(function(acc, value) {
    return concat(acc, isArrayLike(value) ? flatten(value) : [value]);
  }, xs, []);
};

/**
 * Returns min value
 * @function
 * @param {...number} numbers
 * @returns {number}
 */
exports.min = min = function min() {
  return reduce(Math.min, arguments);
};

/**
 * Returns max value
 * @function
 * @param {...number} numbers
 * @returns {number}
 */
exports.max = max = function max() {
  return reduce(Math.max, arguments);
};

/**
 * Wrapper for the Math.random function.
 * rand returns a random floating point number between 0 and n (default 1).
 * @function
 * @param {number=} [n=1] - Random number max limit
 * @returns {number}
 * @see randInt
 * @see randIndex
 */
exports.rand = rand = function rand() {
  var n = first(arguments)||1;
  return Math.random() * n;
};

/**
 * Returns a random integer between 0 and n.
 * randInt() always returns 0.
 * @function
 * @param {number} n - Random number max limit
 * @returns {number}
 * @see rand
 * @see randIndex
 */
exports.randInt = randInt = function randInt(n) {
  return parseInt(rand(n));
};

/**
 * Returns a random item of xs
 * randIndex returns a shallow copy of the array element
 * @function
 * @param {Array.<*>} xs
 * @returns {*} Random element of xs
 * @see rand
 * @see randInt
 */
exports.randIndex = randIndex = function randIndex(xs) {
  return xs[randInt(xs.length)];
};

/**
 * Calls function f n times.
 * times is a side-effects only function
 * @function
 * @param {number} n
 * @param {function} f
 * @returns {undefined}
 */
exports.times = times = function times(n, f) {
  while (n--)
    apply(f, slice(arguments, 2));
};

/**
 * Returns an Array containing the items of xs
 * while pred(item) is true.
 * takeWhile returns a shallow copy of the array elements
 * @function
 * @param {function(*): boolean} pred - Predicate function
 * @param {Array.<*>} xs - Array to consume
 * @returns {Array.<*>} Filtered Array
 * @see dropWhile
 */
exports.takeWhile = takeWhile = function takewhile(pred, xs) {
  for (var i = 0; i < xs.length && pred(xs[i]); i++);
  return slice(xs, 0, i);
};

/**
 * Drops all the items of xs while pred(item) is true
 * and returns all the remaining items as an Array
 * dropWhile returns a shallow copy of the array elements
 * @function
 * @param {function(*): boolean} pred - Predicate function
 * @param {Array.<*>} xs - Array to consume
 * @returns {Array.<*>} Filtered Array
 * @see takeWhile
 */
exports.dropWhile = dropWhile = function dropwhile(pred, xs) {
  for (var i = 0; i < xs.length && pred(xs[i]); i++);
  return slice(xs, i);
};

/**
 * Returns an array of the elements of xs separated of sep
 * interpose returns a shallow copy of the array elements
 * @function
 * @param {*} sep - The separator object
 * @param {Array.<*>} xs - Array to separate
 * @returns {Array.<*>} Separated Array
 * @example
 *   interpose(0, [1, 2, 3]) // returns [1, 0, 2, 0, 3]
 */
exports.interpose = interpose = function interpose(sep, xs) {
  var len = xs.length * 2 - 1, ret = [];
  for (var i = 0; i < len; i++)
    ret.push(odd(i) ? sep : xs[i/2]);
  return ret;
};

/**
 * Returns an array of the first item in each array, then the second etc
 * interleave returns a shallow copy of the array elements
 * @function
 * @param {...Array.<*>} arrays - Arrays to interleave
 * @returns {Array.<*>} Interleaved Array
 * @example
 *   interleave([1, 2], [4, 5], [7, 8]) // returns [1, 4, 7, 2, 5, 8]
 */
exports.interleave = interleave = function interleave() {
  return apply(comp(flatten, zip), arguments);
};

/**
 * Returns the keys of a JS Object
 * @function
 * @param {object} obj
 * @returns {Array.<*>}
 * @example
 *   keys({a: 1, b: 2, c: 3}) // ['a', 'b', 'c']
 */
exports.keys = keys = function keys(obj) {
  return mapkv(id, obj);
};

/**
 * Returns the values of a JS Object
 * values returns a shallow copy of the object values
 * @function
 * @param {object} obj
 * @returns {Array.<*>}
 * @example
 *   values({a: 1, b: 2, c: 3}) // [1, 2, 3]
 */
exports.values = values = function values(obj) {
  return mapkv(flip(id), obj);
};

/**
 * Merges a variable number of objects
 * merge returns a shallow copy of the objects values
 * @function
 * @param {...object} jsObjects - JS Objects to merge
 * @return {object} Merged object
 */
exports.merge = merge = function merge() {
  var merge2 = function(obj1, obj2) {
    var ret = {};
    for (k in obj1) ret[k] = obj1[k];
    for (k in obj2) ret[k] = obj2[k];
    return ret;
  };
  return reduce(merge2, arguments, {});
};

/**
 * Assoc key/value to object.
 * Equivalent to `obj[k] = v` but doesn't modify obj.
 * assoc returns a shallow copy of the JS Object
 * @function
 * @param {object} obj
 * @param {string|number} key
 * @param {*} value
 * @returns {object}
 */
exports.assoc = assoc = function assoc(obj, key, value) {
  var ret = {};
  for  (k in obj) ret[k] = obj[k];
  ret[key] = value;
  return ret;
};

/**
 * Converts an array of pairs into an object
 * marshal returns a shallow copy of the array elements
 * @function
 * @param {Array.<Array(2)>} xs - Array of pairs
 * @returns {object} Marshalized object
 * @example
 *   marshal([['a', 1], ['b', 2], ['c', 3]]) // returns {a: 1, b: 2, c: 3}
 */
exports.marshal = marshal = function marshal(xs) {
  return reduce(function(agg, x) {
    agg[first(x)] = second(x);
    return agg;
  }, xs, {});
};

/**
 * Converts an object into an array of pairs
 * unmarshal returns a shallow copy of the object elements
 * @function
 * @param {object} obj - JS Object
 * @returns {Array.<Array(2)>} - Unmarshalized object
 * @example
 *   unmarshal({a: 1, b: 2, c: 3}) // returns [['a', 1], ['b', 2], ['c', 3]]
 */
exports.unmarshal = unmarshal = function unmarshal(obj) {
  return mapkv(function(k, v) {
    return [k, v];
  }, obj);
};

/**
 * Prepends x to xs.
 * cons returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>} xs
 * @param {*} x
 * @returns {Array.<*>}
 * @example
 *   cons([2, 3], 1) // returns [1, 2, 3]
 */
exports.cons = cons = function cons(xs, x) {
  return concat([x], xs);
};

/**
 * Appends arguments to xs.
 * conj returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>} xs
 * @param {...*} args
 * @returns {Array.<*>}
 * @example
 *   conj([1, 2], 3) // returns [1, 2, 3]
 *   conj([1, 2], 3, 4, 5) // returns [1, 2, 3, 4, 5]
 */
exports.conj = conj = function conj(xs) {
  return concat(xs, butfirst(arguments));
};

/**
 * Drops the n first elements of xs
 * drop returns a shallow copy of the array elements
 * @function
 * @param {number} n
 * @param {Array.<*>} xs
 * @returns {Array.<*>}
 */
exports.drop = drop = function drop(n, xs) {
  return slice(xs, n);
};

/**
 * Returns the first element of xs
 * first returns a shallow copy of the first array element
 * @function
 * @param {Array.<*>} xs
 * @returns {*}
 */
exports.first = first = function first(xs) {
  return xs[0];
};

/**
 * Returns all the elements of xs but except first one
 * butfirst returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>}
 * @returns {Array.<*>}
 */
exports.butfirst = butfirst = function butfirst(xs) {
  return slice(xs, 1);
};

/**
 * Returns the second element of xs
 * second returns a shallow copy of the second element of the array
 * @function
 * @param {Array.<*>}
 * @returns {*}
 */
exports.second = second = function second(xs) {
  return xs[1];
};

/**
 * Returns the last elements of xs
 * last returns a shallow copy of the last element of the array
 * @function
 * @param {Array.<*>}
 * @returns {*}
 */
exports.last = last = function last(xs) {
  return xs[xs.length - 1];
};

/**
 * Returns all the elements of xs except the last one
 * butlast returns a shallow copy of the array elements
 * @function
 * @param {Array.<*>}
 * @returns {Array.<*>}
 */
exports.butlast = butlast = function butlast(xs) {
  return slice(xs, 0, -1);
};

/**
 * Similar to obj[i]
 * @function
 * @param {Array.<*>|object} obj - Array or JS Object
 * @param {*} i - Index or Key
 * @returns {*}
 */
exports.get = get = function get(obj, i) {
  return obj[i];
};

/**
 * Object, Array, String and arguments lookup.
 * lookup returns a shallow copy of the found elements
 * @function
 * @param {Array.<*>|object|string} obj - Object to look up into
 * @param {Array.<*>|*} ks - Key(s) to look up
 * @param {?*} notFound - Returned if key(s) is/are not found
 * @returns {*}
 * @example
 *   lookup([1, 2, 3], 0)                            // returns 1
 *   lookup({foo: {bar: [1, 2]}}, ['foo', 'bar', 1]) // returns 2
 *   lookup([1, 2], 4, 'Not Found...')               // returns 'Not Found...'
 */
exports.lookup = lookup = function lookup(xs, ks, notFound) {
  var found = isArrayLike(ks)
    ? eqOne(ks.length)
      ? xs[first(ks)]
      : lookup(xs[first(ks)], butfirst(ks))
    : xs[ks];
  return isUndefined(found) ? notFound : found;
};

/**
 * Sums the elements of an array
 * @function
 * @param {Array.<number>} xs
 * @returns {number}
 */
exports.sum = sum = function sum(xs) {
  return reduce(add, xs);
};

/**
 * Returns the product of the elements of an array
 * @function
 * @param {Array.<number>} xs
 * @returns {number}
 */
exports.product = product = function product(xs) {
  return reduce(mul, xs);
};

/**
 * Returns an array containing n repetitions of the items in xs
 * cycle returns an array containing shallow copies of the elements of xs
 * @function
 * @param {number} n
 * @param {Array.<*>} xs
 * @returns {Array.<*>}
 * @example
 *   cycle(3, [1, 2, 3]) // returns [1, 2, 3, 1, 2, 3, 1, 2, 3]
 */
exports.cycle = cycle = function cycle(n, xs) {
  var ys = [];
  while (n--)
    applyWith([].push, ys, xs);
  return ys;
  };

/**
 * Returns an array containing n times x
 * repeat returns an array containing shallow copies of x
 * @function
 * @param {number} n
 * @param {*} x
 * @returns {Array.<*>}
 * @example
 *   repeat(3, 'a') // returns ['a', 'a', 'a']
 */
exports.repeat = repeat = function repeat(n, x) {
  if (n < 1) return [];
  var xs = [];
  for (var i = 0; i < n; i++)
    xs[i] = x;
  return xs;
};

/**
 * Returns an array containing n times f()
 * @function
 * @param {number} n
 * @param {function} f - Called function
 * @param {...*} args - Arguments for f
 * @returns {Array.<*>}
 * @example
 *   repeatedly(3, function() { return 1 })                   // returns [1, 1, 1]
 *   repeatedly(3, function(x, y) { return 1 + x + y }, 1, 2) // returns [4, 4, 4]
 */
exports.repeatedly = repeatedly = function repeatedly(n, f) {
  if (n < 1) return [];
  var args = slice(arguments, 2);
  var xs = [];
  for (var i = 0; i < n; i++)
    xs[i] = apply(f, args);
  return xs;
};

/**
 * The first argument is a function which takes two arguments,
 * the second one is an array and you may pass a third argument which is an aggregator
 * the aggregator is the first element of xs by default.
 * @function
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next value
 * @param {Array.<*>} xs - Array to consume
 * @param {?*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   reduce(add, [1, 2, 3])    // returns 6
 *   reduce(add, [1, 2, 3], 2) // returns 8
 * @see reducekv
 * @see reducer
 * @see freduce
 * @see freducekv
 * @see freducer
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce|MDN - reduce}
 */
exports.reduce = reduce = function reduce(f, xs, agg) {
  // [].reduce
  if (isUndefined(agg))
    return callWith([].reduce, xs, arity2(f));
  else return callWith([].reduce, xs, arity2(f), agg);

  //// Own version (same benchmarks)
  //var reducer = function(ys, agg) {
  //  if (isEmpty(ys)) return agg;
  //  return reducer(butfirst(ys), call(f, agg, first(ys)));
  //};
  //if (isUndefined(agg))
  //  return reducer(butfirst(xs), first(xs));
  //else return reducer(xs, agg);
};

/**
 * The first argument is a function which takes three arguments,
 * the second one is an array and the third one is an aggregator
 * @function
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next key, the last one the next value
 * @param {object} obj - JS Object to consume
 * @param {*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   var f = function(agg, _, v) { return agg + v }
 *   reducekv(f, {foo: 1, bar: 2, baz: 3}, 0) // returns 6
 *   reducekv(f, {foo: 1, bar: 2, baz: 3}, 2) // returns 8
 * @see reduce
 * @see reducer
 * @see freduce
 * @see freducekv
 * @see freducer
 */
exports.reducekv = reducekv = function reducekv(f, obj, agg) {
  // [].reduce
  if (!isObject(obj)) return callWith([].reduce, obj, arity3(f), agg);

  // Own version (supposedly faster)
  var reducer = function(obj, agg) {
    if (isEmpty(obj)) return agg;
    return reducer(butfirst(obj), call(f, agg, obj[0][0], obj[0][1]));
  };
  return reducer(unmarshal(obj), agg);
};

/**
 * Similar to reduce but starts iteration at the end of the array.
 * @function
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next value
 * @param {Array.<*>} xs - Array to consume
 * @param {?*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   reduce(sub, [10, 2, 5])  // returns 3
 *   reducer(sub, [13, 2, 5]) // returns -7
 * @see reduce
 * @see reducekv
 * @see freduce
 * @see freducekv
 * @see freducer
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight|MDN - reduceRight}
 */
exports.reducer = reducer = function reducer(f, xs, agg) {
  // [].reduceRight
  if (isUndefined(agg))
    return callWith([].reduceRight, xs, arity2(f));
  else return callWith([].reduceRight, xs, arity2(f), agg);

  //// Own version (same benchmarks)
  //var reducer2 = function(ys, agg) {
  //  if (isEmpty(ys)) return agg;
  //  return reducer2(butlast(ys), call(f, agg, last(ys)));
  //};
  //if (isUndefined(agg))
  //  return reducer2(butlast(xs), last(xs));
  //else return reducer2(xs, agg);
};

/**
 * Reverses the elements of an array.
 * reverse returns shallow copy of the elements of array
 * @function
 * @param {Array.<*>} xs
 * @returns {Array.<*>}
 */
exports.reverse = reverse = function reverse(xs) {
  var i = xs.length, ys = Array(i);
  while (i > 0)
    ys[xs.length - i] = xs[--i];
  return ys;
};

/**
 * Applies pred to each items of xs.
 * If pred(item) is true every time, return true.
 * @function
 * @param {function(*): boolean} pred - Predicate function
 * @param {Array.<*>} xs - Array to consume
 * @returns {boolean}
 * @example
 *   var f = function(x) { return x == 1 };
 *   every(f, [1, 1, 1, 1]) // returns true
 *   every(f, [1, 1, 1, 2]) // returns false
 */
exports.every = every = function every(pred, xs) {
  for (i in xs)
    if (xs.hasOwnProperty(i) && !pred(xs[i]))
      return false;
  return true;
};

/**
 * Applies pred to each items of xs.
 * If pred(item) is true, returns true.
 * @function
 * @param {function(*): boolean} pred - Predicate function
 * @param {Array.<*>} xs - Array to consume
 * @returns {boolean}
 * @example
 *   var f = function(x) { return x == 1 };
 *   some(f, [1, 0, 0, 0]) // returns true
 *   some(f, [0, 0, 0, 0]) // returns false
 */
exports.some = some = function some(pred, xs) {
  for (i in xs)
    if (xs.hasOwnProperty(i))
      if (pred(xs[i]))
        return true;
  return false;
};

/**
 * Targeting readability, thread looks like OOP writting.
 * @function
 * @param {*} obj
 * @param {...function(*): *} functions
 * @returns {*}
 * @example
 *   inc(first([1, 3]))
 *   // becomes
 *   thread([1, 3], first, inc) // returns 2
 */
exports.thread = thread = function thread(obj) {
  return apply(flip(comp), butfirst(arguments))(obj);
};

/**
 * Partially applies a function to a variable number of arguments
 * @function
 * @param {function} f - Function to partially apply
 * @param {...*} arguments
 * @returns {function} Partially applied function
 * @example
 *   partial(add, 1)(2) // returns 3
 * @see curry
 * @see curry1
 */
exports.partial = partial = function partial(f) {
  var args = butfirst(arguments);
  return function() {
    return apply(f, concat(args, arguments));
  };
};

/**
 * Allows to curry a function.
 * The arity if by default f.length, but it can be set.
 * @function
 * @param {function} f - Function to curry
 * @param {?number} arity
 * @returns {function} Curried function
 * @example
 *   var cmap = curry(map)
 *   var mapinc = cmap(inc)
 *   mapinc([1, 2, 3]) // returns [2, 3, 4]
 *   mapinc([2, 3, 4]) // returns [3, 4, 5]
 * @example
 *   var cadd = curry(add, 3)
 *   cadd(1)(2)(3) // returns 6
 *   cadd(1, 2)(3) // returns 6
 *   cadd(1)(2, 3) // returns 6
 *   cadd(1, 2, 3) // returns 6
 * @see partial
 * @see curry1
 */
exports.curry = curry = function curry(f, arity) {
  var curried = function(args, arity) {
    return function() {
      if ((arity - arguments.length) > 0)
        return curried(concat(args, arguments), arity - arguments.length);
      else return apply(f, concat(args, arguments));
    };
  };
  return curried([], or(arity, f.length));
};

/**
 * Similar to curry but with arity fixed to 1 for each call.
 * The arity if by default f.length, but it can be set.
 * @function
 * @param {function} f - Function to curry
 * @param {?number} arity
 * @returns {function} Curried function
 * @example
 *   var cmap = curry(map)
 *   var mapinc = cmap(inc)
 *   mapinc([1, 2, 3]) // returns [2, 3, 4]
 *   mapinc([2, 3, 4]) // returns [3, 4, 5]
 * @example
 *   var cadd = curry(add, 3)
 *   cadd(1)(2)(3) // returns 6
 *   cadd(1)(2, 3) // wrong: the second argument here is ignored
 *   cadd(1)(2)()  // returns NaN (unlike curry, curry1 decreases arity at each call
 *                 // So cadd does 1 + 2 + undefined here)
 * @see partial
 * @see curry
 */
exports.curry1 = curry1 = function curry1(f, arity) {
  var curried1 = function(args, arity) {
    return function(arg) {
      if (arity > 1)
        return curried1(conj(args, arg), dec(arity));
      else return apply(f, conj(args, arg));
    };
  };
  return curried1([], or(arity, f.length));
};

/**
 * Sequentially applies each function to a variadic number of arguments
 * then returns an array with the results.
 * @function
 * @param {...function(*)} functions
 * @returns {function(): Array.<*>}
 * @example
 *   juxt(inc, dec)(2) // returns [3, 1]
 */
exports.juxt = juxt = function juxt() {
  var fs = arguments;
  return function() {
    var args = arguments;
    return map(function(f) {
      return apply(f, args);
    }, fs);
  };
};

/**
 * Flips the arguments given to a function.
 * @function
 * @param {function} f
 * @returns {function}
 * @example
 *   div(10, 2)       // returns 5
 *   flip(div)(10, 2) // returns 0.2
 */
exports.flip = flip = function flip(f) {
  return function() {
    return apply(f, reverse(arguments));
  };
};

/**
 * Flips the arguments given to drop
 * @function
 * @param {Array.<*>} xs
 * @param {number} n
 * @returns {Array.<*>}
 */
exports.fdrop = fdrop = flip(drop);

/**
 * Flips the arguments given to get
 * @function
 * @param {*} i - Index or Key
 * @param {Array.<*>|object} obj - Array or JS Object
 * @returns {*}
 */
exports.fget = fget = flip(get);

/**
 * Flips the arguments given to map
 * @function
 * @param {Array.<*>} xs - Consumed Array
 * @param {function(*): *} f - Function to apply on each element of xs
 * @returns {Array.<*>}
 * @example
 *   map(partial(add, 2), [1, 2, 4]) // returns [3, 4, 6]
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmapo
 * @see fmapkv
 * @see fmapkvo
 */
exports.fmap = fmap = flip(map);

/**
 * Flips the arguments given to mapo
 * @function
 * @param {object} obj - Consumed JS Object
 * @param {function(*): *} f - Function to apply on each element of obj
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapkv
 * @see fmapkvo
 */
exports.fmapo = fmapo = flip(mapo);

/**
 * Flips the arguments given to mapkv
 * @function
 * @param {object} obj - Consumed JS Object
 * @param {function(*): *} f - Function to apply on each element of obj
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkvo
 */
exports.fmapkv = fmapkv = flip(mapkv);

/**
 * Flips the arguments given to mapkvo
 * @function
 * @param {object} obj - Consumed JS Object
 * @param {function(*): *} f - Function to apply on each element of obj
 * @returns {Array.<*>}
 * @see map
 * @see mapo
 * @see mapkv
 * @see mapkvo
 * @see concatMap
 * @see concatMapkv
 * @see fmap
 * @see fmapo
 * @see fmapkv
 */
exports.fmapkvo = fmapkvo = flip(mapkvo);

/**
 * Flips the arguments given to reduce.
 * The aggregator remains the third and last argument.
 * @function
 * @param {Array.<*>} xs - Array to consume
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next value
 * @param {?*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   freduce([2, 3], mul)    // returns 6
 *   freduce([2, 3], mul, 2) // returns 12
 * @see reduce
 * @see reducekv
 * @see reducer
 * @see freducekv
 * @see freducer
 */
exports.freduce = freduce = function freduce(xs, f, agg) {
  return reduce(f, xs, agg)
};

/**
 * Flips the arguments given to reducekv.
 * The aggregator remains the third and last argument.
 * @function
 * @param {object} obj - JS Object to consume
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next key, the last one the next value
 * @param {?*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   var obj = {foo: 1, bar: 2, baz: 3}
 *   var f = function(agg, _, v) { return agg * v }
 *   freducekv(obj, f, 1) // returns 6
 *   freducekv(obj, f, 2) // returns 12
 * @see reduce
 * @see reducekv
 * @see reducer
 * @see freduce
 * @see freducer
 */
exports.freducekv = freducekv = function freducekv(obj, f, agg) {
  return reducekv(f, obj, agg)
};

/**
 * Flips the argument given to reducer.
 * The aggregator remains the third and last argument.
 * @function
 * @param {Array.<*>} xs - Array to consume
 * @param {function(*, *): *} f - Reducer function, the first arguments is the aggregator, the second one the next value
 * @param {?*} agg - Defined aggregator
 * @returns {*} Reduced value
 * @example
 *   freducer([3, 2, 10], sub) // returns 5
 * @see reduce
 * @see reducekv
 * @see reducer
 * @see freduce
 * @see freducekv
 */
exports.freducer = freducer = function freducer(xs, f, agg) {
  return reducer(f, xs, agg);
};

/**
 * console.log and returns the given argument(s)
 * @function
 * @param {...*} arguments
 * @returns {*|Array.<*>}
 */
exports.log = log = cs('log');

/**
 * console.log and returns the first argument given
 * @function
 * @param {*} obj
 * @returns {*}
 */
exports.log1 = log1 = arity1(log);

/**
 * console.dir and returns the given argument(s)
 * @function
 * @param {...*} arguments
 * @returns {*|Array.<*>}
 */
exports.dir = dir = cs('dir');

/**
 * console.dir and returns the first argument given
 * @function
 * @param {*} obj
 * @returns {*}
 */
exports.dir1 = dir1 = arity1(dir);

/**
 * console.warn and returns the given argument(s)
 * @function
 * @param {...*} arguments
 * @returns {*|Array.<*>}
 */
exports.warn = warn = cs('warn');

/**
 * console.warn and returns the first argument given
 * @function
 * @param {*} obj
 * @returns {*}
 */
exports.warn1 = warn1 = arity1(warn);

/**
 * console.error and returns the given argument(s)
 * @function
 * @param {...*} arguments
 * @returns {*|Array.<*>}
 */
exports.error = error = cs('error');

/**
 * console.error and returns the first argument given
 * @function
 * @param {*} obj
 * @returns {*}
 */
exports.error1 = error1 = arity1(error);

/**
 * Uses console.time and console.timeEnd to calculate
 * the time taken by a given function and returns its value.
 * Remainings arguments are given to function.
 * @function
 * @param {function} f
 * @param {string=} [fname=f.name] - Name of the function
 * @param {...*} arguments - Arguments given to f (if provided, fname is mandatory)
 * @returns {*}
 */
exports.time = time = function time(f, fname) {
  var label = '#' + (f.name || fname || 'unknown') + ' #fjs-time-label-' + (new Date).getTime();
  var args = slice(arguments, 2);
  console.time(label);
  var ret = apply(f, args);
  console.timeEnd(label);
  return ret;
};

/**
 * Returns an array.
 * Step must be positive.
 * @function
 * @param {number} min_or_max - Minimum value if max is provided, otherwise, Maximum value
 * @param {?number} max - Maximum value (not included)
 * @param {?number=} [step=1] - Step
 * @returns {Array.<number>}
 * @example
 *   range(5)        // returns [0, 1, 2, 3, 4]
 *   range(3, 6)     // returns [3, 4, 5]
 *   range(3, 10, 2) // returns [3, 5, 7, 9]
 */
exports.range = range = function range() {
  var args = arguments;
  switch(args.length) {
  case 1: return range(0, first(args), 1); break;
  case 2: return range(first(args), second(args), 1); break;
  case 3:
    var xs = [], min = args[0], max = args[1], step = (args[2] > 0) ? args[2] : 1;
    if (min >= max) return [];
    do xs.push(min); while ((min+=step) < max)
    return xs;
  }
};

/**
 * Pending version of range.
 * @function
 * @param {number} min_or_max - Minimum value if max is provided, otherwise, Maximum value
 * @param {?number} max - Maximum value (not included)
 * @param {?number=} [step=1] - Step
 * @returns {function(): Array.<number>}
 * @example
 *   var r = xrange(3) // returns function() {...}
 *   r()               // returns [0, 1, 2]
 */
exports.xrange = xrange = function xrange() {
  var args = arguments;
  return function() {
    return apply(range, args);
  };
};

/**
 * Returns wether x equals y or not.
 * eq does a deep comparison of x and y.
 * @function
 * @param {*} x
 * @param {*} y
 * @returns {boolean}
 * @see and
 * @see eq2
 * @see eq3
 * @see gt
 * @see gte
 * @see lt
 * @see lte
 * @see neq2
 * @see neq3
 * @see not
 * @see or
 * @see xor
 */
exports.eq = eq = function eq(x, y) {
  var args = arguments;
  var eq2 = function(x, y) {
    switch(true) {
    case isArrayLike(x) && isArrayLike(y):
      if (x.length === y.length) {
        for (var i = 0; i < x.length; i++)
          if (!eq(x[i], y[i]))
            return false;
        return true;
      } else return false;
    case isObject(x) && isObject(y):
      if (eq(keys(x), keys(y))) {
        for (i in x)
          if (!eq(x[i], y[i]))
            return false;
        return true;
      } else return false;
    default:
      return x === y;
    }
  };
  var reducer = function(x, y, rest) {
    if (rest.length == 1) return eq2(x, y);
    return eq2(x, y) && reducer(rest[0], rest[1], slice(rest, 1));
  };
  return reducer(args[0], args[1], slice(args, 1));
};

/**
 * Returns true if x is even
 * @function
 * @param {number} x
 * @returns {boolean}
 * @see odd
 */
exports.even = even = function even(x) {
  return (x & 1) === 0;
};

/**
 * Returns true if x is odd
 * @function
 * @param {number} x
 * @returns {boolean}
 * @see even
 */
exports.odd = odd = complement(even);

/**
 * Returns a number one greater than x
 * @function
 * @param {number} x
 * @returns {number}
 * @see dec
 */
exports.inc = inc = function inc(x) {
  return x + 1;
};

/**
 * Returns a number one less than x
 * @function
 * @param {number} x
 * @returns {number}
 * @see inc
 */
exports.dec = dec = function dec(x) {
  return x - 1;
};

/**
 * Returns true if x equals 0
 * @function
 * @param {number} x
 * @returns {boolean}
 * @see eqOne
 */
exports.eqZero = eqZero = function eqZero(x) {
  return x === 0;
};

/**
 * Returns true if x equals 1
 * @function
 * @param {number} x
 * @returns {boolean}
 * @see eqZero
 */
exports.eqOne = eqOne = function eqOne(x) {
  return x === 1;
};

/**
 * Returns true if x is empty.
 * Works on objects, arrays and strings.
 * @function
 * @param {Array.<*>|object|string} x
 * @returns {boolean}
 * @throws {ArgumentError} If x is not an Array, a String or a JS Object
 * @see is
 * @see isa
 * @see areArguments
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isEmpty = isEmpty = function isEmpty(x) {
  switch(true) {
  case(isArrayLike(x) || isString(x)): return eqZero(x.length);
  case(isObject(x)): return isEmpty(keys(x));
    default: throw new ArgumentError('x must be an Array, a String or an Object');
  }
};

/**
 * Returns true if x is an Object
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isObject = isObject = function isObject(x) {
  return is('Object')(x) && !isFunction(x);
};

/**
 * Returns true if x is an Array
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isArray = isArray = is('Array');

/**
 * Returns true if x is a String
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isTrue
 * @see isUndefined
 */
exports.isString = isString = is('String');

/**
 * Returns true if x is a Function
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isFunction = isFunction = is('Function');

/**
 * Returns true if x is a Date
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isDate = isDate = is('Date');

/**
 * Returns true if x is an instance of Arguments
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.areArguments = areArguments = is('Arguments');

/**
 * Returns true if x is an Array or an instance of Arguments
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isArrayLike = isArrayLike = function isArrayLike(x) {
  return isArray(x) || areArguments(x);
};

/**
 * Returns true if x is a Number
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isNumber = isNumber = is('Number');

/**
 * Returns true if x is a Boolean
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isBoolean = isBoolean = is('Boolean');

/**
 * Returns true if x is a Float.
 * Notice: isFloat(1.0) returns false.
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isFloat = isFloat = function isFloat(x) {
  return isNumber(x) && (parseFloat(x) != parseInt(x));
};

/**
 * Returns true if x is an Int
 * Notice: isInt(1.0) returns true.
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isInt = isInt = function isInt(x) {
  return isNumber(x) && !isFloat(x);
};

/**
 * Returns true if x is true
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isUndefined
 */
exports.isTrue = isTrue = function isTrue(x) {
  return x === true;
};

/**
 * Returns true if x is false
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isFalse = isFalse = function isFalse(x) {
  return x === false;
};

/**
 * Returns true if x is null
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 * @see isUndefined
 */
exports.isNull = isNull = function isNull(x) {
  return x === null;
};

/**
 * Returns true if x is undefined
 * @function
 * @param {*} x
 * @returns {boolean}
 * @see is
 * @see isa
 * @see areArguments
 * @see isArray
 * @see isArrayLike
 * @see isBoolean
 * @see isDate
 * @see isEmpty
 * @see isFalse
 * @see isFloat
 * @see isFunction
 * @see isInt
 * @see isNull
 * @see isNumber
 * @see isObject
 * @see isString
 * @see isTrue
 */
exports.isUndefined = isUndefined = function isUndefined(x) {
  return x === void 8;
};

/**
 * Returns the sum of given arguments.
 * add() returns 0
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see mul
 * @see sub
 * @see div
 * @see pow
 * @see sqrt
 */
exports.add = add = function add() {
  return reduce(function(x, y) {
    return x + y;
  }, arguments, 0);
};

/**
 * Returns the product of given arguments.
 * mul() returns 1
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see add
 * @see sub
 * @see div
 * @see pow
 * @see sqrt
 */
exports.mul = mul = function mul() {
  if (isEmpty(arguments)) return 1;
  return reduce(function(x, y) {
    return x * y;
  }, arguments);
};

/**
 * Subtracts the remaining arguments to the first one.
 * sub() returns 0
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see add
 * @see mul
 * @see div
 * @see pow
 * @see sqrt
 */
exports.sub = sub = function sub() {
  if (isEmpty(arguments)) return 0;
  return reduce(function(x, y) {
    return x - y;
  }, arguments);
};

/**
 * Divides the first argument with the others.
 * div() returns 1
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see add
 * @see mul
 * @see sub
 * @see pow
 * @see sqrt
 */
exports.div = div = function div() {
  if (isEmpty(arguments)) return 1;
  return reduce(function(x, y) {
    return x / y;
  }, arguments);
};

/**
 * Wrapper for the Math.pow function
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see add
 * @see mul
 * @see sub
 * @see div
 * @see sqrt
 */
exports.pow = pow = function pow(x, y) {
  return Math.pow(x, y);
};

/**
 * Wrapper for the Math.sqrt function
 * @function
 * @param {...number} numbers
 * @returns {number}
 * @see add
 * @see mul
 * @see sub
 * @see div
 * @see pow
 * @see sqrt
 */
exports.sqrt = sqrt = function sqrt(x) {
  return Math.sqrt(x);
};

// Convert args to Object which can be used by use and del
var parseArgs = function(args) {
  return merge(apply(merge, filter(isObject, args)),
               marshal(map(partial(repeat, 2), filter(isString, args))));
};

/**
 * May be really messy!
 * Uses in main scope some of the fjs functions.
 * use is a side-effect only function
 * @function
 * @param {string|Array.<string|object>} varnames = Can be a variable number of strings
 * @returns {undefined}
 * @throws {Error} If fjs does not include a required variable
 * @example
 *   fjs.use('map', 'inc')
 *   map(inc, [1, 2, 3]) // returns [2, 3, 4]
 *   fjs.del('map', 'inc')
 *   map(inc, [1, 2, 3]) // throws exceptions
 * @example
 *   var vars = ['fmap', 'dec']
 *   fjs.use(vars)
 *   fmap([1, 2, 3], dec) // returns [0, 1, 2]
 *   fjs.del(vars)
 *   fmap([1, 2, 3], dec) // throws exceptions
 * @example
 *   var vars = [{inc: 'inc2', dec: 'dec2'}, 'map']
 *   fjs.use(vars)
 *   map(inc2, [1, 2, 3]) // returns [2, 3, 4]
 *   map(dec2, [1, 2, 3]) // returns [0, 1, 2]
 *   fjs.del(vars)
 *   map(inc2, [1, 2, 3]) // throws exceptions
 *   map(dec2, [1, 2, 3]) // throws exceptions
 * @see useAll
 * @see del
 */
exports.use = function use() {
  loop(function(fjsname, parentname) {
    if (exports.hasOwnProperty(fjsname)) {
      if (this[parentname]) warn('"' + parentname + '" has  been replaced by fjs.' + fjsname);
      this[parentname] = exports[fjsname];
    }
    else throw new Error('"' + fjsname + '" is not defined in fjs!');
  }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
};

/**
 * May be really messy!
 * Uses all the exported function of fjs in the current scope.
 * useAll is a side-effect only function
 * @function
 * @returns {undefined}
 * @see use
 * @see del
 */
exports.useAll = function useAll() {
  apply(exports.use, filter(function(key) {
    return key != 'use' && key != 'useAll' && key != 'del';
  }, keys(exports)));
};

/**
 * May be really messy!
 * Deletes variables in the main scope.
 * Handy when you want to clean the scope after using fjs variables.
 * del is a side-effect only function
 * @function
 * @param {string|Array.<string|object>} varnames = Can be a variable number of strings
 * @returns {undefined}
 * @see use
 * @see useAll
 */
exports.del = function del() {
  loop(function(_, parentname) {
    delete this[parentname];
  }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
};

// Currying
// --------

(function() {
  // Exports curried version of functions with a known arity
  var fs = ['apply', 'applyWith', 'assoc', 'cons', 'cycle', 'drop', 'dropWhile',
            'every', 'filter', 'get', 'loop', 'map', 'mapo', 'mapkv', 'mapkvo',
            'pow', 'repeat', 'repeatedly', 'some', 'takeWhile'];
  loop(function(_, v) {
    exports['c'+v] = curry(exports[v]);
  }, fs);

  // Exports curried version of functions with an arity set at 2
  var fs2 = ['add', 'and', 'conj', 'div', 'eq', 'eq2', 'eq3', 'fdrop', 'fget',
             'fmap', 'fmapo', 'fmapkv', 'fmapkvo', 'gt', 'gte', 'lt', 'lte', 'mul',
             'neq2', 'neq3','or', 'sub', 'xor'];
  loop(function(_, v) {
    exports['c'+v] = curry(exports[v], 2);
  }, fs2);

  /**
   * Also, all the functions present in curriedFunctions are available curried * simply prefixed with a 'c':
   * 'add', 'and', 'apply', 'applyWith', 'assoc', 'conj', 'cons', 'cycle', 'div', 'drop', 'dropWhile', 'eq',
   * 'eq2', 'eq3', 'every', 'fdrop', 'fget', 'filter', 'fmap', 'fmapo', 'fmapkv', 'fmapkvo', 'get', 'gt', 'gte',
   * 'loop', 'lt', 'lte', 'map', 'mapo', 'mapkv', mapkvo', 'mul', 'neq2', 'neq3', 'or', 'pow', 'repeat', 'repeatedly', 'some',
   * 'sub', 'takeWhile' and 'xor'
   * @name curriedFunctions
   */
  exports.curriedFunctions = sort(concat(fs, fs2));
})();

// Version
// -------

(function() {
  /**
   * Returns the current version of fjs
   * @function
   * @returns {string}
   */
  exports.version = function() {
    return join(values(exports.versionDetails), '.');
  };
  /**
   * Fjs current version details
   * @name versionDetails
   */
  exports.versionDetails = {major: 0, minor: 17, patch: 0};
})();
