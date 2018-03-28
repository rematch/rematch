# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning(http://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2018-03-27
### Changed
Effects now dispatch actions that can be seen in the devtools.

## [0.5.3] - 2018-03-05
### Added
Support for devtool action creators. See [#281](https://github.com/rematch/rematch/pull/281).

## [0.5.0] - 2018-03-05
### Added
- listen to actions from other models within your reducers

```js
const count2 = {
  state: 0,
  reducers: {
    // listens for action from other reducer
    'count1/increment': (state) => state + 1
  }
}
```

Note: not yet available for effects.

### Deprecated
- `getState` from core in 0.4.0 will be removed with v1.0.0.

## [0.4.0] - 2018-02-18
### Added
- export `getState` from core. See example below:

```js
import { getState } from '@rematch/core'

const state = getState()
```

- dispatch meta parameter - an optional second dispatch param that can be used to pass "meta" information

```js
dispatch.example.update(payload, { syncWithServer: true })
// is equal to:
// dispatch({ type: 'example/update', payload, meta: { syncWithServer} })
```

Meta can be accessed as the third param from reducers and effects.

```js
const model = {
  state: 0,
  reducers: {
    someReducer: (state, payload, meta) {
      // see meta as third param
    }
  }
}
```

## [0.3.0] - 2018-02-10
### Added
- a dispatch will return a value as a Promise

## [0.2.0] - 2018-02-03
### Added
- Overwrite store.dispatch with rematch dispatch. No more need for importing dispatch when using "react-redux".
