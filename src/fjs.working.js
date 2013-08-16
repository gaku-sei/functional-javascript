//     Fjs.js 0.14.0
//     http://github.com/../..
//     (c) 2013 Beviral

var fjs = function() {
  // Vars
  // ----

  var exports = {};
  // Public
  var add, apply, applyWith, and, areArguments, arity, arity0, arity1, arity2, arity3, assoc, attrs, butfirst, butlast, call,
      callWith, clone, comp, complement, concat, conj, cons, cs, curriedFunctions, curry, cycle, dec, del, dir, dir1, div, doc,
      drop, dropWhile, eq, eq2, eq3, eqOne, eqZero, error, error1, even, every, fdrop, fget, filter, first, flatten, flip, fmap, fmapkv,
      fn, freduce, freducekv, freducer, get, gt, gte, id, inc, interpose, isa, isArray, isArrayLike, isBoolean, isEmpty, isFalse,
      isFloat, isFunction, isInt, isNull, isNumber, isObject, isString, isTrue, isUndefined, join, juxt, keys, last, len, log, log1,
      loop, lookup, lt, lte, map, mapkv, marshal, max, merge, min, mul, neq2, not, neq3, odd, or, owns, partial, product, rand, randIndex,
      randInt, range, reduce, reducekv, reducer, repeat, repeatedly, reverse, second, shuffle, slice, some, sort, source, sub, sum,
      takeWhile, thread, time, times, unmarshal, use, useAll, values, version, warn, warn1, xor, xrange, zip;
  // Private
  var is, parseArgs, wip;


  // Functions
  // ---------

  // Create a function with doc
  exports.fn = fn = function() {
    var f = arguments[arguments.length - 1];
    if(typeof f !== 'function')
      throw new Error('Last argument of fn must be a function');
    f.doc = [].slice.call(arguments, 0, -1).join('\n');
    //f.source = f.toString();
    return f;
  };

  // Wrapper for the for statement.
  // loop also checks hasOwnProperty before calling given function.
  exports.loop = loop = fn(
    'Wrapper for the for statement.',
    'loop also checks hasOwnProperty before calling given function.',
    function(f, xs) {
      for(var i in xs)
        if(xs.hasOwnProperty(i))
          f.call(null, i, xs[i]);
    }
  );

  // Throws a work in progress message
  wip = fn(
    'Throws a work in progress message',
    function(fname) {
      throw new Error('function "' + fname + '" is not implemented yet');
    }
  );

  // General purpose type checker
  exports.is = is = fn(
    'General purpose type checker',
    function(type) {
      return function(x) {
        return {}.toString.call(x).slice(8, -1) === type;
      };
    }
  );

  // Wrapper for instanceof operator
  // e.g.: isa({}, Object) // true
  //       var Foo = function() {}
  //       var foo = new Foo
  //       isa(foo, Foo) // true
  //       isa(foo, Foo, Object) // true
  exports.isa = isa = fn(
    'Wrapper for instanceof operator',
    'e.g.: isa({}, Object) // true',
    '      var Foo = function() {}',
    '      var foo = new Foo',
    '      isa(foo, Foo) // true',
    '      isa(foo, Foo, Object) // true',
    function(obj) {
      var fs = butfirst(arguments);
      for(i in fs)
        if(fs.hasOwnProperty(i) && !(obj instanceof fs[i]))
          return false;
      return true;
    }
  );

  // Wrapper for the hasOwnProperty method
  exports.owns = owns = fn(
    'Wrapper for the hasOwnProperty method',
    function(xs, prop) {
      return xs.hasOwnProperty(prop);
    }
  );

  // Negates boolean value
  exports.not = not = fn(
    'Negates boolean value',
    function(bool) {
      return !bool;
    }
  );

  // Wrapper for the == operator
  exports.eq2 = eq2 = fn(
    'Wrapper for the == operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x == y;
        return (x == y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the === operator
  exports.eq3 = eq3 = fn(
    'Wrapper for the === operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x === y;
        return (x === y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the != operator
  exports.neq2 = neq2 = fn(
    'Wrapper for the != operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x != y;
        return (x != y) || reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the != operator
  exports.neq3 = neq3 = fn(
    'Wrapper for the != operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x !== y;
        return (x !== y) || reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the < operator
  exports.lt = lt = fn(
    'Wrapper for the < operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x < y;
        return (x < y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the > operator
  exports.gt = gt = fn(
    'Wrapper for the > operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x > y;
        return (x > y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the <= operator
  exports.lte = lte = fn(
    'Wrapper for the <= operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x <= y;
        return (x <= y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the >= operator
  exports.gte = gte = fn(
    'Wrapper for the >= operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x >= y;
        return (x >= y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the && operator
  exports.and = and = fn(
    'Wrapper for the && operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x && y;
        return (x && y) && reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // Wrapper for the || operator
  exports.or = or = fn(
    'Wrapper for the || operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return x || y;
        return (x || y) || reducer(rest[0], rest[1], slice(rest, 1));
      }
      return reducer(args[0], args[1], slice(args, 1));
    }
  );

  // xor operator
  //#debug(seems to be buggy)
  exports.xor = xor = fn(
    'xor operator',
    function() {
      var args = arguments;
      var reducer = function(x, y, rest) {
        if(rest.length == 1) return !x !== !y && (x || y);
        var val1 = (!x !== !y && (x || y));
        var val2 = reducer(rest[0], rest[1], slice(rest, 1));
        return !val1 !== !val2 && (val1 || val2);
      }
      return reducer(args[0], args[1], slice(args, 1));
      //return !x !== !y && (x || y);
    }
  );

  // Takes a function and returns a function which does the exact thing
  // except it negates the returned boolean value
  exports.complement = complement = fn(
    'Takes a function and returns a function which does the exact thing',
    'except it negates the returned boolean value',
    //partial(comp, not)
    function(f) {
      return function() {
        return !apply(f, arguments);
      };
    }
  );

  // Uses context and rebinds \'this\',
  // it applies a function to an array of arguments.
  // The first argument must be a function,
  // and the second one the context.
  exports.applyWith = applyWith = fn(
    'Uses context and rebinds \'this\',',
    'it applies a function to an array of arguments.',
    'The first argument must be a function,',
    'and the second one the context.',
    function(f, cxt, args) {
      if(!isArrayLike(args))
        throw new Error('args must be an array or some arguments');
      return f.apply(cxt, args);
    }
  );

  // Uses context and rebinds \'this\',
  // It applies a function to a variable number of arguments.
  // The first argument must be a function,
  // and the second one is the context.
  exports.callWith = callWith = fn(
    'Uses context and rebinds \'this\',',
    'It applies a function to a variable number of arguments.',
    'The first argument must be a function,',
    'and the second one is the context.',
    function(f, cxt) {
      return applyWith(f, cxt, slice(arguments, 2));
    }
  );

  // Use with caution as arity may leads to cryptic errors!
  // Limit the arguments given to a function.
  // e.g.: arity(2)(add)(2, 7, 6) //=> 9
  // The first two arguments only are passed to the function add.
  exports.arity = arity = fn(
    'Use with caution as arity may leads to cryptic errors!',
    'Limit the arguments given to a function.',
    'e.g.: arity(2)(add)(2, 7, 6) //=> 9',
    'The first two arguments only are passed to the function add.',
    function(n) {
      return function(f) {
        return function() {
          return apply(f, slice(arguments, 0, n));
        };
      };
    }
  );

  exports.arity0 = arity0 = arity(0);

  exports.arity1 = arity1 = arity(1);

  exports.arity2 = arity2 = arity(2);

  exports.arity3 = arity3 = arity(3);

  // Wrapper for the console object.
  // The function returned by cs itself returns its arguments.
  // e.g.: map(inc, cs(\'log\')(1, 2)) // logs [1, 2] then returns [2, 3]
  //       add(cs(\'log\')(1), 2) // logs 1 then returns 3
  exports.cs = cs = fn(
    'Wrapper for the console object.',
    'The function returned by cs itself returns its arguments.',
    'e.g.: map(inc, cs(\'log\')(1, 2)) // logs [1, 2] then returns [2, 3]',
    '      add(cs(\'log\')(1), 2) // logs 1 then returns 3',
    function(met) {
      return function() {
        var args = arguments.length < 2 ? first(arguments) : slice(arguments);
        console[met](args);
        return args;
      };
    }
  );

  // Returns self
  exports.id = id = fn(
    'Returns self',
    function(x) {
      return x;
    }
  );

  // General purpose clone function.
  // The objects and arrays are mutable in JS
  // clone allows to bypass this with ease.
  exports.clone = clone = fn(
    'General purpose clone function.',
    'The objects and arrays are mutable in JS',
    'clone allows to bypass this with ease.',
    function(x) {
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
    }
  );

  // Returns the attribute doc of an object
  exports.doc = doc = fn(
    'Returns the attribute doc of an object',
    function(obj) {
      return obj.doc;
    }
  );

  //exports.source = source = fn(
  //  'Returns the attribute source of an object',
  //  function(obj) {
  //    return obj.source;
  //  }
  //);

  // Return the length attribute of obj
  exports.len = len = fn(
    'Return the length attribute of obj',
    function(obj) {
      return obj.length;
    }
  );

  // Returns an Object containing all the properties owned by obj.
  // You may get the attrs of everything.
  exports.attrs = attrs = fn(
    'Returns an Object containing all the properties owned by obj.',
    'You may get the attrs of everything.',
    function(obj) {
      ////the functionnal version of attrs:
      //return reducekv(assoc, x, {});

      var attrsObj = {};
      for(var i in obj)
        attrsObj[i] = obj[i];
      return attrsObj;
    }
  );

  // Applies a function to an array of arguments.
  // The first argument must be a function,
  // the context is set to void 8.
  exports.apply = apply = fn(
    'Applies a function to an array of arguments.',
    'The first argument must be a function,',
    'the context is set to void 8.',
    function(f, args) {
      if(!isArrayLike(args))
        throw new Error('args must be an array or some arguments');
      return applyWith(f, void 8, args);
    }
  );

  // Applies a function to a variable number of arguments.
  // The first argument must be a function,
  // the context is set to void 8.
  exports.call = call = fn(
    'Applies a function to a variable number of arguments.',
    'The first argument must be a function,',
    'the context is set to void 8.',
    function(f) {
      return apply(f, butfirst(arguments));
    }
  );

  // Composes functions.
  // e.g.: comp(partial(add, 1), partial(mul, 2))(2) // 5
  //       comp(partial(mul, 2), partial(add, 1), partial(mul, 3))(4) // 26
  exports.comp = comp = fn(
    'Composes functions.',
    'e.g.: comp(partial(add, 1), partial(mul, 2))(2) // 5',
    '      comp(partial(mul, 2), partial(add, 1), partial(mul, 3))(4) // 26',
    function() {
      return reduce(function(f, g) {
        return function() {
          return call(f, apply(g, arguments));
        };
      }, arguments);
    }
  );

  // Based on the function Array.prototype.slice.
  // e.g.: slice(arguments) // similar to [].slice.call(arguments)
  //       slice([1,2,3,4], 1,3) // [2, 3]
  //       slice([1,2,3], -1) // [3]
  //#Array.prototype
  //#finish(if [].slice does not exist)
  exports.slice = slice = fn(
    'Based on the function Array.prototype.slice.',
    'e.g.: slice(arguments) // similar to [].slice.call(arguments)',
    '      slice([1,2,3,4], 1,3) // [2, 3]',
    '      slice([1,2,3], -1) // [3]',
    function(xs) {
      var args = [].slice.call(arguments).slice(1);
      if([].slice) return applyWith([].slice, xs, args);

      wip('slice');
    }
  );

  // Based on Array.prototype.join, join replaces \',\' with \'\'.
  // e.g.: join([\'foo\', \'bar\']) // \'foobar\'
  //#Array.prototype
  exports.join = join = fn(
    'Based on Array.prototype.join, join replaces \',\' with \'\'.',
    'e.g.: join([\'foo\', \'bar\']) // \'foobar\'',
    function(xs) {
      var sep = second(arguments)||'';
      if([].join) return callWith([].join, xs, sep);

      var s = '';
      loop(function(i, x) {
        s += x;
        if((xs.length - 1) !== parseInt(i)) s += sep;
      }, xs);
      return s;
    }
  );

  // Concats several arrays
  //#Array.prototype
  //#notice([].concat raises a RangeError when you try to concat too many arrays in a row on Chrome
  //        ... and so does mine ... but with more arrays)
  exports.concat = concat = fn(
    'Concats several arrays',
    function() {
      //if([].concat) {
      //  var args = some(areArguments, arguments) ? map(slice, arguments) : arguments;
      //  return [].concat.apply([], arguments);
      //}

      ////the functionnal version of concat:
      //return reduce(function(xs, ys) {
      //  applyWith([].push, xs, slice(ys||[]));
      //  return xs;
      //}, arguments, []);

      var xs = [];
      for(var i in arguments)
        for(var j in arguments[i])
          xs.push(arguments[i][j]);
      return xs;
    }
  );

  // Applies f to each item of xs and returns the results as an array.
  // e.g.: map(partial(add, 2), [1, 2, 4]) // [3, 4, 6]
  //#Array.prototype
  exports.map = map = fn(
    'Applies f to each item of xs and returns the results as an array.',
    'e.g.: map(partial(add, 2), [1, 2, 4]) // [3, 4, 6]',
    function(f, xs) {
      if([].map) return callWith([].map, xs, arity1(f));

      ////the functionnal version of map:
      //return reduce(function(agg, x) {
      //  return conj(agg, call(f, x));
      //}, xs, []);

      var ret = [];
      loop(function(i, x) {
        ret.push(call(f, x));
      }, xs);
      return ret;
    }
  );

  // Like map but mapkv also passes the key to the given function.
  // Notice that if xs is an Array its indexes are automatically casted into Int.
  //#Array.prototype
  //#notice(for any reason my version of mapkv is way faster on Chrome)
  //#modify(should return an array or an object?)
  exports.mapkv = mapkv = fn(
    'Like map but mapkv also passes the key to the given function.',
    'Notice that if xs is an Array its indexes are automatically casted into Int.',
    function(f, obj) {
      //if([].map && !isObject(obj)) return callWith([].map, obj, arity2(flip(f)));

      ////the functionnal version of mapkv:
      //return reducekv(function(agg, k, v) {
      //  return conj(agg, call(f, k, v));
      //}, xs, []);

      var ret = [];
      loop(function(k, v) {
        ret.push(f.call(f, isArrayLike(obj) ? parseInt(k) : k, v));
      }, obj);
      return ret;
    }
  );

  // Returns an array of the items in coll for which pred(x) returns true
  //#Array.prototype
  exports.filter = filter = fn(
    'Returns an array of the items in coll for which pred(x) returns true',
    function(pred, xs) {
      if([].filter) return callWith([].filter, xs, arity1(pred));

      var ys = [];
      loop(function(_, x) {
        if(pred(x)) ys.push(x);
      }, xs);
      return ys;
    }
  );

  // Sort element of an array.
  // You can pass a sorter function to sort.
  //#Array.prototype
  //#finish(if [].sort does not exist)
  exports.sort = sort = fn(
    'Sort element of an array.',
    'You can pass a sorter function to sort.',
    function(comp, xs) {
      if(isUndefined(xs)) {
        xs = comp;
        comp = undefined;
      }
      if([].sort) return callWith([].sort, xs, comp);

      wip('sort');
    }
  );

  // Returns a shuffled xs
  exports.shuffle = shuffle = fn(
    'Returns a shuffled xs',
    function(xs) {
      var ys = Array(xs.length);
      for(i in xs) {
        var r = randInt(i);
        ys[i] = ys[r];
        ys[r] = xs[i];
      }
      return ys;
    }
  );

  // Zips arrays together.
  // e.g.: zip([1, 2, 3], [4, 5, 6]) // [[1, 4], [2, 5], [3, 6]]
  exports.zip = zip = fn(
    'Zips arrays together.',
    'e.g.: zip([1, 2, 3], [4, 5, 6]) // [[1, 4], [2, 5], [3, 6]]',
    function() {
      var ret = [],
          args = arguments,
          len = apply(min , map(exports.len, args));
      if(args.length == 1) return first(args);
      for(var i = 0; i < len; i++) {
        ret.push(map(exports.cfget(i), args));
      }
      return ret;
    }
  );

  // Flattens an ArrayLike object
  //#test #finish
  exports.flatten = flatten = fn(
    'Flattens an ArrayLike object',
    function(xs) {
      wip('flatten');
      var ret = [];
      loop(function(_, v) {
        ret.push(isArrayLike(v) ? flatten(v) : v);
      }, xs);
      return ret;
    }
  );

  // Returns min value
  exports.min = min = fn(
    'Returns min value',
    function() {
      return reduce(Math.min, arguments);
    }
  );

  // Returns max value
  exports.max = max = fn(
    'Returns max value',
    function() {
      return reduce(Math.max, arguments);
    }
  );

  // Wrapper for the Math.random function.
  // rand returns a random floating point number between 0 and n (default 1).
  exports.rand = rand = fn(
    'Wrapper for the Math.random function.',
    'rand returns a random floating point number between 0 and n (default 1).',
    function() {
      var n = first(arguments)||1;
      return Math.random() * n;
    }
  );

  // Returns a random integer between 0 and n.
  // randInt() always returns 0.
  exports.randInt = randInt = fn(
    'Returns a random integer between 0 and n.',
    'randInt() always returns 0.',
    function(n) {
      return parseInt(rand(n));
    }
  );

  // Returns a random item of xs
  exports.randIndex = randIndex = fn(
    'Returns a random item of xs',
    function(xs) {
      return xs[randInt(xs.length)];
    }
  );

  // Calls function f n times
  exports.times = times = fn(
    'Calls function f n times',
    'Is void.',
    function(n, f) {
      while(n--)
        apply(f, slice(arguments, 2));
    }
  );

  // Returns an Array containing the items of xs
  // while pred(item) is true.
  exports.takeWhile = takeWhile = fn(
    'Returns an Array containing the items of xs',
    'while pred(item) is true.',
    function(pred, xs) {
      for(var i = 0; i < xs.length && pred(xs[i]); i++);
      return slice(xs, 0, i);
    }
  );

  // Drops all the items of xs while pred(item) is true
  // and returns all the remaining items as an Array
  exports.dropWhile = dropWhile = fn(
    'Drops all the items of xs while pred(item) is true',
    'and returns all the remaining items as an Array',
    function(pred, xs) {
      for(var i = 0; i < xs.length && pred(xs[i]); i++);
      return slice(xs, i);
    }
  );

  // Returns an array of the elements of xs separated of sep
  exports.interpose = interpose = fn(
    'Returns an array of the elements of xs separated of sep',
    function(sep, xs) {
      var len = xs.length * 2 - 1, ret = [];
      for(var i = 0; i < len; i++)
        ret.push(odd(i) ? sep : xs[i/2]);
      return ret;
    }
  );

  // Returns the keys of an Object
  exports.keys = keys = fn(
    'Returns the keys of an Object',
    //partial(mapkv, id)
    function(obj) {
      return mapkv(id, obj);
    }
  );

  // Returns the values of an Object
  exports.values = values = fn(
    'Returns the values of an Object',
    function(obj) {
      return mapkv(flip(id), obj);
    }
  );

  // Merges a variable number of objects
  exports.merge = merge = fn(
    'Merges a variable number of objects',
    function() {
      ////the functionnal version of merge:
      //return marshal(concat(unmarshal(xs), unmarshal(ys)));

      var merge2 = function(obj1, obj2) {
        var ret = {};
        for(k in obj1) ret[k] = obj1[k];
        for(k in obj2) ret[k] = obj2[k];
        return ret;
      };
      return reduce(merge2, arguments, {});
    }
  );

  // Assoc key/value to object.
  // Equivalent to `obj[k] = v` but doesn\'t modify obj.
  exports.assoc = assoc = fn(
    'Assoc key/value to object.',
    'Equivalent to `obj[k] = v` but doesn\'t modify obj.',
    function(obj, k, v) {
      var assocedObj = clone(obj);
      assocedObj[k] = v;
      return assocedObj;
    }
  );

  // Converts an array of pairs into an object
  exports.marshal = marshal = fn(
    'Converts an array of pairs into an object',
    function(xs) {
      return reduce(function(agg, x) {
        agg[first(x)] = second(x);
        return agg;
      }, xs, {});
    }
  );

  // Converts an object into an array of pairs
  exports.unmarshal = unmarshal = fn(
    'Converts an object into an array of pairs',
    function(obj) {
      return mapkv(function(k, v) {
        return [k, v];
      }, obj);
    }
  );

  // Prepends x to xs.
  // e.g.: cons([2, 3], 1) // [1, 2, 3]
  exports.cons = cons = fn(
    'Prepends x to xs.',
    'e.g.: cons([2, 3], 1) // [1, 2, 3]',
    function(xs, x) {
      return concat([x], xs);
    }
  );

  // Appends arguments to xs.
  // e.g.: conj([1, 2], 3) // [1, 2, 3]
  exports.conj = conj = fn(
    'Appends arguments to xs.',
    'e.g.: conj([1, 2], 3) // [1, 2, 3]',
    function(xs) {
      //var ys = clone(xs);
      //applyWith([].push, ys, butfirst(arguments));
      //return ys;
      return concat(xs, butfirst(arguments));
    }
  );

  // Drops the n first elements of xs
  exports.drop = drop = fn(
    'Drops the n first elements of xs',
    function(n, xs) {
      return slice(xs, n);
    }
  );

  // Returns the first element of xs
  exports.first = first = fn(
    'Returns the first element of xs',
    function(xs) {
      return xs[0];
    }
  );

  // Returns all the elements of xs but the first one
  exports.butfirst = butfirst = fn(
    'Returns all the elements of xs but the first one',
    function(xs) {
      return slice(xs, 1);
    }
  );

  // Returns the second element of xs
  exports.second = second = fn(
    'Returns the second element of xs',
    function(xs) {
      return xs[1];
    }
  );

  // Returns the last elements of xs
  exports.last = last = fn(
    'Returns the last elements of xs',
    function(xs) {
      return xs[xs.length - 1];
    }
  );

  // Returns all the elements of xs but the last one
  exports.butlast = butlast = fn(
    'Returns all the elements of xs but the last one',
    function(xs) {
      return slice(xs, 0, -1);
    }
  );

  // Similar to obj[i]
  exports.get = get = fn(
    'Similar to obj[i]',
    function(obj, i) {
      return obj[i];
    }
  );

  // Object, Array, String and arguments lookup.
  // e.g.: lookup([1, 2, 3], 0) // 1
  //       lookup({foo: {bar: [1, 2]}}, [\'foo\', \'bar\', 1]) // 2
  //       lookup([1, 2], 4, \'Not Found...\') // \'Not Found...\'.
  exports.lookup = lookup = fn(
    'Object, Array, String and arguments lookup.',
    'e.g.: lookup([1, 2, 3], 0) // 1',
    '      lookup({foo: {bar: [1, 2]}}, [\'foo\', \'bar\', 1]) // 2',
    '      lookup([1, 2], 4, \'Not Found...\') // \'Not Found...\'.',
    function(xs, ks, notFound) {
      var found;
      if(isArrayLike(ks))
        found = eqOne(ks.length)
          ? xs[first(ks)]
          : /*?if(xs[first(ks)])*/ lookup(xs[first(ks)], butfirst(ks));
      else found = xs[ks];
      return isUndefined(found) ? notFound : found;
    }
  );

  // Sums the elements of an array
  exports.sum = sum = fn(
    'Sums the elements of an array',
    function(xs) {
      return reduce(add, xs);
    }
  );

  // Returns the product of the elements of an array
  exports.product = product = fn(
    'Returns the product of the elements of an array',
    function(xs) {
      return reduce(mul, xs);
    }
  );

  // Returns an array containing n repetitions of the items in xs
  exports.cycle = cycle = fn(
    'Returns an array containing n repetitions of the items in xs',
    function(n, xs) {
      var ys = [];
      while(n--)
        applyWith([].push, ys, xs);
      return ys;
    }
  );

  // Returns an array containing n times x
  exports.repeat = repeat = fn(
    'Returns an array containing n times x',
    function(n, x) {
      if(n < 1) return [];
      var xs = [];
      for(var i = 0; i < n; i++)
        xs[i] = x;
      return xs;
    }
  );

  // Returns an array containing n times f()
  exports.repeatedly = repeatedly = fn(
    'Returns an array containing n times f()',
    function(n, f) {
      if(n < 1) return [];
      var xs = [];
      for(var i = 0; i < n; i++)
        xs[i] = f();
      return xs;
    }
  );

  // The first argument is a function which takes two arguments,
  // the second one is an array and you may pass a third argument which is an aggregator
  // the aggregator is the first element of xs by default.
  // e.g.: reduce(add, [1, 2, 3]) // 6
  //       reduce(add, [1, 2, 3], 2) // 8
  //#Array.prototype
  exports.reduce = reduce = fn(
    'The first argument is a function which takes two arguments,',
    'the second one is an array and you may pass a third argument which is an aggregator',
    'the aggregator is the first element of xs by default.',
    'e.g.: reduce(add, [1, 2, 3]) // 6',
    '      reduce(add, [1, 2, 3], 2) // 8',
    function(f, xs, agg) {
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
    }
  );

  // The first argument is a function which takes three arguments,
  // the second one is an array and the third one is an aggregator
  // e.g.: var f = function(agg, _, v) { return agg + v }
  //       reducekv(f, {foo: 1, bar: 2, baz: 3}, 0) // 6
  //       reducekv(f, {foo: 1, bar: 2, baz: 3}, 2) // 8
  //#Array.prototype
  exports.reducekv = reducekv = fn(
    'The first argument is a function which takes three arguments,',
    'the second one is an array and the third one is an aggregator',
    'e.g.: var f = function(agg, _, v) { return agg + v }',
    '      reducekv(f, {foo: 1, bar: 2, baz: 3}, 0) // 6',
    '      reducekv(f, {foo: 1, bar: 2, baz: 3}, 2) // 8',
    function(f, obj, agg) {
      if([].reduce && !isObject(obj)) return callWith([].reduce, obj, arity3(f), agg);

      var reducer = function(obj, agg) {
        if(isEmpty(obj)) return agg;
        return reducer(butfirst(obj), call(f, agg, obj[0][0], obj[0][1]));
      };
      return reducer(unmarshal(obj), agg);
    }
  );

  // Similar to reduce but starts iteration at the end of the array.
  // e.g.: reduce(sub, [10, 2, 5]) // 3
  //       reducer(sub, [10, 2, 5]) // -7
  //#Array.prototype
  exports.reducer = reducer = fn(
    'Similar to reduce but starts iteration at the end of the array.',
    'e.g.: reduce(sub, [10, 2, 5]) // 3',
    '      reducer(sub, [10, 2, 5]) // -7',
    function(f, xs, agg) {
      if([].reduce) {
        if(isUndefined(agg))
          return callWith([].reduceRight, xs, arity2(f));
        else return callWith([].reduceRight, xs, arity2(f), agg);
      }

      //reducer is named reducer2 for readability
      var reducer2 = function(ys, agg) {
        if(isEmpty(ys)) return agg;
        return reducer2(butlast(ys), call(f, agg, last(ys)));
      };
      if(isUndefined(agg))
        return reducer2(butlast(xs), last(xs));
      else return reducer2(xs, agg);
    }
  );

  // Reverses the elements of an array.
  //#Array.prototype
  //#notice(for any reason my version of reverse is way faster on Chrome)
  exports.reverse = reverse = fn(
    'Reverses the elements of an array.',
    function(xs) {
      //if([].reverse) return callWith([].reverse, clone(xs));

      ////the functionnal version of reverse:
      //return reduce(cons, xs, []);

      var ys = Array(xs.length), i = xs.length;
      while(i > 0)
        ys[xs.length - i] = xs[--i];
      return ys;
    }
  );

  // Applies pred to each items of xs.
  // If pred(item) is true every time, return true.
  //#Array.prototype
  //#notice(for any reason my version of every is way faster on Chrome)
  exports.every = every = fn(
    'Applies pred to each items of xs.',
    'If pred(item) is true every time, return true.',
    function(pred, xs) {
      //if([].every) return callWith([].every, xs, arity1(pred));

      for(i in xs)
        if(xs.hasOwnProperty(i) && !pred(xs[i]))
          return false;
      return true;
    }
  );

  // Applies pred to each items of xs.
  // If pred(item) is true, returns true.
  //#Array.prototype
  //#notice(for any reason my version of some is way faster on Chrome)
  exports.some = some = fn(
    'Applies pred to each items of xs.',
    'If pred(item) is true, returns true.',
    function(pred, xs) {
      //if([].some) return callWith([].some, xs, arity1(pred));

      for(i in xs)
        if(xs.hasOwnProperty(i))
          if(pred(xs[i]))
            return true;
      return false;
    }
  );

  // Targeting readability, thread looks like OOP writting.
  // e.g.: inc(first([1,3])) becomes thread([1,3], first, inc) // 2
  exports.thread = thread = fn(
    'Targeting readability, thread looks like OOP writting.',
    'e.g.: inc(first([1,3])) becomes thread([1,3], first, inc) // 2',
    function() {
      return apply(flip(comp), butfirst(arguments))(first(arguments));
    }
  );

  // Partially applies a function to a variable number of arguments
  // e.g.: partial(add, 1)(2) // 3
  exports.partial = partial = fn(
    'Partially applies a function to a variable number of arguments',
    'e.g.: partial(add, 1)(2) // 3',
    function(f) {
      var args = butfirst(arguments);
      return function() {
        return apply(f, concat(args, arguments));
      };
    }
  );

  // Allows to curry a function.
  // The arity if by default f.length, but it can be set.
  // e.g.: var cmap = curry(map)
  //       var mapinc = cmap(inc)
  //       mapinc([1, 2, 3]) // [2, 3, 4]
  //       mapinc([2, 3, 4]) // [3, 4, 5]
  // e.g.: var cadd = curry(add, 3)
  //       cadd(1)(2)(3) // 6
  exports.curry = curry = fn(
    'Allows to curry a function.',
    'The arity if by default f.length, but it can be set.',
    'e.g.: var cmap = curry(map)',
    '      var mapinc = cmap(inc)',
    '      mapinc([1, 2, 3]) // [2, 3, 4]',
    '      mapinc([2, 3, 4]) // [3, 4, 5]',
    'e.g.: var cadd = curry(add, 3)',
    '      cadd(1)(2)(3) // 6',
    function(f, arity) {
      var curried = function(args, arity) {
        return function(arg) {
          if(arity > 1)
            return curried(conj(args, arg), dec(arity));
          else return apply(f, conj(args, arg));
        };
      };
      return curried([], arity || f.length);
    }
  );

  // Sequentially applies each function to a variadic number of arguments
  // then returns an array with the results.
  // e.g.: juxt(inc, dec)(2) // [3,1]
  exports.juxt = juxt = fn(
    'Sequentially applies each function to a variadic number of arguments',
    'then returns an array with the results.',
    'e.g.: juxt(inc, dec)(2) // [3,1]',
    function() {
      var fs = arguments;
      return function() {
        var args = arguments;
        return map(function(f) {
          return apply(f, args);
        }, fs);
      };
    }
  );

  // Flips the arguments given to a function.
  // e.g.: div(10, 2) // 5
  //       flip(div)(10, 2) // 0.2
  exports.flip = flip = fn(
    'Flips the arguments given to a function.',
    'e.g.: div(10, 2) // 5',
    '      flip(div)(10, 2) // 0.2',
    function(f) {
      return function() {
        return apply(f, reverse(arguments));
      };
    }
  );

  // Flips the arguments given to drop
  exports.fdrop = fdrop = fn(
    'Flips the arguments given to drop',
    flip(drop)
  );

  // Flips the arguments given to get
  exports.fget = fget = fn(
    'Flips the arguments given to get',
    flip(get)
  );

  // Flips the arguments given to map
  exports.fmap = fmap = fn(
    'Flips the arguments given to map',
    flip(map)
  );

  // Flips the arguments given to mapkv
  exports.fmapkv = fmapkv = fn(
    'Flips the arguments given to mapkv',
    flip(mapkv)
  );

  // Flips the arguments given to reduce.
  // The aggregator remains the third and last argument.
  // e.g.: freduce([2, 3], mul) // 6
  //       freduce([2, 3], mul, 2) // 12
  exports.freduce = freduce = fn(
    'Flips the arguments given to reduce.',
    'The aggregator remains the third and last argument.',
    'e.g.: freduce([2, 3], mul) // 6',
    '      freduce([2, 3], mul, 2) // 12',
    function(xs, f, agg) {
      return reduce(f, xs, agg)
    }
  );

  // Flips the arguments given to reducekv.
  // The aggregator remains the third and last argument.
  // e.g.: var obj = {foo: 1, bar: 2, baz: 3}
  //       var f = function(agg, _, v) { return agg * v }
  //       freducekv(obj, f, 1) // 6
  //       freducekv(obj, f, 2) // 12
  exports.freducekv = freducekv = fn(
    'Flips the arguments given to reducekv.',
    'The aggregator remains the third and last argument.',
    'e.g.: var obj = {foo: 1, bar: 2, baz: 3}',
    '      var f = function(agg, _, v) { return agg * v }',
    '      freducekv(obj, f, 1) // 6',
    '      freducekv(obj, f, 2) // 12',
    function(obj, f, agg) {
      return reducekv(f, obj, agg)
    }
  );

  // Flips the argument given to reducer.
  // The aggregator remains the third and last argument.
  // e.g.: freducer([3, 2, 10], sub) // 5
  exports.freducer = freducer = fn(
    'Flips the argument given to reducer.',
    'The aggregator remains the third and last argument.',
    'e.g.: freducer([3, 2, 10], sub) // 5',
    function(xs, f, agg) {
      return reducer(f, xs, agg);
    }
  );

  // console.log and returns the given argument(s)
  exports.log = log = fn(
    'console.log and returns the given argument(s)',
    cs('log')
  );

  // console.log and returns the first argument given
  exports.log1 = log1 = fn(
    'console.log and returns the first argument given',
    arity1(log)
  );

  // console.dir and returns the given argument(s)
  exports.dir = dir = fn(
    'console.dir and returns the given argument(s)',
    cs('dir')
  );

  // console.dir and returns the first argument given
  exports.dir1 = dir1 = fn(
    'console.dir and returns the first argument given',
    arity1(dir)
  );

  // console.warn and returns the given argument(s)
  exports.warn = warn = fn(
    'console.warn and returns the given argument(s)',
    cs('warn')
  );

  // console.warn and returns the first argument given
  exports.warn1 = warn1 = fn(
    'console.warn and returns the first argument given',
    arity1(warn)
  );

  // console.error and returns the given argument(s)
  exports.error = error = fn(
    'console.error and returns the given argument(s)',
    cs('error')
  );

  // console.error and returns the first argument given
  exports.error1 = error1 = fn(
    'console.error and returns the first argument given',
    arity1(error)
  );

  // Uses console.time and console.timeEnd to calculate
  // the time taken by a given function and returns its value.
  // Remainings arguments are given to function.
  exports.time = time = fn(
    'Uses console.time and console.timeEnd to calculate',
    'the time taken by a given function and returns its value.',
    'Remainings arguments are given to function.',
    function(f) {
      var label = '#' + (f.name || 'unknown') + ' #fjs-time-label-' + (new Date).getTime();
      var args = butfirst(arguments);
      console.time(label);
      var ret = apply(f, args);
      console.timeEnd(label);
      return ret;
    }
  );

  // Returns an array.
  // Step must be positive.
  // e.g.: range(5) // [0, 1, 2, 3, 4]
  //       range(3, 6) // [3, 4, 5]
  //       range(3, 10, 2) // [3, 5, 7, 9]
  exports.range = range = fn(
    'Returns an array.',
    'Step must be positive.',
    'e.g.: range(5) // [0, 1, 2, 3, 4]',
    '      range(3, 6) // [3, 4, 5]',
    '      range(3, 10, 2) // [3, 5, 7, 9]',
    function() {
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
    }
  );

  // Pending version of range.
  // e.g.: var r = xrange(3) // function() {...}
  //       r() // [0, 1, 2]
  exports.xrange = xrange = fn(
    'Pending version of range.',
    'e.g.: var r = xrange(3) // function() {...}',
    '      r() // [0, 1, 2]',
    function() {
      var args = arguments;
      return function() {
        return apply(range, args);
      };
    }
  );

  // Returns wether x equals y or not.
  // eq does a deep comparison of x and y.
  exports.eq = eq = fn(
    'Returns wether x equals y or not.',
    'eq does a deep comparison of x and y.',
    function(x, y) {
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
    }
  );

  // Returns true if x is even
  exports.even = even = fn(
    'Returns true if x is even',
    function(x) {
      return (x & 1) === 0;
    }
  );

  // Returns true if x is odd
  exports.odd = odd = fn(
    'Returns true if x is odd',
    complement(even)
  );

  // Returns a number one greater than x
  exports.inc = inc = fn(
    'Returns a number one greater than x',
    function(x) {
      return x + 1;
    }
  );

  // Returns a number one less than x
  exports.dec = dec = fn(
    'Returns a number one less than x',
    function(x) {
      return x - 1;
    }
  );

  // Returns true if x equals 0
  exports.eqZero = eqZero = fn(
    'Returns true if x equals 0',
    function(x) {
      return x === 0;
    }
  );

  // Returns true if x equals 1
  exports.eqOne = eqOne = fn(
    'Returns true if x equals 1',
    function(x) {
      return x === 1;
    }
  );

  // Returns true if x is empty.
  // Works on objects, arrays and strings.
  exports.isEmpty = isEmpty = fn(
    'Returns true if x is empty.',
    'Works on objects, arrays and strings.',
    function(x) {
      switch(true) {
      case(isArrayLike(x) || isString(x)): return eqZero(x.length);
      //case(isObject(x)): for(i in x) return false; return true;
      case(isObject(x)): return isEmpty(keys(x));
      default: throw new Error('x must be an Array, a String or an Object');
      }
    }
  );

  // Returns true if x is an Object
  exports.isObject = isObject = fn(
    'Returns true if x is an Object',
    function(x) {
      return is('Object')(x) && !isFunction(x);
    }
  );

  // Returns true if x is an Array
  exports.isArray = isArray = fn(
    'Returns true if x is an Array',
    is('Array')
  );

  // Returns true if x is a String
  exports.isString = isString = fn(
    'Returns true if x is a String',
    is('String')
  );

  // Returns true if x is a Function
  exports.isFunction = isFunction = fn(
    'Returns true if x is a Function',
    is('Function')
    //function(x) {
    //  return typeof x === 'function';
    //}
  );

  // Returns true if x is an instance of Arguments
  exports.areArguments = areArguments = fn(
    'Returns true if x is an instance of Arguments',
    is('Arguments')
    //function(x) {
    //  if(isNull(x) || isUndefined(x)) return false;
    //  return x.toString && x.toString() === '[object Arguments]';
    //}
  );

  // Returns true if x is an Array or an instance of Arguments
  exports.isArrayLike = isArrayLike = fn(
    'Returns true if x is an Array or an instance of Arguments',
    function(x) {
      return isArray(x) || areArguments(x);
    }
  );

  // Returns true if x is a Number
  exports.isNumber = isNumber = fn(
    'Returns true if x is a Number',
    is('Number')
  );

  // Returns true if x is a Boolean
  exports.isBoolean = isBoolean = fn(
    'Returns true if x is a Boolean',
    is('Boolean')
  );

  // Returns true if x is a Float.
  // Notice: isFloat(1.0) returns false.
  exports.isFloat = isFloat = fn(
    'Returns true if x is a Float.',
    'Notice: isFloat(1.0) returns false.',
    function(x) {
      return isNumber(x) && (parseFloat(x) != parseInt(x));
    }
  );

  // Returns true if x is an Int
  // Notice: isInt(1.0) returns true.
  exports.isInt = isInt = fn(
    'Returns true if x is an Int',
    'Notice: isInt(1.0) returns true.',
    function(x) {
      return isNumber(x) && !isFloat(x);
    }
  );

  // Returns true if x is true
  exports.isTrue = isTrue = fn(
    'Returns true if x is true',
    function(x) {
      return x === true;
    }
  );

  // Returns true if x is false
  exports.isFalse = isFalse = fn(
    'Returns true if x is false',
    function(x) {
      return x === false;
    }
  );

  // Returns true if x is null
  exports.isNull = isNull = fn(
    'Returns true if x is null',
    function(x) {
      return x === null;
    }
  );

  // Returns true if x is undefined
  exports.isUndefined = isUndefined = fn(
    'Returns true if x is undefined',
    function(x) {
      return x === undefined;
    }
  );

  // Returns the sum of given arguments.
  // add() returns 0
  exports.add = add = fn(
    'Returns the sum of given arguments.',
    'add() returns 0',
    function() {
      return reduce(function(x, y) {
        return x + y;
      }, arguments, 0);
    }
  );

  // Returns the product of given arguments.
  // mul() returns 1
  exports.mul = mul = fn(
    'Returns the product of given arguments.',
    'mul() returns 1',
    function() {
      if(isEmpty(arguments)) return 1;
      return reduce(function(x, y) {
        return x * y;
      }, arguments);
    }
  );

  // Subtracts the remaining arguments to the first one.
  // sub() returns 0
  exports.sub = sub = fn(
    'Subtracts the remaining arguments to the first one.',
    'sub() returns 0',
    function() {
      if(isEmpty(arguments)) return 0;
      return reduce(function(x, y) {
        return x - y;
      }, arguments);
    }
  );

  // Divides the first argument with the others.
  // div() returns 1
  exports.div = div = fn(
    'Divides the first argument with the others.',
    'div() returns 1',
    function() {
      if(isEmpty(arguments)) return 1;
      return reduce(function(x, y) {
        return x / y;
      }, arguments);
    }
  );

  // Convert args to Object which can be used by use and del
  parseArgs = fn(
    'Convert args to Object which can be used by use and del',
    function(args) {
      ////the imperative version of parseArgs:
      //var parsedArgs = {};
      //loop(function(_, arg) {
      //  if(isObject(arg))
      //    loop(function(k, v) { parsedArgs[k] = v; }, arg);
      //  else parsedArgs[arg] = arg;
      //}, args);
      //return parsedArgs;

      return merge(apply(merge, filter(isObject, args)),
                   marshal(map(partial(repeat, 2), filter(isString, args))));
    }
  );

  // May be really messy!
  // Uses in main scope some of the fjs functions.
  // e.g.: fjs.use(\'map\', \'inc\')
  //       map(inc, [1, 2, 3]) // [2, 3, 4]
  //       fjs.del(\'map\', \'inc\')
  // e.g.: var vars = [\'fmap\', \'dec\']
  //       fjs.use(vars)
  //       fmap([1, 2, 3], dec) // [0, 1, 2]
  //       fjs.del(vars)
  // e.g.: var vars = [{inc: \'inc2\', dec: \'dec2\'}, \'map\']
  //       fjs.use(vars)
  //       map(inc2, [1, 2, 3]) // [2, 3, 4]
  //       map(dec2, [1, 2, 3]) // [0, 1, 2]
  //       fjs.del(vars)
  //#messy
  exports.use = fn(
    'May be really messy!',
    'Uses in main scope some of the fjs functions.',
    'e.g.: fjs.use(\'map\', \'inc\')',
    '      map(inc, [1, 2, 3]) // [2, 3, 4]',
    '      fjs.del(\'map\', \'inc\')',
    'e.g.: var vars = [\'fmap\', \'dec\']',
    '      fjs.use(vars)',
    '      fmap([1, 2, 3], dec) // [0, 1, 2]',
    '      fjs.del(vars)',
    'e.g.: var vars = [{inc: \'inc2\', dec: \'dec2\'}, \'map\']',
    '      fjs.use(vars)',
    '      map(inc2, [1, 2, 3]) // [2, 3, 4]',
    '      map(dec2, [1, 2, 3]) // [0, 1, 2]',
    '      fjs.del(vars)',
    function() {
      loop(function(fjsname, parentname) {
        if(exports.hasOwnProperty(fjsname)) {
          //if(parent[parentname]) warn('"' + parentname + '" has  been replaced by fjs.' + fjsname);
          //parent[parentname] = exports[fjsname];
          if(this[parentname]) warn('"' + parentname + '" has  been replaced by fjs.' + fjsname);
          this[parentname] = exports[fjsname];
        }
        else throw new Error('"' + fjsname + '" is not defined in fjs!');
      }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
    }
  );

  // May be really messy!
  // Uses all the exported function of fjs.
  //#messy
  exports.useAll = fn(
    'May be really messy!',
    'Uses all the exported function of fjs.',
    function() {
      apply(exports.use, filter(function(key) {
        return key != 'use' && key != 'useAll' && key != 'del';
      }, keys(exports)));
    }
  );

  // May be really messy!
  // Deletes variables in the main scope.
  // Handy when you want to clean the scope after using fjs variables.
  // See fjs.use.doc
  //#messy
  exports.del = fn(
    'May be really messy!',
    'Deletes variables in the main scope.',
    'Handy when you want to clean the scope after using fjs variables.',
    'See fjs.use.doc',
    function() {
      loop(function(_, parentname) {
        //delete parent[parentname];
        delete this[parentname];
      }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
    }
  );

  // Currying
  // --------

  (function() {
    var fs = ['apply', 'applyWith', 'assoc', 'cons', 'cycle', 'drop', 'dropWhile',
              'every', 'filter', 'get', 'loop', 'map', 'mapkv', 'repeat', 'repeatedly',
              'some', 'takeWhile'];
    loop(function(_, v) {
      exports['c'+v] = curry(exports[v]);
    }, fs);
    var fs2 = {'add': 2, 'and': 2, 'div': 2, 'eq': 2, 'eq2': 2, 'eq3': 2, 'fdrop': 2,
               'fget': 2, 'fmap': 2, 'fmapkv': 2, 'gt': 2, 'gte': 2, 'lt': 2, 'lte': 2,
               'mul': 2, 'neq2': 2, 'neq3': 2, 'or': 2, 'sub': 2, 'xor': 2};
    loop(function(k, v) {
      exports['c'+k] = curry(exports[k], v);
    }, fs2);
    exports.curriedFunctions = sort(concat(fs, keys(fs2)));
  })();

  // Version
  // -------

  (function() {
    // Returns version of fjs
    exports.version = fn(
      'Returns version of fjs',
      function() {
        return join(values(exports.version.details), '.');
      }
    );
    exports.version.details = {major: 0, minor: 14, patch: 0};
  })();

  return exports;
}();

if(typeof window === 'undefined' && typeof module !== 'undefined') {
  module.exports = fjs;
} else {
  this.fjs = fjs;
  if(typeof this._ === 'undefined') this._ = this.fjs;
}
delete fjs;
