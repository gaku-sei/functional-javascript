//_core
//  Internal functions.
//  They are not supposed to be used in your project.
//  BTW some of them could be useful (like _for or _proxy).

//#_for
//  Wrapper for the for statement.
var _for = function(xs, f) {
  for(var i in xs)
    if(xs.hasOwnProperty(i))
      f.call(null, xs[i], i, xs);
  return null;
};

//#_is
//  General purpose type checker.
//  BTW it's only used in isArray, isObject and isString.
var _is = function(type) {
  return function(x) {
    return second(toString.call(x).match(/\s(\w+)\]$/i)) == type;
  };
};

//#_cloneArray:
//  Recursively clones an Array.
var _cloneArray = function(x) {
  return map(x, clone);
};

//#_cloneObject:
//  Recursively clones an Object.
var _cloneObject = function(x) {
  var y = {};
  _for(x, function(v, k) {
    y[k] = clone(v);
  });
  return y;
};

//#_proxy
//  Use with caution as _proxy may leads to cryptic errors!
//  Limit the arguments given to a function.
//  e.g.: _proxy(2)(add)(2,7,6) //=> 9
//  The first two arguments only are passed to the function add.
var _proxy = function(n) {
  return function(f) {
    return function() {
      return apply(f, slice(arguments, 0, n));
    };
  };
};

var _proxy0 = _proxy(0);

var _proxy1 = _proxy(1);

var _proxy2 = _proxy(2);

//#_console
//  Wrapper for the console object.
//  The function returned by _console itself returns its arguments.
//  e.g.: map(_console("log")(1,2), inc) // logs [1,2] then returns [2,3]
//        add(_console("log")(1), 2) // logs 1 then returns 3
var _console = function(met) {
  return function() {
    if(arguments.length < 2)
      var x = first(arguments);
    else var x = slice(arguments);
    console[met](x);
    return x;
  };
};

//core
//  General purpose functions.

//#forEach
//  Alias for _for.
//  Defined here for readability.
var forEach = _for;

//#id
//  Returns self.
var id = function(x) {
  return x;
};

//#clone
//  General purpose clone function.
//  The Objects and Arrays are mutable in JS
//  clone allows to bypass this with ease.
var clone = function(x) {
  switch(true) {
  case isArray(x):  return _cloneArray(x);
  case isObject(x): return _cloneObject(x);
  default: return x;
  }
};

//#apply
//  Applies a function to an array of arguments.
var apply = function(f, args) {
  if(!isArrayLike(args))
    throw Error("args must be an array or some arguments");
  return f.apply(null, args);
};

//#call
//  Applies a function to a variable number of arguments.
var call = function(f) {
  return apply(f, butfirst(arguments));
};

//#slice
//  Loosely based on the function Array.prototype.slice.
//  e.g.: slice(arguments) // similar to [].slice.call(arguments)
//        slice([1,2,3,4], 1,3) // [2, 3]
//        slice([1,2,3], -1) // [3]
var slice = function(xs) {
  var args = [].slice.call(arguments).slice(1);
  return [].slice.apply(xs, args);
};

//#join
//  Based on Array.prototype.join, join replaces "," with "".
//  e.g.: join(["foo", "bar"]) // "foobar"
var join = function(xs) {
  return [].join.call(xs, second(arguments)||"");
};

//#concat2
//  Appends the content of ys to xs.
var concat2 = function(xs, ys) {
  var xs = slice(xs||[]), ys = slice(ys||[]); //Bruteforce: change that
  if([].concat)
    return [].concat.call(xs, ys);
  else throw Error("Array.prototype.concat not found!"); //Raises for the moment
  //return conj.call(null, xs, ys);
};

//#concat
//  Like concat2 but variadic.
var concat = function() {
  return reduce(arguments, concat2, []);
};

//#map
//  The very famous map function!
//  e.g.: map([1,2,4], partial(add, 2)) // [3,4,6]
var map = function(xs, f) {
  if([].map) return [].map.call(xs, f);
  var ys = [];
  _for(xs, function() {
    ys.push(apply(f, arguments));
  });
  return ys;
};

//#times
//  Calls function f n times.
var times = function(n, f) {
  for(var i = 0; i < n; ++i)
    call(f, i);
};

//#cons
//  Prepends x to xs.
//  e.g.: cons([2,3], 1) // [1,2,3]
var cons = function(xs, x) {
  return concat([x], xs);
};

//#conj
//  Appends x to xs.
//  e.g.: conj([1,2], 3) // [1,2,3]
var conj = function(xs) {
  var ys = clone(xs);
  [].push.apply(ys, butfirst(arguments));
  return ys;
};

//#first
//  Returns the first element of xs.
var first = function(xs) {
  return xs[0];
};

//#butfirst
//  Returns all the elements of xs but the first one.
var butfirst = function(xs) {
  return slice(xs, 1, xs.length);
};

//#second
//  Returns the second element of xs.
var second = function(xs) {
  return xs[1];
};

//#last
//  Returns the last elements of xs.
var last = function(xs) {
  return xs[xs.length - 1];
};

