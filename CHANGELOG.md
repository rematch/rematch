# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2019-02-22

### Changes

- improved typings. Now can specify model as generic: `RematchDispatch<RootModel>` (@777PolarFox777)
- improved inferred typings (@777PolarFox777)

## [1.2.0] - 2019-09-07

### Added

- typings improvements for models
- update dependencies & examples

## [1.0.7] - 2019-03-02

### Added

- set plugins to use MIT license
- update dependencies & examples
- fix issue on IE11
- setup TypeScript tests & Travis CI builds

## [1.0.0] - 2018-09-27

### Added

- 6 mint leaves, 3/4oz simple syrup, 3/4oz lime juice, 1oz rum, 2oz club soda. Happy 1.0!

## [1.0.0-beta.5] - 2018-06-27

### Added

- added `model.baseReducer` for using normal redux reducers within a model [#450](https://github.com/rematch/rematch/pull/446). Additional `model.reducers` run after the baseReducer to produce the final state. See [model.baseReducer](https://github.com/rematch/rematch/blob/master/docs/api.md#basereducer) for details.

## [1.0.0-beta.3] - 2018-06-23

### Breaking Change

- removed `dispatch` & `getState` imports. See [#446](https://github.com/rematch/rematch/pull/446).
  Instead it is recommended to use:

```js
import { init } from '@rematch/core'

const store = init()

export const { getState, dispatch } = store
export default store
```

### Added

- plugin `onStoreCreated` can now return an object, that will merge into the return value of `init`. See [#443](https://github.com/rematch/rematch/pull/443).

## [1.0.0-beta.2] - 2018-06-16

### Added

- Option to disable devtools [9a17312](https://github.com/rematch/rematch/commit/9a1731282cbc90394220b09f3b7d1a3e4ca61849)
- Improved typings
- Option to name a store on init [6c69529](https://github.com/rematch/rematch/commit/6c695297a1f200a59a47070d5fa4f9e1c492020e)
- Access to config inside of plugins for plugin development

## [1.0.0-beta.1] - 2018-06-12

### Added

- fix to ensure lazy loaded stores will update [9a44865](https://github.com/rematch/rematch/commit/9a44865fa028585e7fadf8d63d47db89cf0a5402)

## [1.0.0-beta.0] - 2018-06-11

### Added

- typings fixes
- support TS strict null types

## [1.0.0-alpha.9] - 2018-06-10

- fix select plugin typings
- resolve issue with rootState in effects

## [1.0.0-alpha.8] - 2018-06-02

### Added

- Use a function as your "effects" to access local `dispatch`

```js
{
	effects: dispatch => ({
		async someEffect() {
			dispatch.someModel.someAction()
		},
	})
}
```

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
		'count1/increment': state => state + 1,
	},
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
