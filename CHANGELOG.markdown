Episode 7 Changelog
===================

This module adhears to semver, incrementing major version for any breaking change.

v1.1
----

* `Episode7.run` now supports yielding to generators, in addition to promises
* `Episode7.call` now supports a `this` argument for side-effect functions:
  
  Before (v1.0.x)
  ```javascript
  function* awesomeGen() {
    yield Episode7.call(neatSideEffect)
  }
  ```

  Now (v1.1.0)
  ```javascript
  function* awesomeGen() {
    yield Episode7.call([this, neatSideEffect])
  }
  ```
* Guardrail errors inform the developer if `yield` is used without `Episode7.call`


v1.0
----
Initial release