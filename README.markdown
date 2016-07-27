Episode 7 📺
============
Enhanced sequencing of asynchronous code with [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

[![Build Status](https://travis-ci.org/mars/episode-7.svg?branch=master)](https://travis-ci.org/mars/episode-7)
[![npm Module](https://img.shields.io/npm/v/episode-7.svg)](https://www.npmjs.com/package/episode-7)

* model complex side-effects as synchronous stories
  * multi-request HTTP/REST API flows with a final result
  * infinite stream processors
  * see: [ES6 Generators in Depth](https://ponyfoo.com/articles/es6-generators-in-depth)
* handle async errors confidently through Promise `catch`
* minimize the ceremony around a testable async abstraction

It's a tiny library:

* no production npm dependencies
* <100-lines-of-code (without comments)
* [Read it](index.js); I've already said too much.


# No more HTTP mocks 🚫🕸

Write concise tests for an asynchronous story. Skip execution of side-effects. Instead, assert their call arguments, and mock their plain return value.
See: ["Easily test yielded calls, mock their return values"](index-test.js)

# Functional in nature 🌲

Inspired by the test-friendly generator architecture of [`redux-saga`](https://github.com/yelouafi/redux-saga) and the pure side-effects of [Elm](http://elm-lang.org).

Requires
--------

[ES6/Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) support.

* Known to work in [Node.js](https://nodejs.org) 6.2
* Should work in any ES6-compliant JavaScript environment

Install
-------

```bash
npm install episode-7 --save
```

Changes
-------

See: [CHANGELOG](CHANGELOG.markdown)

Usage
-----

```javascript
const Episode7 = require('episode-7');
const fetch = require('node-fetch');

// Compose an Episode 7 Generator for an async call sequence.
//
function* findFirstMovie(searchTerm) {

  // Wrap side-effects with Episode 7's `call`
  //
  let results = yield Episode7.call(
    fetchJson,
    `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}`
  );

  // Do something programmatic with the result.
  //
  let firstResultId = results.Search[0].imdbID;
  
  // Use that transformed value to make the next call.
  //
  let movie = yield Episode7.call(
    fetchJson,
    `http://www.omdbapi.com/?i=${encodeURIComponent(firstResultId)}`
  );

  return movie;
}

// Side-effect function,
// a barebones helper to fetch & decode JSON.
//
function fetchJson(url) {
  return fetch(url).then( response => response.json() );
}

// Run the generator with Episode 7, returning a promise.
//
Episode7.run(findFirstMovie, 'Episode 7')
  .then( movie => console.log(movie.Title) )
  .catch( error => console.error(error) )
```

### Smooth running tips 🚝

#### Handle errors

[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) after `Episode7.run` to handle errors from the async flow (log|exit|retry).

Avoid catching within side-effect functions. Allow their errors to bubble up.

#### Name generator functions

Declare generator functions as [named function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function); this makes stacktraces & error messages more meaningful.


Background
----------
I created this module to make it easy to code & test sequences of web service API requests interleaved with programmatic logic. I'm pulling the essence of [`redux-saga`](https://github.com/yelouafi/redux-saga) into the smallest, plainest surface area conceivable.
