/*
Run a generator with Episode 7

```javascript
let result = Episode7.run(yourGeneratorFunction);
```

Returns a Promise resolving when the generator is done.
*/
function run(generator, ...args) {
  let g = generator(...args);
  return recursiveRun(g);
}

/*
Yield a side-effect to Episode 7

```javascript
yield Episode7.call(functionToCall, arg1, arg2)
```

The return value is not passed back to the yield statement. Episode 7
will call `functionToCall` when running and return a Promise resolving
with its return value.

This function's return value is useful in testing as an object 
representing the side-effect to perform.
*/
function call(fn, ...args) {
  return { fn, args };
}


function recursiveRun(genInstance, nextArg) {
  let nextResult = genInstance.next(nextArg);
  if (nextResult.done) {
    return Promise.resolve(nextResult.value);
  } else {
    let v = nextResult.value;
    let fn = v.fn;
    let args = v.args;
    return fn.call(null, ...args)
      .then(function(result) {
        return recursiveRun(genInstance, result);
      });
  }
}

module.exports = {
  run,
  call
}
