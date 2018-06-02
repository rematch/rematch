# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning(http://semver.org/spec/v2.0.0.html).

## [1.0.0-alpha.7] - 2018-06-02
### Changed
- TS typings improvements:
  - Use `createModel` with TS models
  - Use `getSelect` with TS select
  - See TS example for details

## [1.0.0-alpha.3] - 2018-05-06
### Changed
- much improved TS typings, now with dispatch autocomplete

## [1.0.0-alpha.1] - 2018-04-10
### Added
- improved TS typings
- use store names in redux devtools

## [1.0.0-alpha.0] - 2018-04-07
### Added
- Support for TypeScript. See [notes](./docs/recipes/typescript.md)
- Support for multiple stores. See [api docs](./docs/api.md)

### Changed
- plugin API has changed to avoid using `init`. Shared dependencies are accessed with `this`. See the [plugins API](./docs/pluginsApi.md)
- as a result of plugin API changes, v1.0.0-alpha.0 requires updating all plugins
- imported global `dispatch` now fires into all stores
- imported global `getState` now gets state from all stores.
  Note: `init({ name })` will be used as the store.name, otherwise it defaults to the index.

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
- `getState` from core in 0.4.0 will be altered with v1.0.0.

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
