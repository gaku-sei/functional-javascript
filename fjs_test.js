var assertEq = function(x, y, line) {
  if(x !== y) throw Error(x + " is different from " + y + " in fjs_test at line " + line);
};

assertEq(1, 1);

//_core

//#_for
var i = 0;
_for([1,2,3], function(x, j, xs) {
  switch(i) {
  case 0:
    assertEq(x, 1);
    assertEq(j, "0");
    break;
  case 1:
    assertEq(x, 2);
    assertEq(j, "1");
    break;
  case 2:
    assertEq(x, 3);
    assertEq(j, "2");
    break;
  }
  ++i;
});

//#_is
assertEq(isString("foobar"), true);
assertEq(isString({}), false);
assertEq(isString([]), false);
assertEq(isString(0), false);
assertEq(isObject({foo:42}), true);
assertEq(isObject(""), false);
assertEq(isObject([]), false);
assertEq(isObject(0), false);
assertEq(isArray([1,2,3]), true);
assertEq(isArray({}), false);
assertEq(isArray(""), false);
assertEq(isArray(0), false);

//#_cloneArray
var xs = [1,2,3];
var ys = clone(xs);
for(i in xs)
  assertEq(xs[i], ys[i]);
ys.push(4);
assertEq(xs.length, 3);
assertEq(ys.length, 4, 50);
assertEq(ys[3], 4, 51);

var xs = [[1],2];
var ys = clone(xs)
assertEq(xs[0][0], ys[0][0]);
assertEq(xs[1], ys[1]);
ys.push([3]);
xs.push([4]);
assertEq(ys[2][0], 3);
assertEq(xs[2][0], 4, 60);

//#_cloneObject
var obj = {foo: 1, bar: 2};
var cobj = clone(obj);
for(i in xs)
  assertEq(obj[i], cobj[i]);
obj.baz = 3;
cobj.qux = 4;
assertEq(cobj.baz, undefined);
assertEq(obj.qux, undefined);
assertEq(obj.baz, 3);
assertEq(cobj.qux, 4, 72);

//#_arity
var xs = _arity(3)(Array)(1,2,3,4);
assertEq(xs.length, 3);
assertEq(xs[0], 1);
assertEq(xs[1], 2);
assertEq(xs[2], 3);

//#_console
var _consoleTest = function() {
  var log = _console("log");
  assertEq(log(1), 1);
  var xs = log(1,2,3);
  var ys = [1,2,3];
  for(i in xs)
    assertEq(log(xs[i]), ys[i]);
};
_consoleTest()

//core

//#id
var xs = [1,2,3];
var ys = id(xs);
for(i in xs)
  assertEq(xs[i], ys[i]);
xs.push(4);
assertEq(xs.length, ys.length);
assertEq(xs[3], ys[3]);
var x = "foo";
var y = id(x);
assertEq(x, y);
var x = 1;
var y = id(1);
assertEq(x, y);

//#clone
var x = [{foo: [1,2], bar: "baz"}, 2, "qux"];
var y = clone(x);
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

//#apply
var addThree = function(x, y, z) { return x + y + z };
assertEq(apply(addThree, [2,5,6]), 13);

//#call
var addThree = function(x, y, z) { return x + y + z };
assertEq(call(addThree, 5, 2, 4), 11);

//#slice
var xs = [1,2,3];
var ys = slice([1,2,3]);
for(i in xs)
  assertEq(xs[i], ys[i]);
var ys = slice(xs, 1);
assertEq(ys[0], 2);
assertEq(ys[1], 3);
var ys = slice(xs, -1);
assertEq(ys[0], 3);
var ys = slice(xs, 1, 2);
assertEq(ys[0], 2);
assertEq(ys.length, 1);

//#join
assertEq(join(["foo", "bar"]), "foobar");
assertEq(join(["foo", "bar"], "/"), "foo/bar");

