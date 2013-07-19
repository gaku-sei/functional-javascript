(function() {
  var assertEq = function(x, y) {
    if(x !== y) throw Error(x + ' is different from ' + y);
  };

  var assert = function(x) {
    if(x !== true) throw Error(x + ' is not true');
  };

  var assertFalse = function(x) {
    if(x !== false) throw Error(x + ' is not false');
  };

  assertEq(1, 1);
  assert(true);

  //#loop
  var i = 0;
  fjs.loop(function(k, v) {
    switch(i) {
    case 0:
      assertEq(v, 1);
      assertEq(k, "0");
      break;
    case 1:
      assertEq(v, 2);
      assertEq(k, "1");
      break;
    case 2:
      assertEq(v, 3);
      assertEq(k, "2");
      break;
    }
    ++i;
  }, [1, 2, 3]);

  //#is
  assert(fjs.isString("foobar"));
  assertFalse(fjs.isString({}));
  assertFalse(fjs.isString([]));
  assertFalse(fjs.isString(0));
  assert(fjs.isObject({foo: 42}));
  assertFalse(fjs.isObject(""));
  assertFalse(fjs.isObject([]));
  assertFalse(fjs.isObject(0));
  assert(fjs.isArray([1,2,3]));
  assertFalse(fjs.isArray({}));
  assertFalse(fjs.isArray(""));
  assertFalse(fjs.isArray(0));

  //#applyWith
  var f = function() { return fjs.sum(arguments) * 10; };
  assertEq(fjs.applyWith(f, 10, [2, 3]), 50);
  var f = function() { return 'Hello ' + this; };
  assertEq(fjs.applyWith(f, 'World', []), 'Hello World');

  //#callWith
  var f = function(x, y) { return (x + y) * 10; };
  assertEq(fjs.callWith(f, 10, 2, 3), 50);
  var f = function() { return 'Hello ' + this; };
  assertEq(fjs.callWith(f, 'World'), 'Hello World');

  //#arity
  var xs = fjs.arity(3)(Array)(1, 2, 3, 4);
  assertEq(xs.length, 3);
  assertEq(xs[0], 1);
  assertEq(xs[1], 2);
  assertEq(xs[2], 3);

  //#cs
  var consoleTest = function() {
    var log = fjs.cs('log');
    assertEq(log(1), 1);
    var xs = log(1,2,3);
    var ys = [1,2,3];
    for(i in xs)
      assertEq(log(xs[i]), ys[i]);
  };
  //consoleTest()

  //#id
  var xs = [1, 2, 3];
  var ys = fjs.id(xs);
  for(i in xs)
    assertEq(xs[i], ys[i]);
  xs.push(4);
  assertEq(xs.length, ys.length);
  assertEq(xs[3], ys[3]);
  var x = 'foo';
  var y = fjs.id(x);
  assertEq(x, y);
  var x = 1;
  var y = fjs.id(1);
  assertEq(x, y);

  //#cloneArray
  var xs = [1, 2, 3];
  var ys = fjs.clone(xs);
  for(i in xs)
    assertEq(xs[i], ys[i]);
  ys.push(4);
  assertEq(xs.length, 3);
  assertEq(ys.length, 4);
  assertEq(ys[3], 4);

  var xs = [[1], 2];
  var ys = fjs.clone(xs)
  assertEq(xs[0][0], ys[0][0]);
  assertEq(xs[1], ys[1]);
  ys.push([3]);
  xs.push([4]);
  assertEq(ys[2][0], 3);
  assertEq(xs[2][0], 4);

  //#cloneObject
  var obj = {foo: 1, bar: 2};
  var cobj = fjs.clone(obj);
  for(i in xs)
    assertEq(obj[i], cobj[i]);
  obj.baz = 3;
  cobj.qux = 4;
  assertEq(cobj.baz, undefined);
  assertEq(obj.qux, undefined);
  assertEq(obj.baz, 3);
  assertEq(cobj.qux, 4);

  //#clone
  var x = [{foo: [1, 2], bar: 'baz'}, 2, 'qux'];
  var y = fjs.clone(x);
  assertEq(x[0].foo[0], y[0].foo[0]);
  assertEq(x[0].bar, y[0].bar);
  assertEq(x[1], y[1]);
  assertEq(x[2], y[2]);
  x[0].foo.push(3);
  y[0].baz = 42;
  assertEq(x[0].foo[2], 3);
  assertEq(y[0].foo[2], undefined);
  assertEq(x[0].baz, undefined);
  assertEq(y[0].baz, 42);

  //#attrs
  var xs = {foo: 1, bar: 2};
  var ys = fjs.attrs(xs);
  assertEq(xs.foo, ys.foo);
  assertEq(xs.bar, xs.bar);

  //#apply
  var addThree = function(x, y, z) { return x + y + z };
  assertEq(fjs.apply(addThree, [2, 5, 6]), 13);

  //#call
  var addThree = function(x, y, z) { return x + y + z };
  assertEq(fjs.call(addThree, 5, 2, 4), 11);

  //#slice
  var xs = [1, 2, 3];
  var ys = fjs.slice([1, 2, 3]);
  for(i in xs)
    assertEq(xs[i], ys[i]);
  var ys = fjs.slice(xs, 1);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  var ys = fjs.slice(xs, -1);
  assertEq(ys[0], 3);
  var ys = fjs.slice(xs, 1, 2);
  assertEq(ys[0], 2);
  assertEq(ys.length, 1);

  //#join
  assertEq(fjs.join(['foo', 'bar']), 'foobar');
  assertEq(fjs.join(['foo', 'bar'], '/'), 'foo/bar');

  //#concat
  assertEq(fjs.concat().length, 0);
  assertEq(fjs.concat([]).length, 0);
  assertEq(fjs.concat([], []).length, 0);
  var xs = fjs.concat([1, 2, 3], [4], [5, 6]);
  assertEq(xs.length, 6);
  assertEq(xs[0], 1);
  assertEq(xs[1], 2);
  assertEq(xs[2], 3);
  assertEq(xs[3], 4);
  assertEq(xs[4], 5);
  assertEq(xs[5], 6);

  assertEq(fjs.concat().length, 0);
  assertEq(fjs.concat([]).length, 0);
  assertEq(fjs.concat([], []).length, 0);
  var xs = fjs.concat([1], [2]);
  assertEq(xs[0], 1);
  assertEq(xs[1], 2);
  var xs = fjs.concat([[1, 2]], [[3]]);
  assertEq(xs[0][0], 1);
  assertEq(xs[0][1], 2);
  assertEq(xs[1][0], 3);
  var xs = fjs.concat([1], [2], [3]);
  assertEq(xs.length, 3);
  assertEq(xs[0], 1);
  assertEq(xs[1], 2);
  assertEq(xs[2], 3);

  //#map
  var xs = [1,2,4];
  var ys = fjs.map(function(x) { return x + 2 }, xs);
  assertEq(ys[0], 3);
  assertEq(ys[1], 4, 150);
  assertEq(ys[2], 6);
  var inc = function(x) { return x + 1};
  var ys = fjs.map(inc, xs);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  assertEq(ys[2], 5);

  //#mapkv
  var f = function(k, v) { return k + v; };
  var xs = {foo: 'bar', baz: 'qux'};
  var ys = fjs.mapkv(f, xs);
  assertEq(ys[0], 'foobar');
  assertEq(ys[1], 'bazqux');
  var incv = function(_, v) { return v + 1 };
  var xs = {foo: 1, bar: 2};
  var ys = fjs.mapkv(incv, xs);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);

  //#filter
  var xs = [1, 2, 3, 4, 5];
  var ys = fjs.filter(fjs.even, xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 2);
  assertEq(ys[1], 4);
  var ys = fjs.filter(fjs.odd, xs);
  assertEq(ys.length, 3);
  assertEq(ys[0], 1);
  assertEq(ys[1], 3);
  assertEq(ys[2], 5);

  //#sort
  var xs = [2, 1, 3];
  var ys = fjs.sort(xs);
  assertEq(ys[0], 1);
  assertEq(ys[1], 2);
  assertEq(ys[2], 3);
  var ys = fjs.sort(function(x, y) { return x < y; }, xs);
  assertEq(ys[0], 3);
  assertEq(ys[1], 2);
  assertEq(ys[2], 1);

  //#shuffle
  var xs = [1, 2, 3, 4, 5];
  for(var i = 0; i < 10; i++) {
    var ys = fjs.shuffle(xs);
    assertEq(xs.length, ys.length);
  }

  //#times
  var i = 0;
  fjs.times(12, function() { i++ });
  assertEq(i, 12);

  //#takeWhile
  var xs = [1, 1, 2, 3, 3];
  var ys = fjs.takeWhile(fjs.odd, xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 1);
  assertEq(ys[1], 1);
  var xs = [2, 4, 6];
  var ys = fjs.takeWhile(fjs.odd, xs);
  assertEq(ys.length, 0);
  var xs = [1, 1];
  var ys = fjs.takeWhile(fjs.odd, xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 1);
  assertEq(ys[1], 1);

  //#dropWhile
  var xs = [1, 1, 2, 3];
  var ys = fjs.dropWhile(fjs.odd, xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  var xs = [1, 1, 3, 5];
  var ys = fjs.dropWhile(fjs.odd, xs);
  assertEq(ys.length, 0);
  var xs = [2, 1, 1];
  var ys = fjs.dropWhile(fjs.odd, xs);
  assertEq(ys.length, 3);
  assertEq(ys[0], 2);
  assertEq(ys[1], 1);
  assertEq(ys[2], 1);

  //#keys
  var xs = {foo: 1, bar: 2};
  var ys = fjs.keys(xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 'foo');
  assertEq(ys[1], 'bar');

  //#values
  var xs = {foo: 1, bar: 2};
  var ys = fjs.values(xs);
  assertEq(ys.length, 2);
  assertEq(ys[0], 1);
  assertEq(ys[1], 2);
  var xs = {foo: [42, 43], bar: 'baz'};
  var ys = fjs.values(xs);
  assertEq(ys.length, 2);
  assertEq(ys[0][0], 42);
  assertEq(ys[0][1], 43);
  assertEq(ys[1], 'baz');

  //#merge
  var xs = {foo: 1};
  var ys = {bar: 2};
  var zs = fjs.merge(xs, ys);
  assertEq(zs.foo, 1);
  assertEq(zs.bar, 2);

  //#assoc
  var xs = {foo: 1};
  var ys = fjs.assoc(xs, 'bar', 2);
  assertEq(ys.foo, 1);
  assertEq(ys.bar, 2);

  //#marshal
  var xs = [['foo', 1], ['bar', 2]];
  var ys = fjs.marshal(xs);
  assertEq(ys.foo, 1);
  assertEq(ys.bar, 2);

  //#unmarshal
  var xs = {foo: 1, bar: [2, 3]};
  var ys = fjs.unmarshal(xs);
  assertEq(ys[0][0], 'foo');
  assertEq(ys[0][1], 1);
  assertEq(ys[1][0], 'bar');
  assertEq(ys[1][1][0], 2);
  assertEq(ys[1][1][1], 3);

  //#cons
  var xs = fjs.cons([2, 3], 1);
  assertEq(xs[0], 1);
  assertEq(xs[1], 2);
  assertEq(xs[2], 3);
  var xs = fjs.cons([3, [4]], [1]);
  assertEq(xs[0][0], 1);
  assertEq(xs[1], 3);
  assertEq(xs[2][0], 4, 166);

  //#conj
  var xs = fjs.conj([2, 3], 1);
  assertEq(xs[0], 2);
  assertEq(xs[1], 3);
  assertEq(xs[2], 1);
  var xs = fjs.conj([3, [4]], [1]);
  assertEq(xs[0], 3);
  assertEq(xs[1][0], 4, 175);
  assertEq(xs[2][0], 1);

  //#first
  assertEq(fjs.first([4, 5, 2]), 4);
  assertEq(fjs.first(['foo', 'bar', 'baz']), 'foo');

  //#butfirst
  var xs = [2, 6, 3];
  var ys = [6, 3];
  var zs = fjs.butfirst(xs);
  for(i in zs)
    assertEq(zs[i], ys[i]);

  //#second
  assertEq(fjs.second([4, 5, 2]), 5);
  assertEq(fjs.second(['foo', 'bar', 'baz']), 'bar');

  //#last
  assertEq(fjs.last([4, 5, 2]), 2);
  assertEq(fjs.last(['foo', 'bar', 'baz']), 'baz');

  //#butlast
  var xs = [2, 6, 3];
  var ys = [2, 6];
  var zs = fjs.butlast(xs);
  for(i in zs)
    assertEq(zs[i], ys[i]);

  //#get
  assertEq(fjs.get([1, 2, 3], 0), 1);
  assertEq(fjs.get({foo: {bar: [1, 2]}}, ['foo', 'bar', 1]), 2);
  assertEq(fjs.get([1, 2], 4, 'Not Found...'), 'Not Found...');
  assertEq(fjs.get([1, 2], 4), undefined);
  assertEq(fjs.get({foo: [1, 'bar']}, ['foo', 1, 2]), 'r');
  assertEq(fjs.get({foo: 'bar'}, 'foo'), 'bar');
  assertEq(fjs.get([1, 2, 3], 0), 1);

  //#sum
  assertEq(fjs.sum([1, 2, 3, 4]), 10);
  //Space Oddity Notice: it's a normal behavior and it's neither a desired feature nor a real bug.
  assertEq(fjs.sum([1, 2, 'foo']), '3foo');

  //#repeat
  var xs = fjs.repeat('foo');
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeat(0, 'foo');
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeat('', 'foo');
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeat(10, 'foo');
  assert(fjs.isArray(xs) && fjs.eq(xs.length, 10));
  for(i in xs)
    assertEq(xs[i], 'foo');

  //#repeatedly
  var f = function() { return 'foo'; };
  var xs = fjs.repeatedly(f);
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeatedly(0, f);
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeatedly('', f);
  assert(fjs.isArray(xs) && fjs.eqZero(xs.length));
  var xs = fjs.repeatedly(10, f);
  assert(fjs.isArray(xs) && fjs.eq(xs.length, 10));
  for(i in xs)
    assertEq(xs[i], 'foo');

  //#cycle
  var xs = ['foo', 'bar', 'baz'];
  assertEq(fjs.cycle(xs).length, 0);
  assertEq(fjs.cycle(0, xs).length, 0);
  assertEq(fjs.cycle(3, xs).length, 9);
  var ys = fjs.cycle(2, xs);
  assertEq(ys[0], xs[0]);
  assertEq(ys[1], xs[1]);
  assertEq(ys[2], xs[2]);
  assertEq(ys[3], xs[0]);
  assertEq(ys[4], xs[1]);
  assertEq(ys[5], xs[2]);

  //#reduce
  var xs = [1, 2, 3];
  var x = fjs.reduce(fjs.add, xs);
  var y = fjs.reduce(fjs.add, xs, 2);
  assertEq(x, 6);
  assertEq(y, 8);

  //#reducekv
  var xs = {foo: 1, bar: 2, baz: 3};
  var f = function(agg, _, v) { return agg + v };
  var x = fjs.reducekv(f, xs, 0);
  var y = fjs.reducekv(f, xs, 2);
  assertEq(x, 6);
  assertEq(y, 8);

  //#reverse
  var xs = [1, 2, 3];
  var ys = [3, 2, 1];
  var zs = fjs.reverse(xs);
  for(i in zs)
    assertEq(zs[i], ys[i]);
  var xs = ['foo', 'bar', 'baz'];
  var ys = ['baz', 'bar', 'foo'];
  var zs = fjs.reverse(xs);
  for(i in zs)
    assertEq(zs[i], ys[i]);

  //#every
  var eqFoo = function(x) { return x === 'foo' };
  var xs = ['foo', 'foo', 'foo'];
  var ys = ['foo', 'bar', 'foo'];
  assertEq(fjs.every(eqFoo, xs), true);
  assertEq(fjs.every(eqFoo, ys), false);

  //#some
  var eqFoo = function(x) { return x === 'foo' };
  var xs = ['foo', 'bar', 'baz'];
  var ys = ['bar', 'baz', 'qux'];
  assertEq(fjs.some(eqFoo, xs), true);
  assertEq(fjs.some(eqFoo, ys), false);

  //#comp
  var addOne = function(x) { return x + 1 };
  var twoTimes = function(x) { return x * 2 };
  var threeTimes = function(x) { return x * 3 };
  assertEq(fjs.comp(addOne, twoTimes)(2), 5);
  assertEq(fjs.comp(twoTimes, addOne)(4), 10);
  assertEq(fjs.comp(twoTimes, addOne, threeTimes)(4), 26);

  //#thread
  var addOne = function(x) { return x + 1 };
  var twoTimes = function(x) { return x * 2 };
  var threeTimes = function(x) { return x * 3 };
  assertEq(fjs.thread(1, addOne), 2);
  assertEq(fjs.thread(1, addOne, twoTimes), 4);
  assertEq(fjs.thread(1, addOne, threeTimes, twoTimes), 12);
  assertEq(fjs.thread(1, addOne, twoTimes, twoTimes, threeTimes), 24);

  //#partial
  var f = function(x, y, z) { return x + y / z };
  var g = fjs.partial(f, 2, 10);
  assertEq(g(5), 4, 200);

  //#juxt
  var f = function(x) { return x + 1 };
  var g = function(x) { return x - 1 };
  var xs = fjs.juxt(f, g)(3);
  assertEq(xs[0], 4, 206);
  assertEq(xs[1], 2);

  //#flip
  var f = function(x, y) { return x / y };
  var g = fjs.flip(f);
  assertEq(f(10, 2), 5);
  assertEq(g(10, 2), 0.2);

  //#fmap
  var xs = [1, 2, 4];
  var ys = fjs.fmap(xs, function(x) { return x + 2 });
  assertEq(ys[0], 3);
  assertEq(ys[1], 4, 150);
  assertEq(ys[2], 6);
  var inc = function(x) { return x + 1 };
  var ys = fjs.fmap(xs, inc);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  assertEq(ys[2], 5);

  //#fmapkv
  var i = 0;
  fjs.fmapkv([1,2,3], function(k, v) {
    switch(i) {
    case 0:
      assertEq(v, 1);
      assertEq(k, 0);
      break;
    case 1:
      assertEq(v, 2);
      assertEq(k, 1);
      break;
    case 2:
      assertEq(v, 3);
      assertEq(k, 2);
      break;
    }
    ++i;
  });
  fjs.fmapkv({foo: 1, bar: 2}, function(k, v) {
    switch(k) {
    case 'foo': assertEq(v, 1); break;
    case 'bar': assertEq(v, 2); break;
    }
  });

  //#freduce
  var xs = [2, 3];
  assertEq(fjs.freduce(xs, fjs.mul), 6);
  assertEq(fjs.freduce(xs, fjs.mul, 2), 12);

  //#freducekv
  var xs = {foo: 1, bar: 2, baz: 3};
  var f = function(agg, _, v) { return agg * v };
  assertEq(fjs.freducekv(xs, f, 1), 6);
  assertEq(fjs.freducekv(xs, f, 2), 12);

  //#log
  //See #cs

  //#log1
  var log1Test = function() {
    assertEq(fjs.log1(1), 1);
    assertEq(fjs.log1(1, 2, 3), 1);
  };
  //log1Test()

  //#dir
  //See #cs

  //#dir1
  var dir1Test = function() {
    assertEq(fjs.dir1(1), 1);
    assertEq(fjs.dir1(1, 2, 3), 1);
  };
  //dir1Test()

  //#warn
  //See #cs

  //#warn1
  var warn1Test = function() {
    assertEq(fjs.warn1(1), 1);
    assertEq(fjs.warn1(1, 2, 3), 1);
  };
  //warn1Test()

  //#error
  //See #cs

  //#error1
  var error1Test = function() {
    assertEq(fjs.error1(1), 1);
    assertEq(fjs.error1(1, 2, 3), 1);
  };
  //error1Test()

  //#range
  var xs = fjs.range(2);
  assertEq(xs.length, 2);
  assertEq(xs[0], 0);
  assertEq(xs[1], 1);
  var xs = fjs.range(2, 4);
  assertEq(xs.length, 2);
  assertEq(xs[0], 2);
  assertEq(xs[1], 3);
  var xs = fjs.range(3, 10, 2);
  assertEq(xs.length, 4);
  assertEq(xs[0], 3);
  assertEq(xs[1], 5);
  assertEq(xs[2], 7);
  assertEq(xs[3], 9);
  var xs = fjs.range(10, 10);
  assertEq(xs.length, 0);

  //#xrange
  var f = fjs.xrange(2);
  var xs = f();
  assert(fjs.isFunction(f));
  assertEq(xs.length, 2);
  assertEq(xs[0], 0);
  assertEq(xs[1], 1);
  var f = fjs.xrange(2, 4);
  var xs = f();
  assert(fjs.isFunction(f));
  assertEq(xs.length, 2);
  assertEq(xs[0], 2);
  assertEq(xs[1], 3);
  var f = fjs.xrange(3, 10, 2);
  var xs = f();
  assertEq(xs.length, 4);
  assertEq(xs[0], 3);
  assertEq(xs[1], 5);
  assertEq(xs[2], 7);
  assertEq(xs[3], 9);
  var f = fjs.xrange(10, 10);
  var xs = f();
  assertEq(xs.length, 0);

  //#eq
  assert(fjs.eq(1, 1));
  assert(fjs.eq('foo', 'foo'));
  assert(fjs.eq([1, 2], [1, 2]));
  assert(fjs.eq([1, {foo: 1}, 2], [1, {foo: 1}, 2]));
  assert(fjs.eq({foo: 2}, {foo: 2}));
  assert(fjs.eq([1, null, {foo: undefined, bar: 1}, 3, {baz: 42}],
                [1, null, {foo: undefined, bar: 1}, 3, {baz: 42}]));
  assert(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                {foo: [1, 2, 3], bar: 'foobar', baz: 42}));

  assertFalse(fjs.eq(1, 2));
  assertFalse(fjs.eq('foo', 'bar'));
  assertFalse(fjs.eq([1, 2], [2, 2]));
  assertFalse(fjs.eq([1, {foo: 1}, 2], [1, {foo: 2}, 2]));
  assertFalse(fjs.eq([1, {foo: 1}, 2], [1, {bar: 1}, 2]));
  assertFalse(fjs.eq([1, {foo: 1}, 2], [1, {foo: 1, bar: 1}, 2]));
  assertFalse(fjs.eq({foo: 2}, {foo: 1}));
  assertFalse(fjs.eq([1, null, {foo: undefined, bar: 1}, 3, {baz: 42}],
                     [1, null, {foo: undefined, bar: 1}, 3, {baz: 2}]));
  assertFalse(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                     {foo: [1, 2, 3], ba: 'foobar', baz: 42}));
  assertFalse(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                     {foo: [1, 2, 3], bar: 'fobar', baz: 42}));
  assertFalse(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                     {foo: [1, 2, 3], bar: 'foobar', baz: 2}));
  assertFalse(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                     {foo: [1, 3], bar: 'foobar', baz: 42}));
  assertFalse(fjs.eq({foo: [1, 2, 3], bar: 'foobar', baz: 42},
                     {foo: [1, 2, 3], bar: 'foobar', az: 42}));

  //#even
  assert(fjs.even(2342));
  assert(fjs.even(-4));
  assert(fjs.even(0));
  assertFalse(fjs.even(1));
  assertFalse(fjs.even(23));
  assertFalse(fjs.even(-15));

  //#odd
  assert(fjs.odd(-15));
  assert(fjs.odd(1));
  assert(fjs.odd(23));
  assertFalse(fjs.odd(-4));
  assertFalse(fjs.odd(0));
  assertFalse(fjs.odd(2342));

  //#inc
  assertEq(fjs.inc(2), 3);
  assertEq(fjs.inc(-4), -3);

  //#dec
  assertEq(fjs.dec(2), 1);
  assertEq(fjs.dec(-4), -5);

  //#eqZero
  assert(fjs.eqZero(0));
  assertFalse(fjs.eqZero(2));
  assertFalse(fjs.eqZero(-3));

  //#eqOne
  assert(fjs.eqOne(1));
  assertFalse(fjs.eqOne(0));
  assertFalse(fjs.eqOne(2));
  assertFalse(fjs.eqOne(-3));

  //#isEmpty
  assert(fjs.isEmpty([]));
  assert(fjs.isEmpty(''));
  assert(fjs.isEmpty({}));
  assertFalse(fjs.isEmpty([1,2]));
  assertFalse(fjs.isEmpty('foo'));
  assertFalse(fjs.isEmpty({foo: 42}));

  //#isObject
  assert(fjs.isObject({}));
  assertFalse(fjs.isObject(''));
  assertFalse(fjs.isObject([]));
  assertFalse(fjs.isObject(function(){}));
  assertFalse(fjs.isObject(2));

  //#isArray
  assert(fjs.isArray([]));
  assertFalse(fjs.isArray(''));
  assertFalse(fjs.isArray(function(){}));
  assertFalse(fjs.isArray({}));
  assertFalse(fjs.isArray(2));

  //#isString
  assert(fjs.isString(''), true);
  assertFalse(fjs.isString(function(){}));
  assertFalse(fjs.isString([]));
  assertFalse(fjs.isString({}));
  assertFalse(fjs.isString(2));

  //#isFunction
  assert(fjs.isFunction(function(){}));
  assertFalse(fjs.isFunction(''));
  assertFalse(fjs.isFunction([]));
  assertFalse(fjs.isFunction({}));
  assertFalse(fjs.isFunction(2));

  //#isNumber
  assert(fjs.isNumber(1));
  assert(fjs.isNumber(-43));
  assert(fjs.isNumber(0));
  assert(fjs.isNumber(2.3));
  assert(fjs.isNumber(-23.4));
  assert(fjs.isNumber(0.0));
  assertFalse(fjs.isNumber([]));
  assertFalse(fjs.isNumber({}));
  assertFalse(fjs.isNumber(''));
  assertFalse(fjs.isNumber(null));
  assertFalse(fjs.isNumber(undefined));
  assertFalse(fjs.isNumber(function(){}));

  //#isInt
  assert(fjs.isInt(1));
  assert(fjs.isInt(-43));
  assert(fjs.isInt(0));
  assertFalse(fjs.isInt(1.1));
  assertFalse(fjs.isInt(-12.32));
  assertFalse(fjs.isInt(0.1));

  assert(fjs.isInt(3.0));
  assert(fjs.isInt(0.0));
  //assertFalse(fjs.isInt(3.0));
  //assertFalse(fjs.isInt(0.0));

  assertFalse(fjs.isInt([]));
  assertFalse(fjs.isInt({}));
  assertFalse(fjs.isInt(''));
  assertFalse(fjs.isInt(null));
  assertFalse(fjs.isInt(undefined));
  assertFalse(fjs.isInt(function(){}));

  //#isFloat
  assert(fjs.isFloat(1.32));
  assert(fjs.isFloat(-43.2));
  assert(fjs.isFloat(0.2));

  //assert(fjs.isFloat(1.0));
  //assert(fjs.isFloat(0.0));
  assertFalse(fjs.isFloat(1.0));
  assertFalse(fjs.isFloat(0.0));

  assertFalse(fjs.isFloat(1));
  assertFalse(fjs.isFloat(-12));
  assertFalse(fjs.isFloat(0));
  assertFalse(fjs.isFloat([]));
  assertFalse(fjs.isFloat({}));
  assertFalse(fjs.isFloat(''));
  assertFalse(fjs.isFloat(null));
  assertFalse(fjs.isFloat(undefined));
  assertFalse(fjs.isFloat(function(){}));

  //#areArguments
  (function() { assert(fjs.areArguments(arguments)) })();
  assertFalse(fjs.areArguments(function(){}));
  assertFalse(fjs.areArguments(''));
  assertFalse(fjs.areArguments([]));
  assertFalse(fjs.areArguments({}));
  assertFalse(fjs.areArguments(2));

  //#isArrayLike
  (function() { assert(fjs.isArrayLike(arguments)) })();
  assert(fjs.isArrayLike([]));
  assertFalse(fjs.isArrayLike(function(){}));
  assertFalse(fjs.isArrayLike(''));
  assertFalse(fjs.isArrayLike({}));
  assertFalse(fjs.isArrayLike(2));

  //#isTrue
  assert(fjs.isTrue(true));
  assertFalse(fjs.isTrue(''));
  assertFalse(fjs.isTrue(1));
  assertFalse(fjs.isTrue(false));

  //#isFalse
  assert(fjs.isFalse(false));
  assertFalse(fjs.isFalse(''));
  assertFalse(fjs.isFalse(1));
  assertFalse(fjs.isFalse(true));

  //#isNull
  assert(fjs.isNull(null));
  assertFalse(fjs.isNull(''));
  assertFalse(fjs.isNull([]));
  assertFalse(fjs.isNull({}));
  assertFalse(fjs.isNull(2));

  //#isUndefined
  assert(fjs.isUndefined(undefined));
  assertFalse(fjs.isUndefined(''));
  assertFalse(fjs.isUndefined([]));
  assertFalse(fjs.isUndefined({}));
  assertFalse(fjs.isUndefined(2));

  //#add
  assertEq(fjs.add(), 0);
  assertEq(fjs.add(2), 2);
  assertEq(fjs.add(2, 3, 4, 5), 14);

  //#mul
  assertEq(fjs.mul(), 1);
  assertEq(fjs.mul(2), 2);
  assertEq(fjs.mul(2, 3, 4, 5), 120);

  //#sub
  assertEq(fjs.sub(), 0);
  assertEq(fjs.sub(2), 2);
  assertEq(fjs.sub(2, 3, 4, 5), -10);

  //#div
  assertEq(fjs.div(), 1);
  assertEq(fjs.div(2), 2);
  assertEq(fjs.div(84, 2, 4), 10.5);

  //#use #del
  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  fjs.use('map');
  assert(fjs.isFunction(map));
  fjs.del('map');
  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }

  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  fjs.use('map', 'inc');
  assert(fjs.isFunction(map));
  assert(fjs.isFunction(inc));
  var xs = [1, 2, 3];
  var ys = map(inc, xs);
  assertEq(ys.length, 3);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  assertEq(ys[2], 4);
  fjs.del('map', 'inc');
  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }

  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  var vars = ['map', 'inc'];
  fjs.use(vars);
  assert(fjs.isFunction(map));
  assert(fjs.isFunction(inc));
  var xs = [1, 2, 3];
  var ys = map(inc, xs);
  assertEq(ys.length, 3);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  assertEq(ys[2], 4);
  fjs.del(vars);
  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }

  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { myInc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  var vars = ['map', {inc: 'myInc'}];
  fjs.use(vars);
  assert(fjs.isFunction(map));
  assert(fjs.isFunction(myInc));
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  var xs = [1, 2, 3];
  var ys = map(myInc, xs);
  assertEq(ys.length, 3);
  assertEq(ys[0], 2);
  assertEq(ys[1], 3);
  assertEq(ys[2], 4);
  fjs.del(vars);
  try { map }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { inc }
  catch(e) { assertEq(e.name, "ReferenceError"); }
  try { myInc }
  catch(e) { assertEq(e.name, "ReferenceError"); }

  //Let's test some more complex (and less realistic) code with several fjs functions in a row.
  var wtf = function() { return fjs.flip(fjs.comp)(fjs.partial(fjs.fmap, arguments), fjs.join)(fjs.id) };
  assertEq(wtf('foo', 'bar'), 'foobar');
  //Somewhat equivalent to:
  var wtf2 = fjs.flip(fjs.comp)(fjs.partial(fjs.map, fjs.id), fjs.join);
  assertEq(wtf2(['foo', 'bar']), 'foobar');

  //wtf3 is more readable, thanks to fjs.use:
  //we 'use' the variables we need
  var vars = ['flip', 'comp', 'map', 'id', 'join', {partial: 'p'}];
  fjs.apply(fjs.use, vars);
  //then we test
  var wtf3 = flip(comp)(p(map, id), join);
  assertEq(wtf2(['foo', 'bar']), 'foobar');
  //at last we clean
  fjs.apply(fjs.del, vars);
})();
