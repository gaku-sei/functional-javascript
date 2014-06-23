//     Fjs.js 0.15.0
//     https://github.com/gaku-sei/functional-javascript
//     (c) 2014 Beviral

;var fjs = (function() {
  // Vars
  // ----

  var exports = {};
  var add, apply, applyWith, and, areArguments, arity, arity0, arity1, arity2, arity3, assoc, attrs, bind, butfirst, butlast, call,
      callWith, clone, comp, complement, concat, concatMap, conj, cons, cs, curriedFunctions, curry, curry1, cycle, dec, del, dir, dir1,
      div, doc, drop, dropWhile, eq, eq2, eq3, eqOne, eqZero, error, error1, even, every, fdrop, fget, filter, first, flatten, flip, fmap,
      fmapkv, fn, freduce, freducekv, freduceR, get, gt, gte, id, inc, interleave, interpose, is, isa, isArray, isArrayLike, isBoolean, isEmpty,
      isFalse, isFloat, isFunction, isInt, isNull, isNumber, isObject, isString, isTrue, isUndefined, join, juxt, keys, last, len, log, log1,
      lookup, loop, lt, lte, map, mapkv, marshal, max, merge, min, mul, neq2, not, neq3, odd, or, owns, partial, pow, product, rand, randIndex,
      randInt, range, reduce, reducekv, reduceR, repeat, repeatedly, reverse, second, shuffle, slice, some, sort, source, sqrt, sub, sum,
      takeWhile, thread, time, times, unmarshal, use, useAll, values, version, warn, warn1, xor, xrange, zip;

  // Errors
  // ------
  function NotImplementedError(message) {
    this.name = "NotImplementedError";
    this.message = message || '';
  }
  NotImplementedError.prototype = new Error();
  exports.NotImplementedError = NotImplementedError;

  function ArgumentError(message) {
    this.name = "ArgumentError";
    this.message = message || '';
  }
  ArgumentError.prototype = new Error();
  exports.ArgumentError = ArgumentError;

  // Functions
  // ---------

  // Create a function with doc
  exports.fn = fn = function fn() {
    var f = arguments[arguments.length - 1];
    if(typeof f !== 'function')
      throw new ArgumentError('Last argument of fn must be a function');
    f.doc = [].slice.call(arguments, 0, -1).join('\n');
    return f;
  };

  // Wrapper for the for statement.
  // loop also checks hasOwnProperty before calling given function.
  exports.loop = loop = function loop(f, xs) {
    for(var i in xs)
      if(xs.hasOwnProperty(i))
        f.call(null, i, xs[i]);
  };

  // General purpose type checker
  exports.is = is = function is(type) {
    return function(x) {
      return {}.toString.call(x).slice(8, -1) === type;
    };
  };

  // Wrapper for instanceof operator<br />
  // ```
  //   isa({}, Object)         // true
  //   var Foo = function() {}
  //   var foo = new Foo
  //   isa(foo, Foo)           // true
  //   isa(foo, Foo, Object)   // true
  // ```
  exports.isa = isa = function isa(obj) {
    var fs = butfirst(arguments);
    for(i in fs)
      if(fs.hasOwnProperty(i) && !(obj instanceof fs[i]))
        return false;
    return true;
  };

  // Wrapper for the hasOwnProperty method
  exports.owns = owns = function owns(xs, prop) {
    return xs.hasOwnProperty(prop);
  };

  // Negates boolean value
  exports.not = not = function not(bool) {
    return !bool;
  };

  // Wrapper for the == operator
  exports.eq2 = eq2 = function eq2() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x == y;
      return (x == y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the === operator
  exports.eq3 = eq3 = function eq3() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x === y;
      return (x === y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the != operator
  exports.neq2 = neq2 = function neq2() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x != y;
      return (x != y) || reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the != operator
  exports.neq3 = neq3 = function neq3() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x !== y;
      return (x !== y) || reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the < operator
  exports.lt = lt = function lt() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x < y;
      return (x < y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the > operator
  exports.gt = gt = function gt() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x > y;
      return (x > y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the <= operator
  exports.lte = lte = function lte() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x <= y;
      return (x <= y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the >= operator
  exports.gte = gte = function gte() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x >= y;
      return (x >= y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the && operator
  exports.and = and = function and() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x && y;
      return (x && y) && reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Wrapper for the || operator
  exports.or = or = function or() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return x || y;
      return (x || y) || reducer(rest[0], rest[1], slice(rest, 1));
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // xor operator
  exports.xor = xor = function xor() {
    var args = arguments;
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return !x !== !y && (x || y);
      var val1 = (!x !== !y && (x || y));
      var val2 = reducer(rest[0], rest[1], slice(rest, 1));
      return !val1 !== !val2 && (val1 || val2);
    }
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Takes a function and returns a function which does the exact thing
  // except it negates the returned boolean value
  exports.complement = complement = function complement(f) {
    return function() {
      return !apply(f, arguments);
    };
  };

  // Uses context and rebinds 'this',
  // it applies a function to an array of arguments.
  // The first argument must be a function,
  // and the second one the context.
  exports.applyWith = applyWith = function applyWith(f, cxt, args) {
    if(!isArrayLike(args))
      throw new ArgumentError('args must be an array or some arguments');
    return f.apply(cxt, args);
  };

  // Uses context and rebinds 'this',
  // It applies a function to a variable number of arguments.
  // The first argument must be a function,
  // and the second one is the context.
  exports.callWith = callWith = function callWith(f, cxt) {
    return applyWith(f, cxt, slice(arguments, 2));
  };

  exports.bind = bind = function bind(f, ctx) {
    return partial(callWith, f, ctx);
  };

  // Use with caution since arity may leads to cryptic errors!
  // Limit the arguments given to a function.
  // ```
  //   arity(2)(add)(2, 7, 6) // 9
  // ```
  // The first two arguments only are passed to the function add.
  exports.arity = arity = function arity(n) {
    return function(f) {
      return function() {
        return apply(f, slice(arguments, 0, n));
      };
    };
  };

  exports.arity0 = arity0 = arity(0);

  exports.arity1 = arity1 = arity(1);

  exports.arity2 = arity2 = arity(2);

  exports.arity3 = arity3 = arity(3);

  // Wrapper for the console object.
  // The function returned by cs itself returns its arguments.
  // ```
  //   map(inc, cs('log')(1, 2)) // logs [1, 2] then returns [2, 3]
  //   add(cs('log')(1), 2)      // logs 1 then returns 3
  // ```
  exports.cs = cs = function cs(met) {
    return function() {
      var args = arguments.length < 2 ? first(arguments) : slice(arguments);
      console[met](args);
      return args;
    };
  };

  // Returns self
  exports.id = id = function id(x) {
    return x;
  };

  // General purpose clone function.
  // The objects and arrays are mutable in JS
  // clone allows to bypass this with ease.
  exports.clone = clone = function clone(x) {
    if(this.JSON) return JSON.parse(JSON.stringify(x));

    var cloneArray = function(xs) {
      return map(clone, xs);
    };
    var cloneObject = function(xs) {
      var y = {};
      for(i in xs)
        y[clone(i)] = clone(xs[i]);
      return y;
    };

    switch(true) {
    case isArrayLike(x): return cloneArray(x);
    case isObject(x): return cloneObject(x);
    default: return x;
    }
  };

  // Returns the attribute doc of an object
  exports.doc = doc = function doc(obj) {
    return obj.doc;
  };

  // Return the length attribute of obj
  exports.len = len = function len(obj) {
    return obj.length;
  };

  // Returns an Object containing all the properties owned by obj.
  // You may get the attrs of everything.
  exports.attrs = attrs = function attrs(obj) {
    var attrsObj = {};
    for(var i in obj)
      attrsObj[i] = obj[i];
    return attrsObj;
  };

  // Applies a function to an array of arguments.
  // The first argument must be a function,
  // the context is set to void 8.
  exports.apply = apply = function apply(f, args) {
    if(!isArrayLike(args))
      throw new ArgumentError('args must be an array or some arguments');
    return applyWith(f, void 8, args);
  };

  // Applies a function to a variable number of arguments.
  // The first argument must be a function,
  // the context is set to void 8.
  exports.call = call = function call(f) {
    return apply(f, butfirst(arguments));
  };

  // Composes functions.
  // ```
  //   comp(partial(add, 1), partial(mul, 2))(2)                  // 5
  //   comp(partial(mul, 2), partial(add, 1), partial(mul, 3))(4) // 26
  // ```
  exports.comp = comp = function comp() {
    return reduce(function(f, g) {
      return function() {
        return call(f, apply(g, arguments));
      };
    }, arguments);
  };

  // Based on the function Array.prototype.slice.
  // ```
  //   slice(arguments)          // similar to [].slice.call(arguments)
  //   slice([1, 2, 3, 4], 1, 3) // [2, 3]
  //   slice([1, 2, 3], -1)      // [3]
  // ```
  exports.slice = slice = function slice(xs) {
    var args = [].slice.call(arguments).slice(1);
    if([].slice) return applyWith([].slice, xs, args);

    throw new NotImplementedError('function "slice" is not implemented yet');
  };

  // Based on Array.prototype.join, join replaces ',' with ''.
  // ```
  //   join(['foo', 'bar']) // 'foobar'
  // ```
  exports.join = join = function join(xs) {
    var sep = second(arguments)||'';
    if([].join) return callWith([].join, xs, sep);

    var s = '';
    loop(function(i, x) {
      s += x;
      if((xs.length - 1) !== parseInt(i)) s += sep;
    }, xs);
    return s;
  };

  // Concats several arrays
  exports.concat = concat = function concat() {
    var xs = [];
    for(var i in arguments)
      for(var j in arguments[i])
        xs.push(arguments[i][j]);
    return xs;
  };

  // Applies f to each item of xs and returns the results as an array.
  // ```
  //   map(partial(add, 2), [1, 2, 4]) // [3, 4, 6]
  // ```
  exports.map = map = function map(f, xs) {
    if([].map) return callWith([].map, xs, arity1(f));

    var ret = [];
    loop(function(i, x) {
      ret.push(call(f, x));
    }, xs);
    return ret;
  };

  // Like map but mapkv also passes the key to the given function.
  // Notice that if xs is an Array its indexes are automatically casted into Int.
  exports.mapkv = mapkv = function mapkv(f, obj) {
    var ret = [];
    loop(function(k, v) {
      ret.push(f.call(f, isArrayLike(obj) ? parseInt(k) : k, v));
    }, obj);
    return ret;
  };

  // Map f over xs then concats the result
  exports.concatMap = concatMap = function concatMap(f, xs) {
    return apply(concat, map(f, xs));
  };

  // Returns an array of the items in coll for which pred(x) returns true
  exports.filter = filter = function filter(pred, xs) {
    if([].filter) return callWith([].filter, xs, arity1(pred));

    var ys = [];
    loop(function(_, x) {
      if(pred(x)) ys.push(x);
    }, xs);
    return ys;
  };

  // Sort element of an array.
  // You can pass a sorter function to sort.
  exports.sort = sort = function sort(comp, xs) {
    if(isUndefined(xs)) {
      xs = comp;
      comp = void 8;
    }
    if([].sort) return callWith([].sort, xs, comp);

    throw new NotImplementedError('function "sort" is not implemented yet');
  };

  // Returns a shuffled xs
  exports.shuffle = shuffle = function shuffle(xs) {
    var ys = Array(xs.length);
    for(i in xs) {
      var r = randInt(i);
      ys[i] = ys[r];
      ys[r] = xs[i];
    }
    return ys;
  };

  // Zips arrays together.
  // ```
  //   zip([1, 2, 3], [4, 5, 6]) // [[1, 4], [2, 5], [3, 6]]
  // ```
  exports.zip = zip = function zip() {
    var ret = [],
        args = arguments,
        len = apply(min , map(exports.len, args));
    if(args.length == 1) return first(args);
    for(var i = 0; i < len; i++) {
      ret.push(map(exports.cfget(i), args));
    }
    return ret;
  };

  // Flattens an ArrayLike object
  exports.flatten = flatten = function flatten(xs) {
    return reduce(function(acc, value) {
      return concat(acc, isArrayLike(value) ? flatten(value) : [value]);
    }, xs, []);
  };

  // Returns min value
  exports.min = min = function min() {
    return reduce(Math.min, arguments);
  };

  // Returns max value
  exports.max = max = function max() {
    return reduce(Math.max, arguments);
  };

  // Wrapper for the Math.random function.
  // rand returns a random floating point number between 0 and n (default 1).
  exports.rand = rand = function rand() {
    var n = first(arguments)||1;
    return Math.random() * n;
  };

  // Returns a random integer between 0 and n.
  // randInt() always returns 0.
  exports.randInt = randInt = function randInt(n) {
    return parseInt(rand(n));
  };

  // Returns a random item of xs
  exports.randIndex = randIndex = function randIndex(xs) {
    return xs[randInt(xs.length)];
  };

  // Calls function f n times
  exports.times = times = function times(n, f) {
    while(n--)
      apply(f, slice(arguments, 2));
  };

  // Returns an Array containing the items of xs
  // while pred(item) is true.
  exports.takeWhile = takeWhile = function takeWhile(pred, xs) {
    for(var i = 0; i < xs.length && pred(xs[i]); i++);
    return slice(xs, 0, i);
  };

  // Drops all the items of xs while pred(item) is true
  // and returns all the remaining items as an Array
  exports.dropWhile = dropWhile = function dropWhile(pred, xs) {
    for(var i = 0; i < xs.length && pred(xs[i]); i++);
    return slice(xs, i);
  };

  // Returns an array of the elements of xs separated of sep
  exports.interpose = interpose = function interpose(sep, xs) {
    var len = xs.length * 2 - 1, ret = [];
    for(var i = 0; i < len; i++)
      ret.push(odd(i) ? sep : xs[i/2]);
    return ret;
  };

  // Returns an array of the first item in each array, then the second etc
  exports.interleave = interleave = function interleave() {
    return apply(comp(flatten, zip), arguments);
  };

  // Returns the keys of an Object
  exports.keys = keys = function keys(obj) {
    return mapkv(id, obj);
  };

  // Returns the values of an Object
  exports.values = values = function values(obj) {
    return mapkv(flip(id), obj);
  };

  // Merges a variable number of objects
  exports.merge = merge = function merge() {
    var merge2 = function(obj1, obj2) {
      var ret = {};
      for(k in obj1) ret[k] = obj1[k];
      for(k in obj2) ret[k] = obj2[k];
      return ret;
    };
    return reduce(merge2, arguments, {});
  };

  // Assoc key/value to object.
  // Equivalent to `obj[k] = v` but doesn't modify obj.
  exports.assoc = assoc = function assoc(obj, k, v) {
    var assocedObj = clone(obj);
    assocedObj[k] = v;
    return assocedObj;
  };

  // Converts an array of pairs into an object
  exports.marshal = marshal = function marshal(xs) {
    return reduce(function(agg, x) {
      agg[first(x)] = second(x);
      return agg;
    }, xs, {});
  };

  // Converts an object into an array of pairs
  exports.unmarshal = unmarshal = function unmarshal(obj) {
    return mapkv(function(k, v) {
      return [k, v];
    }, obj);
  };

  // Prepends x to xs.
  // ```
  //   cons([2, 3], 1) // [1, 2, 3]
  // ```
  exports.cons = cons = function cons(xs, x) {
    return concat([x], xs);
  };

  // Appends arguments to xs.
  // ```
  //   conj([1, 2], 3) // [1, 2, 3]
  // ```
  exports.conj = conj = function conj(xs) {
    return concat(xs, butfirst(arguments));
  };

  // Drops the n first elements of xs
  exports.drop = drop = function drop(n, xs) {
    return slice(xs, n);
  };

  // Returns the first element of xs
  exports.first = first = function first(xs) {
    return xs[0];
  };

  // Returns all the elements of xs but the first one
  exports.butfirst = butfirst = function butfirst(xs) {
    return slice(xs, 1);
  };

  // Returns the second element of xs
  exports.second = second = function second(xs) {
    return xs[1];
  };

  // Returns the last elements of xs
  exports.last = last = function last(xs) {
    return xs[xs.length - 1];
  };

  // Returns all the elements of xs but the last one
  exports.butlast = butlast = function butlast(xs) {
    return slice(xs, 0, -1);
  };

  // Similar to obj[i]
  exports.get = get = function get(obj, i) {
    return obj[i];
  };

  // Object, Array, String and arguments lookup.
  // ```
  //   lookup([1, 2, 3], 0)                            // 1
  //   lookup({foo: {bar: [1, 2]}}, ['foo', 'bar', 1]) // 2
  //   lookup([1, 2], 4, 'Not Found...')               // 'Not Found...'
  // ```
  exports.lookup = lookup = function lookup(xs, ks, notFound) {
    var found = isArrayLike(ks)
      ? eqOne(ks.length)
        ? xs[first(ks)]
        : lookup(xs[first(ks)], butfirst(ks))
      : xs[ks];
    return isUndefined(found) ? notFound : found;
  };

  // Sums the elements of an array
  exports.sum = sum = function sum(xs) {
    return reduce(add, xs);
  };

  // Returns the product of the elements of an array
  exports.product = product = function product(xs) {
    return reduce(mul, xs);
  };

  // Returns an array containing n repetitions of the items in xs
  exports.cycle = cycle = function cycle(n, xs) {
    var ys = [];
    while(n--)
      applyWith([].push, ys, xs);
    return ys;
    };

  // Returns an array containing n times x
  exports.repeat = repeat = function repeat(n, x) {
    if(n < 1) return [];
    var xs = [];
    for(var i = 0; i < n; i++)
      xs[i] = x;
    return xs;
  };

  // Returns an array containing n times f()
  exports.repeatedly = repeatedly = function repeatedly(n, f) {
    if(n < 1) return [];
    var xs = [];
    for(var i = 0; i < n; i++)
      xs[i] = f();
    return xs;
  };

  // The first argument is a function which takes two arguments,
  // the second one is an array and you may pass a third argument which is an aggregator
  // the aggregator is the first element of xs by default.
  // ```
  //   reduce(add, [1, 2, 3])    // 6
  //   reduce(add, [1, 2, 3], 2) // 8
  // ```
  exports.reduce = reduce = function reduce(f, xs, agg) {
    if([].reduce) {
      if(isUndefined(agg))
        return callWith([].reduce, xs, arity2(f));
      else return callWith([].reduce, xs, arity2(f), agg);
    }

    var reducer = function(ys, agg) {
      if(isEmpty(ys)) return agg;
      return reducer(butfirst(ys), call(f, agg, first(ys)));
    };
    if(isUndefined(agg))
      return reducer(butfirst(xs), first(xs));
    else return reducer(xs, agg);
  };

  // The first argument is a function which takes three arguments,
  // the second one is an array and the third one is an aggregator
  // ```
  //   var f = function(agg, _, v) { return agg + v }
  //   reducekv(f, {foo: 1, bar: 2, baz: 3}, 0) // 6
  //   reducekv(f, {foo: 1, bar: 2, baz: 3}, 2) // 8
  // ```
  exports.reducekv = reducekv = function reducekv(f, obj, agg) {
    if([].reduce && !isObject(obj)) return callWith([].reduce, obj, arity3(f), agg);

    var reducer = function(obj, agg) {
      if(isEmpty(obj)) return agg;
      return reducer(butfirst(obj), call(f, agg, obj[0][0], obj[0][1]));
    };
    return reducer(unmarshal(obj), agg);
  };

  // Similar to reduce but starts iteration at the end of the array.
  // ```
  //   reduce(sub, [10, 2, 5])  // 3
  //   reduceR(sub, [10, 2, 5]) // -7
  // ```
  exports.reduceR = reduceR = function reduceR(f, xs, agg) {
    if([].reduce) {
      if(isUndefined(agg))
        return callWith([].reduceRight, xs, arity2(f));
      else return callWith([].reduceRight, xs, arity2(f), agg);
    }

    var reducer2 = function(ys, agg) {
      if(isEmpty(ys)) return agg;
      return reducer2(butlast(ys), call(f, agg, last(ys)));
    };
    if(isUndefined(agg))
      return reducer2(butlast(xs), last(xs));
    else return reducer2(xs, agg);
  };

  // Reverses the elements of an array.
  exports.reverse = reverse = function reverse(xs) {
    var ys = Array(xs.length), i = xs.length;
    while(i > 0)
      ys[xs.length - i] = xs[--i];
    return ys;
  };

  // Applies pred to each items of xs.
  // If pred(item) is true every time, return true.
  exports.every = every = function every(pred, xs) {
    for(i in xs)
      if(xs.hasOwnProperty(i) && !pred(xs[i]))
        return false;
    return true;
  };

  // Applies pred to each items of xs.
  // If pred(item) is true, returns true.
  exports.some = some = function some(pred, xs) {
    for(i in xs)
      if(xs.hasOwnProperty(i))
        if(pred(xs[i]))
          return true;
    return false;
  };

  // Targeting readability, thread looks like OOP writting.
  // ```
  //   inc(first([1, 3]))
  //   // becomes
  //   thread([1, 3], first, inc) // 2
  // ```
  exports.thread = thread = function thread() {
    return apply(flip(comp), butfirst(arguments))(first(arguments));
  };

  // Partially applies a function to a variable number of arguments
  // ```
  //   partial(add, 1)(2) // 3
  // ```
  exports.partial = partial = function partial(f) {
    var args = butfirst(arguments);
    return function() {
      return apply(f, concat(args, arguments));
    };
  };

  // Allows to curry a function.
  // The arity if by default f.length, but it can be set.
  // ```
  //   var cmap = curry(map)
  //   var mapinc = cmap(inc)
  //   mapinc([1, 2, 3]) // [2, 3, 4]
  //   mapinc([2, 3, 4]) // [3, 4, 5]
  // ```
  // ```
  //   var cadd = curry(add, 3)
  //   cadd(1)(2)(3) // 6
  //   cadd(1, 2)(3) // 6
  //   cadd(1)(2, 3) // 6
  //   cadd(1, 2, 3) // 6
  // ```
  exports.curry = curry = function curry(f, arity) {
    var curried = function(args, arity) {
      return function() {
        if((arity - arguments.length) > 0)
          return curried(concat(args, arguments), arity - arguments.length);
        else return apply(f, concat(args, arguments));
      };
    };
    return curried([], or(arity, f.length));
  };

  // Similar to curry but with arity fixed to 1 for each call.
  // The arity if by default f.length, but it can be set.
  // ```
  //   var cmap = curry(map)
  //   var mapinc = cmap(inc)
  //   mapinc([1, 2, 3]) // [2, 3, 4]
  //   mapinc([2, 3, 4]) // [3, 4, 5]
  // ```
  // ```
  //   var cadd = curry(add, 3)
  //   cadd(1)(2)(3) // 6
  //   cadd(1)(2, 3) // wrong: the second argument here is ignored
  //   cadd(1)(2)()  // NaN: unlike curry, curry1 decreases arity at each call
  //                 // So cadd does 1 + 2 + undefined here
  // ```
  exports.curry1 = curry1 = function curry1(f, arity) {
    var curried1 = function(args, arity) {
      return function(arg) {
        if(arity > 1)
          return curried1(conj(args, arg), dec(arity));
        else return apply(f, conj(args, arg));
      };
    };
    return curried1([], or(arity, f.length));
  };

  // Sequentially applies each function to a variadic number of arguments
  // then returns an array with the results.
  // ```
  //   juxt(inc, dec)(2) // [3, 1]
  // ```
  exports.juxt = juxt = function juxt() {
    var fs = arguments;
    return function() {
      var args = arguments;
      return map(function(f) {
        return apply(f, args);
      }, fs);
    };
  };

  // Flips the arguments given to a function.
  // ```
  //   div(10, 2)       // 5
  //   flip(div)(10, 2) // 0.2
  // ```
  exports.flip = flip = function flip(f) {
    return function() {
      return apply(f, reverse(arguments));
    };
  };

  // Flips the arguments given to drop
  exports.fdrop = fdrop = flip(drop);

  // Flips the arguments given to get
  exports.fget = fget = flip(get);

  // Flips the arguments given to map
  exports.fmap = fmap = flip(map);

  // Flips the arguments given to mapkv
  exports.fmapkv = fmapkv = flip(mapkv);

  // Flips the arguments given to reduce.
  // The aggregator remains the third and last argument.
  // ```
  //   freduce([2, 3], mul)    // 6
  //   freduce([2, 3], mul, 2) // 12
  // ```
  exports.freduce = freduce = function freduce(xs, f, agg) {
    return reduce(f, xs, agg)
  };

  // Flips the arguments given to reducekv.
  // The aggregator remains the third and last argument.
  // ```
  //   var obj = {foo: 1, bar: 2, baz: 3}
  //   var f = function(agg, _, v) { return agg * v }
  //   freducekv(obj, f, 1) // 6
  //   freducekv(obj, f, 2) // 12
  // ```
  exports.freducekv = freducekv = function freducekv(obj, f, agg) {
    return reducekv(f, obj, agg)
  };

  // Flips the argument given to reducer.
  // The aggregator remains the third and last argument.
  // ```
  //   freduceR([3, 2, 10], sub) // 5
  // ```
  exports.freduceR = freduceR = function freduceR(xs, f, agg) {
    return reduceR(f, xs, agg);
  };

  // console.log and returns the given argument(s)
  exports.log = log = cs('log');

  // console.log and returns the first argument given
  exports.log1 = log1 = arity1(log);

  // console.dir and returns the given argument(s)
  exports.dir = dir = cs('dir');

  // console.dir and returns the first argument given
  exports.dir1 = dir1 = arity1(dir);

  // console.warn and returns the given argument(s)
  exports.warn = warn = cs('warn');

  // console.warn and returns the first argument given
  exports.warn1 = warn1 = arity1(warn);

  // console.error and returns the given argument(s)
  exports.error = error = cs('error');

  // console.error and returns the first argument given
  exports.error1 = error1 = arity1(error);

  // Uses console.time and console.timeEnd to calculate
  // the time taken by a given function and returns its value.
  // Remainings arguments are given to function.
  exports.time = time = function time(f, fname) {
    var label = '#' + (f.name || fname || 'unknown') + ' #fjs-time-label-' + (new Date).getTime();
    var args = butfirst(arguments);
    console.time(label);
    var ret = apply(f, args);
    console.timeEnd(label);
    return ret;
  };

  // Returns an array.
  // Step must be positive.
  // ```
  //   range(5)        // [0, 1, 2, 3, 4]
  //   range(3, 6)     // [3, 4, 5]
  //   range(3, 10, 2) // [3, 5, 7, 9]
  // ```
  exports.range = range = function range() {
    var args = arguments;
    switch(args.length) {
    case 1: return range(0, first(args), 1); break;
    case 2: return range(first(args), second(args), 1); break;
    case 3:
      var xs = [], min = args[0], max = args[1], step = (args[2] > 0) ? args[2] : 1;
      if(min >= max) return [];
      do xs.push(min); while((min+=step) < max)
      return xs;
    }
  };

  // Pending version of range.
  // ```
  //   var r = xrange(3) // function() {...}
  //   r()               // [0, 1, 2]
  // ```
  exports.xrange = xrange = function xrange() {
    var args = arguments;
    return function() {
      return apply(range, args);
    };
  };

  // Returns wether x equals y or not.
  // eq does a deep comparison of x and y.
  exports.eq = eq = function eq(x, y) {
    var args = arguments;
    var eq2 = function(x, y) {
      switch(true) {
      case isArrayLike(x) && isArrayLike(y):
        if(x.length === y.length) {
          for(var i = 0; i < x.length; i++)
            if(!eq(x[i], y[i]))
              return false;
          return true;
        } else return false;
      case isObject(x) && isObject(y):
        if(eq(keys(x), keys(y))) {
          for(i in x)
            if(!eq(x[i], y[i]))
              return false;
          return true;
        } else return false;
      default:
        return x === y;
      }
    };
    var reducer = function(x, y, rest) {
      if(rest.length == 1) return eq2(x, y);
      return eq2(x, y) && reducer(rest[0], rest[1], slice(rest, 1));
    };
    return reducer(args[0], args[1], slice(args, 1));
  };

  // Returns true if x is even
  exports.even = even = function even(x) {
    return (x & 1) === 0;
  };

  // Returns true if x is odd
  exports.odd = odd = complement(even);

  // Returns a number one greater than x
  exports.inc = inc = function inc(x) {
    return x + 1;
  };

  // Returns a number one less than x
  exports.dec = dec = function dec(x) {
    return x - 1;
  };

  // Returns true if x equals 0
  exports.eqZero = eqZero = function eqZero(x) {
    return x === 0;
  };

  // Returns true if x equals 1
  exports.eqOne = eqOne = function eqOne(x) {
    return x === 1;
  };

  // Returns true if x is empty.
  // Works on objects, arrays and strings.
  exports.isEmpty = isEmpty = function isEmpty(x) {
    switch(true) {
    case(isArrayLike(x) || isString(x)): return eqZero(x.length);
    case(isObject(x)): return isEmpty(keys(x));
      default: throw new ArgumentError('x must be an Array, a String or an Object');
    }
  };

  // Returns true if x is an Object
  exports.isObject = isObject = function isObject(x) {
    return is('Object')(x) && !isFunction(x);
  };

  // Returns true if x is an Array
  exports.isArray = isArray = is('Array');

  // Returns true if x is a String
  exports.isString = isString = is('String');

  // Returns true if x is a Function
  exports.isFunction = isFunction = is('Function');

  // Returns true if x is an instance of Arguments
  exports.areArguments = areArguments = is('Arguments');

  // Returns true if x is an Array or an instance of Arguments
  exports.isArrayLike = isArrayLike = function isArrayLike(x) {
    return isArray(x) || areArguments(x);
  };

  // Returns true if x is a Number
  exports.isNumber = isNumber = is('Number');

  // Returns true if x is a Boolean
  exports.isBoolean = isBoolean = is('Boolean');

// Use toString?
  // Returns true if x is a Float.
  // Notice: isFloat(1.0) returns false.
  exports.isFloat = isFloat = function isFloat(x) {
    return isNumber(x) && (parseFloat(x) != parseInt(x));
  };

  // Returns true if x is an Int
  // Notice: isInt(1.0) returns true.
  exports.isInt = isInt = function isInt(x) {
    return isNumber(x) && !isFloat(x);
  };

  // Returns true if x is true
  exports.isTrue = isTrue = function isTrue(x) {
    return x === true;
  };

  // Returns true if x is false
  exports.isFalse = isFalse = function isFalse(x) {
    return x === false;
  };

  // Returns true if x is null
  exports.isNull = isNull = function isNull(x) {
    return x === null;
  };

  // Returns true if x is undefined
  exports.isUndefined = isUndefined = function isUndefined(x) {
    return x === void 8;
  };

  // Returns the sum of given arguments.
  // add() returns 0
  exports.add = add = function add() {
    return reduce(function(x, y) {
      return x + y;
    }, arguments, 0);
  };

  // Returns the product of given arguments.
  // mul() returns 1
  exports.mul = mul = function mul() {
    if(isEmpty(arguments)) return 1;
    return reduce(function(x, y) {
      return x * y;
    }, arguments);
  };

  // Subtracts the remaining arguments to the first one.
  // sub() returns 0
  exports.sub = sub = function sub() {
    if(isEmpty(arguments)) return 0;
    return reduce(function(x, y) {
      return x - y;
    }, arguments);
  };

  // Divides the first argument with the others.
  // div() returns 1
  exports.div = div = function div() {
    if(isEmpty(arguments)) return 1;
    return reduce(function(x, y) {
      return x / y;
    }, arguments);
  };

  // Wrapper for the Math.pow function
  exports.pow = pow = function pow(x, y) {
    if(Math.pow) return Math.pow(x, y);

    throw new NotImplementedError('function "pow" is not implemented yet');
  };

  // Wrapper for the Math.sqrt function
  exports.sqrt = sqrt = function sqrt(x) {
    if(Math.sqrt) return Math.sqrt(x);

    throw new NotImplementedError('function "sqrt" is not implemented yet');
  };

  // Convert args to Object which can be used by use and del
  var parseArgs = function(args) {
    return merge(apply(merge, filter(isObject, args)),
                 marshal(map(partial(repeat, 2), filter(isString, args))));
  };

  // May be really messy!
  // Uses in main scope some of the fjs functions.
  // ```
  //   fjs.use('map', 'inc')
  //   map(inc, [1, 2, 3]) // [2, 3, 4]
  //   fjs.del('map', 'inc')
  // ```
  // ```
  //   var vars = ['fmap', 'dec']
  //   fjs.use(vars)
  //   fmap([1, 2, 3], dec) // [0, 1, 2]
  //   fjs.del(vars)
  // ```
  // ```
  //   var vars = [{inc: 'inc2', dec: 'dec2'}, 'map']
  //   fjs.use(vars)
  //   map(inc2, [1, 2, 3]) // [2, 3, 4]
  //   map(dec2, [1, 2, 3]) // [0, 1, 2]
  //   fjs.del(vars)
  // ```
  exports.use = function use() {
    loop(function(fjsname, parentname) {
      if(exports.hasOwnProperty(fjsname)) {
        if(this[parentname]) warn('"' + parentname + '" has  been replaced by fjs.' + fjsname);
        this[parentname] = exports[fjsname];
      }
      else throw new Error('"' + fjsname + '" is not defined in fjs!');
    }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
  };

  // May be really messy!
  // Uses all the exported function of fjs.
  exports.useAll = function useAll() {
    apply(exports.use, filter(function(key) {
      return key != 'use' && key != 'useAll' && key != 'del';
    }, keys(exports)));
  };

  // May be really messy!
  // Deletes variables in the main scope.
  // Handy when you want to clean the scope after using fjs variables.
  // See fjs.use.doc
  exports.del = function del() {
    loop(function(_, parentname) {
      delete this[parentname];
    }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
  };

  // Currying
  // --------

  (function() {
    var fs = ['apply', 'applyWith', 'assoc', 'cons', 'cycle', 'drop', 'dropWhile',
              'every', 'filter', 'get', 'loop', 'map', 'mapkv', 'pow', 'repeat',
              'repeatedly', 'some', 'takeWhile'];
    loop(function(_, v) {
      exports['c'+v] = curry(exports[v]);
    }, fs);
    var fs2 = {'add': 2, 'and': 2, 'conj': 2, 'div': 2, 'eq': 2, 'eq2': 2, 'eq3': 2,
               'fdrop': 2, 'fget': 2, 'fmap': 2, 'fmapkv': 2, 'gt': 2, 'gte': 2, 'lt': 2,
               'lte': 2, 'mul': 2, 'neq2': 2, 'neq3': 2, 'or': 2, 'sub': 2, 'xor': 2};
    loop(function(k, v) {
      exports['c'+k] = curry(exports[k], v);
    }, fs2);
    exports.curriedFunctions = sort(concat(fs, keys(fs2)));
  })();

  // Version
  // -------

  (function() {
    // Returns version of fjs
    exports.version = function() {
      return join(values(exports.version.details), '.');
    };
    exports.version.details = {major: 0, minor: 15, patch: 0};
  })();

  return exports;
})();

// For node
if(window === void 8 && module !== void 8)
  module.exports = fjs;
// For browser
else {
  this.fjs = fjs;
  // Alias \_ with fjs if \_ is not defined yet
  if(this._ === void 8) this._ = this.fjs;
}
// Cleaning
delete fjs;
