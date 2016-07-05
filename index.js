/*
Run a generator with Episode 7

```javascript
let result = Episode7.run(yourGeneratorFunction);
```

Returns a Promise resolving when the generator is done.
*/
function run(generator, ...args) {
  try {
    let g = generator(...args);
    g.episode7Name = generator.name;
    return recursiveRun(g);

  } catch(error) {
    return Promise.reject(error);
  }
}

/*
Perform a side-effect with Episode 7

```javascript
yield Episode7.call(functionToCall, arg1, arg2)
```

Passes through to JavaScript `Function.prototype.call`.

The return value is not passed back to the yield statement. Episode 7
will call `functionToCall` when running and return a Promise resolving
with its return value.

This function's return value is useful in testing as an object 
representing the side-effect to perform.
*/
function call(fn, ...args) {
  return { fn, args };
}

/*
Internal function to run the generator, waiting on
each side-effect's returned Promise.

Each side-effect function is executed via standard
JavaScript `Function.prototype.call`.

Returns a Promise of the return value from
the generator.

*/
function recursiveRun(genInstance, nextArg) {
  try {
    let nextResult = genInstance.next(nextArg);
    if (nextResult.done) {
      return Promise.resolve(nextResult.value);
    } else {
      let v = nextResult.value;
      let fn = v.fn;
      let args = v.args;

      if (fn == null || args == null) {
        throw new Error('`Episode7.run` requires using `Episode7.call` with every `yield`. '+
          'Check all of the `yield` expressions in [Function: '+genInstance.episode7Name+']');
      }

      // Iterate through the generator, handling
      // promises & nested generators.
      // Side-effect function is called without `this`.
      let sideEffect;
      if (isGeneratorFunction(fn)) {
        sideEffect = Promise.resolve()
          .then(function() {
            // Wrapped in `then` to promisify return value
            return run(fn, ...args)
          })
      } else {
        sideEffect = Promise.resolve()
          .then(function() {
            // Wrapped in `then` to promisify return value
            return fn.call(null, ...args)
          })
      }
      return sideEffect
        .then(function(result) {
          return recursiveRun(genInstance, result);
        })
    }

  } catch(error) {
    return Promise.reject(error);
  }
}

/*
Internal helpers.

Source: https://github.com/tj/co/blob/717b043371ba057cb7a4a2a4e47120d598116ed7/index.js

*/
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
function isGeneratorFunction(obj) {
  if (obj == null) return false;
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

module.exports = {
  run,
  call
}
