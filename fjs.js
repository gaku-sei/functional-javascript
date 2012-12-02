//_core
//  Internal functions.
//  They are not supposed to be used in a project.
//  BTW some of them could be useful (like _for (aliased forEach) or _arity).

//Finish & Rewrite
var _fn = function() {
  var f = arguments[arguments.length - 1];
  if(typeof f !== "function") throw Error("Last argument of _fn must be a function.");
  f.doc = [].slice.call(arguments, 0, -1).join("\n");
  f.source = f.toString();
  return f;
};

var _for = _fn(
  "Wrapper for the for statement.",
  function(xs, f) {
    for(var i in xs)
      if(xs.hasOwnProperty(i))
        f.call(null, xs[i], i, xs);
    return null;
  }
);

var _is = _fn(
  "General purpose type checker.",
  "BTW it's only used in isArray, isObject and isString.",
  function(type) {
    return function(x) {
      return second(toString.call(x).match(/\s(\w+)\]$/i)) == type;
    };
  }
);

var _cloneArray = _fn(
  "Recursively clones an Array.",
  function(x) {
    return map(x, clone);
  }
);

var _cloneObject = _fn(
   "Recursively clones an Object.",
  function(x) {
    var y = {};
    _for(x, function(v, k) {
      y[k] = clone(v);
    });
    return y;
  }
);

var _arity = _fn(
  "Use with caution as _arity may leads to cryptic errors!",
  "Limit the arguments given to a function.",
  "e.g.: _arity(2)(add)(2,7,6) //=> 9",
  "The first two arguments only are passed to the function add.",
  function(n) {
    return function(f) {
      return function() {
        return apply(f, slice(arguments, 0, n));
      };
    };
  }
);

var _arity0 = _arity(0);

var _arity1 = _arity(1);

var _arity2 = _arity(2);

var _console = _fn(
  "Wrapper for the console object.",
  "The function returned by _console itself returns its arguments.",
  "e.g.: map(_console(\"log\")(1,2), inc) // logs [1,2] then returns [2,3]",
  "      add(_console(\"log\")(1), 2) // logs 1 then returns 3",
  function(met) {
    return function() {
      if(arguments.length < 2)
        var x = first(arguments);
      else var x = slice(arguments);
      console[met](x);
      return x;
    };
  }
);

//Test
var _apply = _fn(
  "This function uses context and rebinds 'this',",
  "it's not 'absolutely' supposed to be used in functionnal code.",
  "It applies a function to an array of arguments.",
  "The first argument must be a function,",
  "and the second one the context.",
  function(f, cxt, args) {
    if(!isArrayLike(args))
      throw Error("args must be an array or some arguments");
    return f.apply(cxt, args);
  }
);

//Test
var _call = _fn(
  "This function uses context and rebinds 'this',",
  "it's not 'absolutely' supposed to be used in functionnal code.",
  "It applies a function to a variable number of arguments.",
  "The first argument must be a function,",
  "and the second one is the context.",
  function(f, cxt) {
    return _apply(f, cxt, slice(arguments, 2));
  }
);

//core
//  General purpose functions.

var forEach = _fn(
  "Alias for _for.",
  "Defined here for readability.",
  _for
);

var id = _fn(
  "Returns self.",
  function(x) {
    return x;
  }
);

var clone = _fn(
  "General purpose clone function.",
  "The Objects and Arrays are mutable in JS",
  "clone allows to bypass this with ease.",
  "If you give arguments to clone, it will return an Array.",
  function(x) {
    switch(true) {
    case isArrayLike(x):  return _cloneArray(x);
    case isObject(x): return _cloneObject(x);
    default: return x;
    }
  }
);

var doc = _fn(
  "Returns the attribute doc of an object.",
  function(f) {
    return f.doc;
  }
);

var source = _fn(
  "Returns the attribute source of an object.",
  function(f) {
    return f.source;
  }
);

var attrs = _fn(
  "Returns an Object containing all the attributes of x.",
  "You may get the attrs of everything.",
  function(x) {
    var o = {};
    _for(x, function(v,k){o[k] = v});
    return o;
  }
);

var apply = _fn(
  "Applies a function to an array of arguments.",
  "The first argument must be a function,",
  "the context is set to null.",
  function(f, args) {
    if(!isArrayLike(args))
      throw Error("args must be an array or some arguments");
    return f.apply(null, args);
  }
);