//#concat2
assertEq(concat2().length, 0);
assertEq(concat2([]).length, 0);
assertEq(concat2([], []).length, 0);
var xs = concat2([1], [2]);
assertEq(xs[0], 1);
assertEq(xs[1], 2);
var xs = concat2([[1,2]], [[3]]);
assertEq(xs[0][1], 2);
assertEq(xs[1][0], 3);
var xs = concat2([1], [2], [3]);
assertEq(xs.length, 2);

//#concat
assertEq(concat().length, 0);
assertEq(concat([]).length, 0);
assertEq(concat([], []).length, 0);
var xs = concat([1,2,3], [4], [5,6]);
assertEq(xs.length, 6);

//#map
var xs = [1,2,4];
var ys = map(xs, function(x) { return x + 2 });
assertEq(ys[0], 3);
assertEq(ys[1], 4, 150);
assertEq(ys[2], 6);
var inc = function(x) { return x + 1 };
var ys = map(xs, inc);
assertEq(ys[0], 2);
assertEq(ys[1], 3);
assertEq(ys[2], 5);

//#times
var i = 0;
times(12, function() { ++i });
assertEq(i, 12);

//#cons
var xs = cons([2, 3], 1);
assertEq(xs[0], 1);
assertEq(xs[1], 2);
assertEq(xs[2], 3);
var xs = cons([3,[4]], [1]);
assertEq(xs[0][0], 1);
assertEq(xs[1], 3);
assertEq(xs[2][0], 4, 166);

//#conj
var xs = conj([2, 3], 1);
assertEq(xs[0], 2);
assertEq(xs[1], 3);
assertEq(xs[2], 1);
var xs = conj([3,[4]], [1]);
assertEq(xs[0], 3);
assertEq(xs[1][0], 4, 175);
assertEq(xs[2][0], 1);

//#first
assertEq(first([4,5,2]), 4);
assertEq(first(["foo", "bar", "baz"]), "foo");

//#butfirst
var xs = [2,6,3];
var ys = [6,3];
var zs = butfirst(xs);
for(i in zs)
  assertEq(zs[i], ys[i]);

//#second
assertEq(second([4,5,2]), 5);
assertEq(second(["foo", "bar", "baz"]), "bar");

//#last
assertEq(last([4,5,2]), 2);
assertEq(last(["foo", "bar", "baz"]), "baz");

//#butlast
var xs = [2,6,3];
var ys = [2,6];
var zs = butlast(xs);
for(i in zs)
  assertEq(zs[i], ys[i]);

//#get
assertEq(get([1,2,3], 0), 1);
assertEq(get({foo: {bar: [1,2]}}, ["foo", "bar", 1]), 2);
assertEq(get([1,2], 4, "Not Found..."), "Not Found...");
assertEq(get([1,2], 4), undefined);
assertEq(get({foo: [1,"bar"]}, ["foo", 1, 2]), "r");
assertEq(get({foo: "bar"}, "foo"), "bar");
assertEq(get([1,2,3], 0), 1);

//#sum
assertEq(sum([1,2,3,4]), 10);
//Space Oddity Notice: it's a normal behavior and it's neither a desired feature nor a real bug.
assertEq(sum([1,2,"foo"]), "3foo");

//#repeat
var xs = repeat("foo");
assertEq(isArray(xs) && eqZero(xs.length), true);
var xs = repeat("foo", 0);
assertEq(isArray(xs) && eqZero(xs.length), true);
var xs = repeat("foo", "");
assertEq(isArray(xs) && eqZero(xs.length), true);
var xs = repeat("foo", 10);
assertEq(isArray(xs) && eq(xs.length, 10), true);
for(i in xs)
  assertEq(xs[i], "foo");

