Episode 7 📺
============
Enhanced sequencing of asynchronous code with [ES6 generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator).

> A tiny module created to solve one problem in a generalized way.

Easily test Promise-based side-effects.  
See: ["Easily test yielded calls, mock their return values"](index-test.js)

Inspired by the test-friendly generator architecture of [`redux-saga`](https://github.com/yelouafi/redux-saga).

Requires
--------

* [Node.js](https://nodejs.org) with ES6/Generator support (known to work in 6.2)

Install
-------

```bash
npm install episode-7 --save
```

Usage
-----

```javascript
const Episode7 = require('episode-7');
const fetch = require('node-fetch');

// Barebones helper to fetch & decode JSON.
function fetchJson(url) {
  return fetch(url).then( response => response.json() );
}

// Compose a Generator for a async call sequence.
function* findFirstMovie(searchTerm) {

  // Wrap yielded function calls with Episode 7.
  let results = yield Episode7.call(
    fetchJson, `http://www.omdbapi.com/?s=${searchTerm}`
  );

  let movie = yield Episode7.call(
    fetchJson, `http://www.omdbapi.com/?i=${results.Search[0].imdbID}`
  );

  return Promise.resolve(movie);
}

// Run the generator & get a Promise for the completed process.
Episode7.run(findFirstMovie, 'Episode 7')
  .then( movie => console.log(movie.Title) )
```


Background
----------
How many times can a person write web service API calls in a dependent sequence, e.g. authenticate, fetch identity, query for records, then create or update those records? So many variations of this theme are created everyday, frequently involving multiple services.

I created this module to make it easy to code sequences of web service API requests interleaved with programmatic logic. I'm pulling the essence of [`redux-saga`](https://github.com/yelouafi/redux-saga) into the smallest, plainest surface area conceivable.