//#butlast
//  Returns all the elements of xs but the last one.
var butlast = function(xs) {
  return slice(xs, 0, xs.length - 1);
};

//#sum
//  Sums the elements of an array.
var sum = function(xs) {
  return reduce(xs, add);
};

//#repeat
//  Returns an array containing n times x.
var repeat = function(x, n) {
  if(n > 0)
    return conj(repeat(x, dec(n)), x);
  else return [];
};

//#cycle
//  Returns an array containing n repetitions of the items in xs.
var cycle = function(xs, n) {
  if(n > 0)
    return concat2(cycle(xs, dec(n)), xs);
  else return [];
};

//#reduce0
//  Unlike reduce, reduce0 does not take any aggregator.
var reduce0 = function(xs, f) {
  return [].reduce.call(xs, _proxy2(f));
};

//#reduce
//  Based on Array.prototype.reduce.
var reduce = function(xs, f) {
  return [].reduce.call(xs, _proxy2(f), arguments[2]||0);
};

//#reverse
//  Reverse the element of an array.
var reverse = function(xs) {
  return reduce(xs, cons, []);
};

//#every
//  Based on Array.prototype.every.
var every = function(xs, f) {
  return [].every.call(xs, f);
};

//#some
//  Based on Array.prototype.some.
var some = function(xs, f) {
  return [].some.call(xs, f);
};

//#comp
//  Composes two functions (more in the future).
//  e.g.: comp(partial(add, 1), partial(mul, 2))(2) // 5
var comp = function(f, g) {
  return function() {
    return call(f, apply(g, arguments));
  };
};//should be variadic

//#partial
//  Partially apply a function to a variable number of arguments.
//  e.g.: partial(add, 1)(2) // 3
var partial = function(f) {
  var args = butfirst(arguments);
  return function() {
    return apply(f, concat(args, arguments));
  };
};

//#juxt
//  Sequentially applies each function to a variadic number of arguments
//  then returns an array with the results.
//  e.g.: juxt(inc, dec)(2) // [3,1]
var juxt = function() {
  var fs = arguments;
  return function() {
    var args = arguments;
    return map(fs, function(f) {
      return apply(f, args);
    });
  };
};

//#flip
//  Flips the arguments given to a function.
//  e.g.: div(10, 2) // 5
//        flip(div)(10, 2) // 0.2
var flip = function(f) {
  return function() {
    return apply(f, reverse(arguments));
  };
};

//#fmap
//  Flips the map arguments.
var fmap = flip(map);

//#feach
//  Flips the forEach arguments.
//  e.g.: var log1Each = partial(feach, log1);
var feach = flip(forEach);

//#freduce
//  Flips the reduce arguments.
var freduce = flip(reduce);

//#log
//  console.log and returns the argument(s) given.
var log = _console("log");

//#log1
//  console.log and returns the first argument given.
var log1 = _proxy1(_console("log"));

//#warn
//  console.warn and returns the argument(s) given.
var warn = _console("warn");

//#warn1
//  console.warn and returns the first argument given.
var warn1 = _proxy1(_console("warn"));

//#error
//  console.error and returns the argument(s) given.
var error = _console("error");

//#error1
//  console.error and returns the first argument given.
var error1 = _proxy1(_console("error"));

//#eq
//  Returns wether x equals y or not.
var eq = function(x, y) {
  return x === y;
};//will evolve

//core.predicates
var even = function(x) {
  return eqZero(x & 1);
};

var odd = function(x) {
  return !even(x);
};

var inc = function(x) {
  return x + 1;
};

var dec = function(x) {
  return x - 1;
};

var eqZero = function(x) {
  return x === 0;
};

var eqOne = function(x) {
  return x === 1;
};

var isEmpty = function(x) {
  switch(true) {
  case(isArray(x) || isString(x)): return eqZero(x.length);
  case(isObject(x)): for(i in x) return false; return true;
  default: throw Error("x must be an Array, a String or an Object");
  }
};

var isObject = function(x) {
  return _is("Object")(x) && !isFunction(x);
};

var isArray = _is("Array");

var isString = _is("String");

var isFunction = function(x) {
  return typeof x === "function";
};

var isArgument = function(x) {
  if(isNull(x) || isUndefined(x)) return false;
  return x.toString && x.toString() === "[object Arguments]";
};

var isArrayLike = function(x) {
  return isArray(x) || isArgument(x);
};

var isTrue = function(x) {
  return x === true;
};

var isFalse = function(x) {
  return x === false;
};

var isNull = function(x) {
  return x === null;
};

var isUndefined = function(x) {
  return x === undefined;
};

//core.reducers
var add = function() {
  return reduce(arguments, function(x, y) {
    return x + y;
  }, 0);
};

var sub = function() {
  if(isEmpty(arguments)) return 0;
  return reduce0(arguments, function(x, y) {
    return x - y;
  });
};

var mul = function() {
  if(isEmpty(arguments)) return 0;
  return reduce0(arguments, function(x, y) {
    return x * y;
  });
};

var div = function() {
  if(isEmpty(arguments)) return 0;
  return reduce0(arguments, function(x, y) {
    return x / y;
  });
};