//#cycle
var xs = ["foo", "bar", "baz"];
assertEq(cycle(xs).length, 0);
assertEq(cycle(xs, 0).length, 0);
assertEq(cycle(xs, 3).length, 9);
var ys = cycle(xs, 2);
assertEq(ys[0], xs[0]);
assertEq(ys[1], xs[1]);
assertEq(ys[2], xs[2]);
assertEq(ys[3], xs[0]);
assertEq(ys[4], xs[1]);
assertEq(ys[5], xs[2]);

//#reduce
//Like map, reduce is heavily used in others functions (mostly the variadic ones)
//such as reverse, sum, add or concat... So if they work properly, so does reduce...
//No test for the moment!

//#reverse
var xs = [1,2,3];
var ys = [3,2,1];
var zs = reverse(xs);
for(i in zs)
  assertEq(zs[i], ys[i]);
var xs = ["foo","bar","baz"];
var ys = ["baz","bar","foo"];
var zs = reverse(xs);
for(i in zs)
  assertEq(zs[i], ys[i]);

//#every
var eqFoo = function(x) { return x === "foo" };
var xs = ["foo", "foo", "foo"];
var ys = ["foo", "bar", "foo"];
assertEq(every(xs, eqFoo), true);
assertEq(every(ys, eqFoo), false);

//#some
var eqFoo = function(x) { return x === "foo" };
var xs = ["foo", "bar", "baz"];
var ys = ["bar", "baz", "qux"];
assertEq(some(xs, eqFoo), true);
assertEq(some(ys, eqFoo), false);

//#comp
var addOne = function(x) { return x + 1 };
var twoTimes = function(x) { return x * 2 };
assertEq(comp(addOne, twoTimes)(2), 5);
assertEq(comp(twoTimes, addOne)(4), 10);

//#partial
var f = function(x, y, z) { return x + y / z };
var g = partial(f, 2, 10);
assertEq(g(5), 4, 200);

//#juxt
var f = function(x) { return x + 1 };
var g = function(x) { return x - 1 };
var xs = juxt(f, g)(3);
assertEq(xs[0], 4, 206);
assertEq(xs[1], 2);

//#flip
var f = function(x, y) { return x / y };
var g = flip(f);
assertEq(f(10, 2), 5);
assertEq(g(10, 2), 0.2);

//#fmap
var xs = [1,2,4];
var ys = fmap(function(x) { return x + 2 }, xs);
assertEq(ys[0], 3);
assertEq(ys[1], 4, 150);
assertEq(ys[2], 6);
var inc = function(x) { return x + 1 };
var ys = fmap(inc, xs);
assertEq(ys[0], 2);
assertEq(ys[1], 3);
assertEq(ys[2], 5);

//#feach
var i = 0;
feach(function(x, j, xs) {
  switch(i) {
  case 0:
    assertEq(x, 1);
    assertEq(j, "0");
    break;
  case 1:
    assertEq(x, 2);
    assertEq(j, "1");
    break;
  case 2:
    assertEq(x, 3);
    assertEq(j, "2");
    break;
  }
  ++i;
}, [1,2,3]);

//#freduce
//See #reduce

//#log
//See #_console

//#log1
var log1Test = function() {
  assertEq(log1(1), 1);
  assertEq(log1(1,2,3), 1);
};
log1Test()

//#warn
//See #_console

//#warn1
var warn1Test = function() {
  assertEq(warn1(1), 1);
  assertEq(warn1(1,2,3), 1);
};
warn1Test()

//#error
//See #_console

//#error1
var error1Test = function() {
  assertEq(error1(1), 1);
  assertEq(error1(1,2,3), 1);
};
error1Test()

//#eq
assertEq(eq(1, 1), true);
assertEq(eq("foo", "foo"), true);

//#even
assertEq(even(-15), false);
assertEq(even(-4), true);
assertEq(even(0), true);
assertEq(even(1), false);
assertEq(even(23), false);
assertEq(even(2342), true);

//#odd
assertEq(odd(-15), true);
assertEq(odd(-4), false);
assertEq(odd(0), false);
assertEq(odd(1), true);
assertEq(odd(23), true);
assertEq(odd(2342), false);

