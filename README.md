### Functionnal JavaScript

Written with functionnal programming in mind FJS is a general purpose library providing functions allowing more and more fp in JS.
No tricks, no metaprogramming, simplicity and readability first in source code.
In addition to this doc, you can have a description and some examples for every function exported by fjs simply by calling fjs.doc on any of them,
or in their doc attribute. Plus, the source code defines several versions of the same function with the imperative way and the functionnal way
(clearer, cleaner, more readable and way shorter, but also sometimes slower...).
Last but not least, FJS is fast.

### What is FJS

FJS defines an object fjs (and _ if not defined yet) with more than 190 functions:
- General purpose functions (eq, clone, keys, values, etc...)
- Iteration functions (map, mapkv, reduce, reducer, reducekv, filter, some, every, takeWhile, dropWhile, etc...)
- Functions manipulation (comp, partial, curry, juxt, call, callWith, apply, applyWith, etc...)
- Variadic operator functions (deq, teq, gt, lt, gte, lte, or, and, xor, etc...)
- Manipulation and access functions (cons, conj, merge, assoc, get, first, second, last, butfirst, butlast, etc...)
- Type checking (isArray, isArrayLike, areArguments, isFalse, isTrue, isNull, isUndefined, isObject, isString, etc...)
- Variadic operation functions (add, mul, div, sub)
- And more...

### Warnings

FJS has only been tested on later versions of main browsers (Maxthon, Google Chrome, Opera and Firefox) for the moment and seems to work as excepted on nodeJS (>= 0.8).