var call = _fn(
  "Applies a function to a variable number of arguments.",
  "The first argument must be a function,",
  "the context is set to null.",
  function(f) {
    return apply(f, butfirst(arguments));
  }
);

var slice = _fn(
  "Loosely based on the function Array.prototype.slice.",
  "e.g.: slice(arguments) // similar to [].slice.call(arguments)",
  "      slice([1,2,3,4], 1,3) // [2, 3]",
  "      slice([1,2,3], -1) // [3]",
  function(xs) {
    var args = [].slice.call(arguments).slice(1);
    return [].slice.apply(xs, args);
  }
);

var join = _fn(
  "Based on Array.prototype.join, join replaces \",\" with \"\".",
  "e.g.: join([\"foo\", \"bar\"]) // \"foobar\"",
  function(xs) {
    return [].join.call(xs, second(arguments)||"");
  }
);

//Finish & Rewrite
var concat2 = _fn(
  "Appends the content of ys to xs.",
  function(xs, ys) {
    var xs = slice(xs||[]), ys = slice(ys||[]); //Bruteforce: change that
    if([].concat)
      return [].concat.call(xs, ys);
    else throw Error("Array.prototype.concat not found!"); //Raises for the moment
    //return conj.call(null, xs, ys);
  }
);

var concat = _fn(
  "Like concat2 but variadic.",
  function() {
    return reduce(arguments, concat2, []);
  }
);

var map = _fn(
  "The very famous map function!",
  "e.g.: map([1,2,4], partial(add, 2)) // [3,4,6]",
  function(xs, f) {
    var ys = [];
    _for(xs, function() {
      ys.push(apply(f, arguments));
    });
    return ys;
  }
);

var times = _fn(
  "Calls function f n times.",
  function(n, f) {
    for(var i = 0; i < n; ++i)
      call(f, i);
  }
);

//Write
var takeWhile = _fn(
  "Returns an Array containing the items of xs",
  "while pred(item) is true.",
  function(pred, xs) {
  }
);

//Write
var dropWhile = _fn(
  "Drops all the items of xs while pred(item) is true",
  "and returns all the remaining items as an Array",
  function(pred, xs) {
  }
);

var cons = _fn(
  "Prepends x to xs.",
  "e.g.: cons([2,3], 1) // [1,2,3]",
  function(xs, x) {
    return concat([x], xs);
  }
);

var conj = _fn(
  "Appends x to xs.",
  "e.g.: conj([1,2], 3) // [1,2,3]",
  function(xs) {
    var ys = clone(xs);
    [].push.apply(ys, butfirst(arguments));
    return ys;
  }
);

var first = _fn(
  "Returns the first element of xs.",
  function(xs) {
    return xs[0];
  }
);

var butfirst = _fn(
  "Returns all the elements of xs but the first one.",
  function(xs) {
    return slice(xs, 1, xs.length);
  }
);

var second = _fn(
  "Returns the second element of xs.",
  function(xs) {
    return xs[1];
  }
);

var last = _fn(
  "Returns the last elements of xs.",
  function(xs) {
    return xs[xs.length - 1];
  }
);

var butlast = _fn(
  "Returns all the elements of xs but the last one.",
  function(xs) {
    return slice(xs, 0, -1);
  }
);

//Rewrite
var get = _fn(
  "Object, Array, String and arguments lookup.",
  "e.g.: get([1,2,3], 0) // 1",
  "      get({foo: {bar: [1,2]}}, [\"foo\", \"bar\", 1]) // 2",
  "      get([1,2], 4, \"Not Found...\") // \"Not Found...\".",
  function(xs, ks, notFound) {
    var found;
    if(isArrayLike(ks)) {
      if(eqOne(ks.length))
        found = xs[first(ks)];
      else
        if(xs[first(ks)])
          found = get(xs[first(ks)], butfirst(ks));
    }
    else found = xs[ks];
    return isUndefined(found) ? notFound : found;
  }
);

var sum = _fn(
  "Sums the elements of an array.",
  function(xs) {
    return reduce(xs, add);
  }
);

var repeat = _fn(
  "Returns an array containing n times x.",
  function(x, n) {
    if(n > 0)
      return conj(repeat(x, dec(n)), x);
    else return [];
  }
);

var cycle = _fn(
  "Returns an array containing n repetitions of the items in xs.",
  function(xs, n) {
    if(n > 0)
      return concat2(cycle(xs, dec(n)), xs);
    else return [];
  }
);