//#inc
assertEq(inc(2), 3);
assertEq(inc(-4), -3);

//#dec
assertEq(dec(2), 1);
assertEq(dec(-4), -5);

//#eqZero
assertEq(eqZero(0), true);
assertEq(eqZero(2), false);
assertEq(eqZero(-3), false);

//#eqOne
assertEq(eqOne(1), true);
assertEq(eqOne(0), false);
assertEq(eqOne(2), false);
assertEq(eqOne(-3), false);

//#isEmpty
assertEq(isEmpty([]), true);
assertEq(isEmpty(""), true);
assertEq(isEmpty({}), true);
assertEq(isEmpty([1,2]), false);
assertEq(isEmpty("foo"), false);
assertEq(isEmpty({foo: 42}), false);

//#isObject
assertEq(isObject({}), true);
assertEq(isObject(""), false);
assertEq(isObject([]), false);
assertEq(isObject(function(){}), false);
assertEq(isObject(2), false);

//#isArray
assertEq(isArray([]), true);
assertEq(isArray(""), false);
assertEq(isArray(function(){}), false);
assertEq(isArray({}), false);
assertEq(isArray(2), false);

//#isString
assertEq(isString(""), true);
assertEq(isString(function(){}), false);
assertEq(isString([]), false);
assertEq(isString({}), false);
assertEq(isString(2), false);

//#isFunction
assertEq(isFunction(function(){}), true);
assertEq(isFunction(""), false);
assertEq(isFunction([]), false);
assertEq(isFunction({}), false);
assertEq(isFunction(2), false);

//#isArgument
(function() { assertEq(isArgument(arguments), true) })();
assertEq(isArgument(function(){}), false);
assertEq(isArgument(""), false);
assertEq(isArgument([]), false);
assertEq(isArgument({}), false);
assertEq(isArgument(2), false);

//#isArrayLike
(function() { assertEq(isArrayLike(arguments), true) })();
assertEq(isArrayLike([]), true);
assertEq(isArrayLike(function(){}), false);
assertEq(isArrayLike(""), false);
assertEq(isArrayLike({}), false);
assertEq(isArrayLike(2), false);

//#isTrue
assertEq(isTrue(true), true);
assertEq(isTrue(""), false);
assertEq(isTrue(1), false);
assertEq(isTrue(false), false);

//#isFalse
assertEq(isFalse(false), true);
assertEq(isFalse(""), false);
assertEq(isFalse(1), false);
assertEq(isFalse(true), false);

//#isNull
assertEq(isNull(null), true);
assertEq(isNull(""), false);
assertEq(isNull([]), false);
assertEq(isNull({}), false);
assertEq(isNull(2), false);

//#isUndefined
assertEq(isUndefined(undefined), true);
assertEq(isUndefined(""), false);
assertEq(isUndefined([]), false);
assertEq(isUndefined({}), false);
assertEq(isUndefined(2), false);

//#add
assertEq(add(), 0);
assertEq(add(2), 2);
assertEq(add(2,3,4,5), 14);

//#sub
assertEq(sub(), 0);
assertEq(sub(2), 2);
assertEq(sub(2,3,4,5), -10);

//#mul
assertEq(mul(), 0);
assertEq(mul(2), 2);
assertEq(mul(2,3,4,5), 120);

//#div
assertEq(div(), 0);
assertEq(div(2), 2);
assertEq(div(84,2,4), 10.5);

//Cross Tests
//  Let's test some more complex (and less realistic) code with several fjs functions in a row.

//wtf creates an array containing the result of id applied to each element of arguments (i.e: themselves)
//then joins the elements of this array.
//Why would we do some simple code, when we may do some funny (and test valuable) code?
var wtf = function() { return flip(comp)(partial(map, arguments), join)(id) };
assertEq(wtf("foo", "bar"), "foobar");
