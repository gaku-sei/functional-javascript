this.fjs = function() {
  var exports = {};
  //public
  var fn, id, flip, map, mapkv, loop, cs, slice, isArrayLike, isArray, isArgument, isString, isNull, isUndefined, isObject, isEmpty, first, second,
      isFunction, clone, call, apply, butfirst, concat, reduce, eq, eqZero, eqOne, get, conj, repeat, cycle, filter, cons, reverse, even, odd, applyWith,
      callWith, arity, arity0, arity1, arity2, arity3, doc, source, attrs, join, times, last, butlast, sum, every, range, xrange, some, comp, thread,
      marshal, unmarshal, partial, juxt, fmap, fmapkv, freduce, log, log1, dir, dir1, warn, warn1, error, error1, inc, dec, add, sub, mul, div, merge,
      assoc, reducekv, freducekv, keys, values, takeWhile, dropWhile, isTrue, isFalse, use, useAll, version;
  //private
  var wip, is, parseArgs;

  exports.fn = fn = function() {
    var f = arguments[arguments.length - 1];
    if(typeof f !== 'function')
      throw Error('Last argument of fn must be a function.');
    f.doc = [].slice.call(arguments, 0, -1).join('\n');
    f.source = f.toString();
    return f;
  };

  exports.loop = loop = fn(
    'Wrapper for the for statement.',
    'loop also checks hasOwnProperty before calling given function.',
    function(f, xs) {
      for(var i in xs)
        if(xs.hasOwnProperty(i))
          f.call(null, i, xs[i]);
    }
  );

  wip = fn(
    'Throws a work in progress message',
    function(fname) {
      throw Error('function "' + fname + '" is not implemented yet');
    }
  );

  is = fn(
    'General purpose type checker.',
    'By the way it\'s only used in isArray, isObject and isString.',
    function(type) {
      return function(x) {
        return second(toString.call(x).match(/\s(\w+)\]$/i)) === type;
      };
    }
  );

  exports.applyWith = applyWith = fn(
    'Uses context and rebinds \'this\',',
    'It applies a function to an array of arguments.',
    'The first argument must be a function,',
    'and the second one the context.',
    function(f, cxt, args) {
      if(!isArrayLike(args))
        throw Error('args must be an array or some arguments');
      return f.apply(cxt, args);
    }
  );

  exports.callWith = callWith = fn(
    'Uses context and rebinds \'this\',',
    'It applies a function to a variable number of arguments.',
    'The first argument must be a function,',
    'and the second one is the context.',
    function(f, cxt) {
      return applyWith(f, cxt, slice(arguments, 2));
    }
  );

  exports.arity = arity = fn(
    'Use with caution as arity may leads to cryptic errors!',
    'Limit the arguments given to a function.',
    'e.g.: arity(2)(add)(2,7,6) //=> 9',
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

  exports.cs = cs = fn(
    'Wrapper for the console object.',
    'The function returned by cs itself returns its arguments.',
    'e.g.: map(inc, cs(\'log\')(1,2)) // logs [1,2] then returns [2,3]',
    '      add(cs(\'log\')(1), 2) // logs 1 then returns 3',
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

  exports.id = id = fn(
    'Returns self',
    function(x) {
      return x;
    }
  );

  exports.clone = clone = fn(
    'General purpose clone function.',
    'The Objects and Arrays are mutable in JS',
    'clone allows to bypass this with ease.',
    function(x) {
      var cloneArray = function(xs) {
        return map(clone, xs);
      };
      var cloneObject = function(xs) {
        var y = {};
        loop(function(k, v) {
          y[clone(k)] = clone(v);
        }, xs);
        return y;
      };

      switch(true) {
      case isArrayLike(x): return cloneArray(x);
      case isObject(x): return cloneObject(x);
      default: return x;
      }
    }
  );

  exports.doc = doc = fn(
    'Returns the attribute doc of an object',
    function(obj) {
      return obj.doc;
    }
  );

  exports.source = source = fn(
    'Returns the attribute source of an object',
    function(obj) {
      return obj.source;
    }
  );

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

  exports.apply = apply = fn(
    'Applies a function to an array of arguments.',
    'The first argument must be a function,',
    'the context is set to null.',
    function(f, args) {
      if(!isArrayLike(args))
        throw Error('args must be an array or some arguments');
      return applyWith(f, null, args);
    }
  );

  exports.call = call = fn(
    'Applies a function to a variable number of arguments.',
    'The first argument must be a function,',
    'the context is set to null.',
    function(f) {
      return apply(f, butfirst(arguments));
    }
  );

  //#Array.prototype
  //#finish(if [].slice does not exist)
  exports.slice = slice = fn(
    'Based on the function Array.prototype.slice.',
    'e.g.: slice(arguments) // similar to [].slice.call(arguments)',
    '      slice([1,2,3,4], 1,3) // [2, 3]',
    '      slice([1,2,3], -1) // [3]',
    function(xs) {
      var args = [].slice.call(arguments).slice(1);
      return applyWith([].slice, xs, args);
    }
  );

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

  //#Array.prototype
  //#finish(if [].concat does not exist)
  exports.concat = concat = fn(
    'Concats several arrays',
    function() {
      return reduce(function(xs, ys) {
        return [].concat.call(slice(xs||[]), slice(ys||[]));
      }, arguments, []);
    }
  );

  //#Array.prototype
  exports.map = map = fn(
    'Applies f to each item of xs and returns the results as an array.',
    'e.g.: map(partial(add, 2), [1,2,4]) // [3,4,6]',
    function(f, xs) {
      ////the functionnal version of map:
      //return reduce(function(agg, x) {
      //  return conj(agg, call(f, x));
      //}, xs, []);

      if([].map) return callWith([].map, xs, arity1(f));

      var ret = [];
      loop(function(_, x) {
        ret.push(f.call(f, x));
      }, xs);
      return ret;
    }
  );

  //#Array.prototype
  exports.mapkv = mapkv = fn(
    'Like map but mapkv also passes the key to the given function.',
    'Notice that if xs is an Array, its indexes are auto-cast into Int.',
    function(f, obj) {
      ////the functionnal version of mapkv:
      //return reducekv(function(agg, k, v) {
      //  return conj(agg, call(f, k, v));
      //}, xs, []);

      if([].map && !isObject(obj)) return callWith([].map, obj, arity2(flip(f)));

      var ret = [];
      loop(function(k, v) {
        ret.push(f.call(f, isArrayLike(obj) ? parseInt(k) : k, v));
      }, obj);
      return ret;
    }
  );

  //#Array.prototype
  exports.filter = filter = fn(
    'Returns an array of the items in coll for which pred(x) returns true.',
    function(pred, xs) {
      if([].filter) return callWith([].filter, xs, arity1(pred));

      var ys = [];
      loop(function(_, x) {
        if(pred(x)) ys.push(x);
      }, xs);
      return ys;
    }
  );

  exports.times = times = fn(
    'Calls function f n times.',
    function(n, f) {
      while(n--)
        apply(f, slice(arguments, 2));
    }
  );

  exports.takeWhile = takeWhile = fn(
    'Returns an Array containing the items of xs',
    'while pred(item) is true.',
    function(pred, xs) {
      for(var i=0; xs[i] && pred(xs[i]); i++);
      return apply(conj, cons([], slice(xs, 0, i)));
    }
  );

  exports.dropWhile = dropWhile = fn(
    'Drops all the items of xs while pred(item) is true',
    'and returns all the remaining items as an Array',
    function(pred, xs) {
      for(var i=0; xs[i] && pred(xs[i]); i++);
      return apply(conj, cons([], slice(xs, i)));
    }
  );

  exports.keys = keys = fn(
    'Returns the keys of an Object',
    function(obj) {
      return mapkv(id, obj);
    }
  );

  exports.values = values = fn(
    'Returns the values of an Object',
    function(obj) {
      return mapkv(flip(id), obj);
    }
  );

  exports.merge = merge = fn(
    'Merges two Objects',
    function(xs, ys) {
      ////the functionnal version of merge:
      //return marshal(concat(unmarshal(xs), unmarshal(ys)));

      var ret = {};
      for(k in xs) ret[k] = xs[k];
      for(k in ys) ret[k] = ys[k];
      return ret;
    }
  );

  exports.assoc = assoc = fn(
    'Assoc key/value to Object.',
    'Equivalent to `obj[k] = v` but doesn\'t modify obj.',
    function(obj, k, v) {
      var assocedObj = clone(obj);
      assocedObj[k] = v;
      return assocedObj;
    }
  );

  exports.marshal = marshal = fn(
    'Converts an array of pairs into an Object',
    function(xs) {
      return reduce(function(agg, x) {
        agg[first(x)] = second(x);
        return agg;
      }, xs, {});
    }
  );

  exports.unmarshal = unmarshal = fn(
    'Converts an Object into an array of pairs',
    function(obj) {
      return mapkv(function(k, v) {
        return [k, v];
      }, obj);
    }
  );

  exports.cons = cons = fn(
    'Prepends x to xs.',
    'e.g.: cons([2,3], 1) // [1,2,3]',
    function(xs, x) {
      return concat([x], xs);
    }
  );

  exports.conj = conj = fn(
    'Appends x to xs.',
    'e.g.: conj([1,2], 3) // [1,2,3]',
    function(xs) {
      var ys = clone(xs);
      applyWith([].push, ys, butfirst(arguments));
      return ys;
    }
  );

  exports.first = first = fn(
    'Returns the first element of xs.',
    function(xs) {
      return xs[0];
    }
  );

  exports.butfirst = butfirst = fn(
    'Returns all the elements of xs but the first one.',
    function(xs) {
      return slice(xs, 1);
    }
  );

  exports.second = second = fn(
    'Returns the second element of xs.',
    function(xs) {
      return xs[1];
    }
  );

  exports.last = last = fn(
    'Returns the last elements of xs.',
    function(xs) {
      return xs[xs.length - 1];
    }
  );

  exports.butlast = butlast = fn(
    'Returns all the elements of xs but the last one.',
    function(xs) {
      return slice(xs, 0, -1);
    }
  );

  exports.get = get = fn(
    'Object, Array, String and arguments lookup.',
    'e.g.: get([1,2,3], 0) // 1',
    '      get({foo: {bar: [1,2]}}, [\'foo\', \'bar\', 1]) // 2',
    '      get([1,2], 4, \'Not Found...\') // \'Not Found...\'.',
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

  exports.sum = sum = fn(
    'Sums the elements of an array',
    function(xs) {
      return reduce(add, xs);
    }
  );

  exports.repeat = repeat = fn(
    'Returns an array containing n times x',
    function(x, n) {
      if(n > 0)
        return conj(repeat(x, dec(n)), x);
      else return [];
    }
  );

  exports.cycle = cycle = fn(
    'Returns an array containing n repetitions of the items in xs',
    function(xs, n) {
      if(n > 0)
        return concat(cycle(xs, dec(n)), xs);
      else return [];
    }
  );

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

  //#Array.prototype
  exports.reducekv = reducekv = fn(
    'The first argument is a function which takes three arguments,',
    'the second one is an array and the third one is an aggregator',
    'e.g.: var f = function(agg, _, v) { return agg + v }',
    '      reducekv(f, {foo: 1, bar: 2, baz: 3}, 0) // 6',
    '      reducekv(f, {foo: 1, bar: 2, baz: 3}, 2) // 8',
    function(f, obj, agg) {
      if([].reduce && !isObject(obj)) return callWith([].reduce, obj, arity3(f), agg);

      var reducer = function(obj2, agg) {
        if(isEmpty(obj2)) return agg;
        return reducer(butfirst(obj2), call(f, agg, obj2[0][0], obj2[0][1]));
      };
      return reducer(unmarshal(obj), agg);
    }
  );

  exports.reverse = reverse = fn(
    'Reverse the element of an array.',
    function(xs) {
      return reduce(cons, xs, []);
    }
  );

  //#Array.prototype
  exports.every = every = fn(
    'Applies pred to each items of xs.',
    'If pred(item) is true every time, return true.',
    function(pred, xs) {
      if([].every) return callWith([].every, xs, arity1(pred));

      var n = 0;
      for(i in xs)
        if(xs.hasOwnProperty(i))
          if(pred(xs[i]))
            n++;
      return n === xs.length;
    }
  );

  //#Array.prototype
  exports.some = some = fn(
    'Applies pred to each items of xs.',
    'If pred(item) is true, return true.',
    function(pred, xs) {
      if([].some) return callWith([].some, xs, arity1(pred));

      for(i in xs)
        if(xs.hasOwnProperty(i))
          if(pred(xs[i]))
            return true;
      return false;
    }
  );

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

  exports.thread = thread = fn(
    'Targeting readability, thread looks like OOP writting.',
    'e.g.: inc(first([1,3])) becomes thread([1,3], first, inc) // 2',
    function() {
      return apply(flip(comp), butfirst(arguments))(first(arguments));
    }
  );

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

  exports.fmap = fmap = fn(
    'Flips the arguments given to map',
    flip(map)
  );

  exports.fmapkv = fmapkv = fn(
    'Flips the arguments given to mapkv',
    flip(mapkv)
  );

  exports.freduce = freduce = fn(
    'Flips the arguments given to reduce.',
    'The aggregator remains the third and last argument.',
    'e.g.: freduce([2, 3], mul) // 6',
    '      freduce([2, 3], mul, 2) // 12',
    function(xs, f, agg) {
      return reduce(f, xs, agg)
    }
  );

  exports.freducekv = freducekv = fn(
    'Flips the arguments given to reducekv.',
    'The aggregator remains the third and last argument.',
    'e.g.: var xs = {foo: 1, bar: 2, baz: 3}',
    '      var f = function(agg, _, v) { return agg * v }',
    '      freducekv(xs, f, 1) // 6',
    '      freducekv(xs, f, 2) // 12',
    function(obj, f, agg) {
      return reducekv(f, obj, agg)
    }
  );

  exports.log = log = fn(
    'console.log and returns the argument(s) given.',
    cs('log')
  );

  exports.log1 = log1 = fn(
    'console.log and returns the first argument given.',
    arity1(cs('log'))
  );

  exports.dir = dir = fn(
    'console.dir and returns the argument(s) given.',
    cs('dir')
  );

  exports.dir1 = dir1 = fn(
    'console.dir and returns the first argument given.',
    arity1(cs('dir'))
  );

  exports.warn = warn = fn(
    'console.warn and returns the argument(s) given.',
    cs('warn')
  );

  exports.warn1 = warn1 = fn(
    'console.warn and returns the first argument given.',
    arity1(cs('warn'))
  );

  exports.error = error = fn(
    'console.error and returns the argument(s) given.',
    cs('error')
  );

  exports.error1 = error1 = fn(
    'console.error and returns the first argument given.',
    arity1(cs('error'))
  );

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
        var xs = [], x = args[0], step = (args[2] > 0) ? args[2] : 1;
        while(x < args[1]) {
          xs.push(x);
          x += step;
        }
        return xs;
      }
    }
  );

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

  exports.eq = eq = fn(
    'Returns wether x equals y or not.',
    'eq makes a deep comparison of x and y.',
    function(x, y) {
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
    }
  );

  exports.even = even = fn(
    'Returns true if x is even',
    function(x) {
      return (x & 1) === 0;
    }
  );

  exports.odd = odd = fn(
    'Returns true if x is odd',
    function(x) {
      return !even(x);
    }
  );

  exports.inc = inc = fn(
    'Returns a number one greater than x',
    function(x) {
      return x + 1;
    }
  );

  exports.dec = dec = fn(
    'Returns a number one less than x',
    function(x) {
      return x - 1;
    }
  );

  exports.eqZero = eqZero = fn(
    'Returns true if x equals 0',
    function(x) {
      return x === 0;
    }
  );

  exports.eqOne = eqOne = fn(
    'Returns true if x equals 1',
    function(x) {
      return x === 1;
    }
  );

  exports.isEmpty = isEmpty = fn(
    'Returns true if x is empty.',
    'Works on objects, arrays and strings.',
    function(x) {
      switch(true) {
      case(isArrayLike(x) || isString(x)): return eqZero(x.length);
      case(isObject(x)): for(i in x) return false; return true;
      default: throw Error('x must be an Array, a String or an Object');
      }
    }
  );

  exports.isObject = isObject = fn(
    'Returns true if x is an Object litteral',
    function(x) {
      return is('Object')(x) && !isFunction(x);
    }
  );

  exports.isArray = isArray = fn(
    'Returns true if x is an Array',
    is('Array')
  );

  exports.isString = isString = fn(
    'Returns true if x is a String',
    is('String')
  );

  exports.isFunction = isFunction = fn(
    'Returns true if x is a Function',
    function(x) {
      return typeof x === 'function';
    }
  );

  exports.isArgument = isArgument = fn(
    'Returns true if x is an instance of Arguments',
    function(x) {
      if(isNull(x) || isUndefined(x)) return false;
      return x.toString && x.toString() === '[object Arguments]';
    }
  );

  exports.isArrayLike = isArrayLike = fn(
    'Returns true if x is an Array or an instance of Arguments',
    function(x) {
      return isArray(x) || isArgument(x);
    }
  );

  exports.isTrue = isTrue = fn(
    'Returns true if x is true',
    function(x) {
      return x === true;
    }
  );

  exports.isFalse = isFalse = fn(
    'Returns true if x is false',
    function(x) {
      return x === false;
    }
  );

  exports.isNull = isNull = fn(
    'Returns true if x is null',
    function(x) {
      return x === null;
    }
  );

  exports.isUndefined = isUndefined = fn(
    'Returns true if x is undefined',
    function(x) {
      return x === undefined;
    }
  );

  exports.add = add = fn(
    'Returns the sum of given arguments.',
    'add() returns 0.',
    function() {
      return reduce(function(x, y) {
        return x + y;
      }, arguments, 0);
    }
  );

  exports.mul = mul = fn(
    'Returns the product of given arguments.',
    'mul() returns 1.',
    function() {
      if(isEmpty(arguments)) return 1;
      return reduce(function(x, y) {
        return x * y;
      }, arguments);
    }
  );

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
                   marshal(map(partial(flip(repeat), 2), filter(isString, args))));
    }
  );

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
          if(parent[parentname]) warn('"' + parentname + '" has  been replaced by fjs.' + fjsname);
          parent[parentname] = exports[fjsname];
        }
        else throw Error('"' + fjsname + '" is not defined in fjs!');
      }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
    }
  );

  //#messy
  exports.useAll = fn(
    'May be really messy!',
    'Uses all the exported function of fjs.',
    function() {
      apply(exports.use, filter(function(key) {
        return key != 'use' && key != 'useAll';
      }, keys(exports)));
    }
  );

  //#messy
  exports.del = fn(
    'May be really messy!',
    'Deletes variables in the main scope.',
    'Handy when you want to clean the scope after using fjs variables.',
    'See fjs.use.doc',
    function() {
      loop(function(_, parentname) {
        delete parent[parentname];
      }, parseArgs(isArrayLike(first(arguments)) ? first(arguments) : arguments));
    }
  );

  exports.version = fn(
    'Returns version of fjs',
    function() {
      return join(values(exports.version.details), '.');
    }
  );
  exports.version.details = {major: 0, minor: 9, patch: 0};

  return exports;
}();