var reduce = _fn(
  "An other very famous function!",
  "The first argument is an array the second one a function",
  "and you may pass a third argument which is an aggregator",
  "(first element of xs by default).",
  "e.g.: reduce([1,2,3], add, 2) // 8",
  function(xs, f, agg) {
    var reducer = function(ys, agg) {
      if(isEmpty(ys)) return agg;
      return reducer(butfirst(ys), call(f, agg, first(ys)));
    };
    if(isUndefined(agg))
      return reducer(butfirst(xs), first(xs));
    else return reducer(xs, agg);
  }
);

var reverse = _fn(
  "Reverse the element of an array.",
  function(xs) {
    return reduce(xs, cons, []);
  }
);

var every = _fn(
  "Based on Array.prototype.every.",
  function(xs, f) {
    return [].every.call(xs, f);
  }
);

var some = _fn(
  "Based on Array.prototype.some.",
  function(xs, f) {
    return [].some.call(xs, f);
  }
);

//Finish
var comp = _fn(
  "Composes two functions (more in the future).",
  "e.g.: comp(partial(add, 1), partial(mul, 2))(2) // 5",
  function(f, g) {
    return function() {
      return call(f, apply(g, arguments));
    };
  }
);//should be variadic

//Test & Wait for comp to be completed...
var thread = _fn(
  "Targeting readability, thread looks like OOP writting.",
  "e.g.: inc(first([1,3])) becomes thread([1,3], first, inc) // 2",
  function() {
    var val = first(arguments);
    var fs = butfirst(arguments);
    return apply(flip(comp), fs)(val);
  }
);

var partial = _fn(
  "Partially apply a function to a variable number of arguments.",
  "e.g.: partial(add, 1)(2) // 3",
  function(f) {
    var args = butfirst(arguments);
    return function() {
      return apply(f, concat(args, arguments));
    };
  }
);

var juxt = _fn(
  "Sequentially applies each function to a variadic number of arguments",
  "then returns an array with the results.",
  "e.g.: juxt(inc, dec)(2) // [3,1]",
  function() {
    var fs = arguments;
    return function() {
      var args = arguments;
      return map(fs, function(f) {
        return apply(f, args);
      });
    };
  }
);

var flip = _fn(
  "Flips the arguments given to a function.",
  "e.g.: div(10, 2) // 5",
  "      flip(div)(10, 2) // 0.2",
  function(f) {
    return function() {
      return apply(f, reverse(arguments));
    };
  }
);

var fmap = _fn(
  "Flips the map arguments.",
  flip(map)
);

var feach = _fn(
  "Flips the forEach arguments.",
  "e.g.: var log1Each = partial(feach, log1);",
  flip(forEach)
);

var freduce = _fn(
  "Flips the reduce arguments.",
  "The aggregator remains the third and last argument.",
  "e.g.: reduce(mul, [2,3]) // 6",
  "      reduce(mul, [2,3], 2) // 12",
  function(f, xs, agg) {
    return reduce(xs, f, agg)
  }
);

var log = _fn(
  "console.log and returns the argument(s) given.",
  _console("log")
);

var log1 = _fn(
  "console.log and returns the first argument given.",
  _arity1(_console("log"))
);

var warn = _fn(
  "console.warn and returns the argument(s) given.",
  _console("warn")
);

var warn1 = _fn(
  "console.warn and returns the first argument given.",
  _arity1(_console("warn"))
);

var error = _fn(
  "console.error and returns the argument(s) given.",
  _console("error")
);

var error1 = _fn(
  "console.error and returns the first argument given.",
  _arity1(_console("error"))
);

//Finish
var eq = _fn(
  "Returns wether x equals y or not.",
  function(x, y) {
    return x === y;
  }
);//must dramatically evolve

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
  return eq(x, 0);
};

var eqOne = function(x) {
  return eq(x, 1);
};

var isEmpty = function(x) {
  switch(true) {
  case(isArrayLike(x) || isString(x)): return eqZero(x.length);
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
  return reduce(arguments, function(x, y) {
    return x - y;
  });
};

var mul = function() {
  if(isEmpty(arguments)) return 0;
  return reduce(arguments, function(x, y) {
    return x * y;
  });
};

var div = function() {
  if(isEmpty(arguments)) return 0;
  return reduce(arguments, function(x, y) {
    return x / y;
  });
};
