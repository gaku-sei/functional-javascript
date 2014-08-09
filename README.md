## Functionnal JavaScript

Functional-JavaScript is a general purpose library targeting functional programming in JS.

### Usage

```
npm install functional-javascript
```

And in your script:

```JavaScript
var fjs = require('functional-javascript');
```

You can find the documentation page [here](http://gaku-sei.github.io/functional-javascript/).
And the NPM page [here](https://www.npmjs.org/package/functional-javascript).
Also, a browser version can be found [here](https://github.com/gaku-sei/functional-javascript-browser).

### What is Functional-JavaScript

- General purpose functions (eq, clone, keys, values, ...)
- Iteration functions (map, mapkv, reduce, reducer, reducekv, filter, some, every, takeWhile, dropWhile, ...)
- Functions manipulation (comp, partial, curry, juxt, call, callWith, apply, applyWith, ...)
- Variadic operator functions (deq, teq, gt, lt, gte, lte, or, and, xor, isa, ...)
- Manipulation and access functions (cons, conj, merge, assoc, get, first, second, last, butfirst, butlast, ...)
- Type checking (isArray, isArrayLike, areArguments, isFalse, isTrue, isNull, isUndefined, isObject, isString, ...)
- Variadic operation functions (add, mul, div, sub)

### Warnings

Functional-JavaScript has already been tested in browser, but proper node js tests are being written.
