Episode 7 📺
============
Enhanced sequencing of asynchronous code with [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

Use this module to:

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

// Barebones helper to fetch & decode JSON.
function fetchJson(url) {
  return fetch(url).then( response => response.json() );
}

// Compose a Generator for an async call sequence.
function* findFirstMovie(searchTerm) {

  // Wrap side-effects with Episode 7's `call`
  let results = yield Episode7.call(
    fetchJson,
    `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}`
  );
  
  let firstResultId = results.Search[0].imdbID;
  
  let movie = yield Episode7.call(
    fetchJson,
    `http://www.omdbapi.com/?i=${encodeURIComponent(firstResultId)}`
  );

  return movie;
}

// Run the generator & get a Promise for the return value.
Episode7.run(findFirstMovie, 'Episode 7')
  .then( movie => console.log(movie.Title) )
  .catch( error => console.error(error) )
```


Background
----------
How many times can a person write web service API calls in a dependent sequence, e.g. authenticate, fetch identity, query for records, then create or update those records? So many variations of this theme are created everyday, frequently involving multiple services.

I created this module to make it easy to code sequences of web service API requests interleaved with programmatic logic. I'm pulling the essence of [`redux-saga`](https://github.com/yelouafi/redux-saga) into the smallest, plainest surface area conceivable.
