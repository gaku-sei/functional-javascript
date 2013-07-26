# Functionnal JavaScript

  Written with functionnal programming in mind FJS is a general purpose library providing functions allowing more and more fp in JS.
  No tricks, no metaprogramming, simplicity and readability first in source code.
  In addition to this doc, you can have a description and some examples for every function exported by fjs simply by calling fjs.doc on any of them,
or in their doc attribute. Plus, the source code defines several versions of the same function with the imperative way and the functionnal way
(clearer, cleaner, more readable and way shorter, but also sometimes slower...).
  Last but not least, FJS is fast.

# What is FJS

  FJS exports an object fjs with more than 100 functions:
    - general purpose functions (eq, clone, keys, values, etc...)
    - iteration functions (map, mapkv, reduce, reducekv, filter, some, every, takeWhile, dropWhile, etc...)
    - functions manipulation (comp, partial, juxt, call, callWith, apply, applyWith, etc...)
    - variadic operator functions (deq, teq, gt, lt, gte, lte, or, and, xor, etc...)
    - manipulation and access functions (cons, conj, merge, assoc, get, first, second, last, butfirst, butlast, etc...)
    - type checking (isArray, isArrayLike, areArguments, isFalse, isTrue, isNull, isUndefined, isObject, isString, etc...)
    - variadic operation functions (add, mul, div, sub)
    - and more...

# Warnings

  FJS has only been tested on later versions of main browsers (Maxthon, Google Chrome, Opera and Firefox) for the moment and seems to work as excepted on nodeJS (>= 0.8).

# Credits

  beViral - 2013
