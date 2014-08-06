## Functionnal JavaScript

Written with functionnal programming in mind Functional Javascript is a general purpose library providing functions allowing you to use functional programming in JS.

### Usage

```
npm install functional-javascript
```

And in your script:

```JavaScript
var fjs = require('functional-javascript');
```

You can also find the documentation page [here](http://gaku-sei.github.io/functional-javascript/).

### What is Functional Javascript

- General purpose functions (eq, clone, keys, values, ...)
- Iteration functions (map, mapkv, reduce, reducer, reducekv, filter, some, every, takeWhile, dropWhile, ...)
- Functions manipulation (comp, partial, curry, juxt, call, callWith, apply, applyWith, ...)
- Variadic operator functions (deq, teq, gt, lt, gte, lte, or, and, xor, isa, ...)
- Manipulation and access functions (cons, conj, merge, assoc, get, first, second, last, butfirst, butlast, ...)
- Type checking (isArray, isArrayLike, areArguments, isFalse, isTrue, isNull, isUndefined, isObject, isString, ...)
- Variadic operation functions (add, mul, div, sub)

### Warnings

FJS has only been tested on later versions of main browsers (Maxthon, Google Chrome, Opera and Firefox) for the moment and seems to work as excepted on nodeJS (>= 0.8).
Also, even if already tested in browser, proper node js tests are still being written.
