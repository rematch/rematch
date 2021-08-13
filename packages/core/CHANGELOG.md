# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/rematch/rematch/compare/@rematch/core@2.0.1...@rematch/core@2.1.0) (2021-08-13)


### Bug Fixes

* build to modules to .mjs instead of .js and sideEffects: false for better treeshaking ([c2978f3](https://github.com/rematch/rematch/commit/c2978f3087f8283249f69b60c569720e56091c36))
* connect() fails on Typescript4.3+ [#893](https://github.com/rematch/rematch/issues/893) ([f794263](https://github.com/rematch/rematch/commit/f7942635d67362565fd72ba0840e31cef1550321))
* context binding in addModel ([#873](https://github.com/rematch/rematch/issues/873)) ([7f99a45](https://github.com/rematch/rematch/commit/7f99a45034848c0c7391862d0b3d6fe6f0288c9b))
* make models on init() Partial<T> ([#892](https://github.com/rematch/rematch/issues/892)) ([991a9d8](https://github.com/rematch/rematch/commit/991a9d842b38aa1a974c0befade3e4be579384c8))
* optional payload inference ([#901](https://github.com/rematch/rematch/issues/901)) ([dfff163](https://github.com/rematch/rematch/commit/dfff1634eb6b4b5d69cca4e7d7c9073fb1583332)), closes [#902](https://github.com/rematch/rematch/issues/902)
* reducers and effects with same name are correctly typed 4.3.X ([#913](https://github.com/rematch/rematch/issues/913)) ([3db2d9f](https://github.com/rematch/rematch/commit/3db2d9f2ad10aa5017960020f643544562d0b031))
* this.reducer typed partially correct ([f43c3a7](https://github.com/rematch/rematch/commit/f43c3a787779cacc8c09ae7827a66bcdd7c6ecd0))
* updated peerDependencies ([#898](https://github.com/rematch/rematch/issues/898)) ([3013605](https://github.com/rematch/rematch/commit/30136054a9c7d2f1b4215e66e2e4065314f841eb))





## [2.0.1](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0...@rematch/core@2.0.1) (2021-02-23)


### Bug Fixes

* redux devtool options ts types ([5fbf8ea](https://github.com/rematch/rematch/commit/5fbf8eaf7599295214f5f76714a644e04280c7d1))





# [2.0.0](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.10...@rematch/core@2.0.0) (2021-01-31)

**Note:** Version bump only for package @rematch/core





# [2.0.0-next.10](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.9...@rematch/core@2.0.0-next.10) (2020-12-27)


### Bug Fixes

* Reduced @rematch/core bundle-size ([#852](https://github.com/rematch/rematch/issues/852)) ([98f3f80](https://github.com/rematch/rematch/commit/98f3f8074735fe5561d3eaefd62af816e912b57c))





# [2.0.0-next.9](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.8...@rematch/core@2.0.0-next.9) (2020-12-22)


### Features

* Introduced meta to action ([#848](https://github.com/rematch/rematch/issues/848)) ([2d55ae4](https://github.com/rematch/rematch/commit/2d55ae4c9612ff6ab01f895e5b9c341fdb96e4f0))





# [2.0.0-next.8](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.7...@rematch/core@2.0.0-next.8) (2020-12-21)


### Bug Fixes

* Improved overall bundle size ([#847](https://github.com/rematch/rematch/issues/847)) ([16e3271](https://github.com/rematch/rematch/commit/16e3271fcb1e44918131971ffd925165a2206fab))





# [2.0.0-next.7](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.6...@rematch/core@2.0.0-next.7) (2020-11-30)


### Bug Fixes

* @rematch/select typescript plugin compatibility ([#828](https://github.com/rematch/rematch/issues/828)) ([61890ca](https://github.com/rematch/rematch/commit/61890ca645ca1aa44bb375b819ee1d4e4316f9e1))


### Features

* support optional payload parameter on reducer ([681acba](https://github.com/rematch/rematch/commit/681acbaa2a3d8b7cc2696b120959a943d919e2a0))





# [2.0.0-next.6](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.5...@rematch/core@2.0.0-next.6) (2020-10-08)


### Bug Fixes

* **core:** changed option value of TExtraModels ([8b416cd](https://github.com/rematch/rematch/commit/8b416cd6d06c966d56d556486e584c0444ee286e)), closes [/github.com/rematch/rematch/pull/819#discussion_r485297126](https://github.com//github.com/rematch/rematch/pull/819/issues/discussion_r485297126)





# [2.0.0-next.5](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.4...@rematch/core@2.0.0-next.5) (2020-09-07)


### Bug Fixes

* regression in destructuring dispatch ([f50c6e4](https://github.com/rematch/rematch/commit/f50c6e4a99e90c5c34662138440e8b5c7139cb36))





# [2.0.0-next.4](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.3...@rematch/core@2.0.0-next.4) (2020-08-26)


### Bug Fixes

* regression state on effects returning never ([671a372](https://github.com/rematch/rematch/commit/671a3723ce20aa5ccbff33d6da7f891a9b0ca340))





# [2.0.0-next.3](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.2...@rematch/core@2.0.0-next.3) (2020-08-26)


### Bug Fixes

* complete typings ([cba1072](https://github.com/rematch/rematch/commit/cba10728d8624fd7da60db276d3edd62fc2fab32))
* createModel refactored ([e024deb](https://github.com/rematch/rematch/commit/e024debc0013a724957673cea9044e30201df857))
* improved typings ([9c23d76](https://github.com/rematch/rematch/commit/9c23d766f230f1947f2e45f7bc173d6b00a6d5d5))
* incompability of redux dispatch with rematch ([9b68614](https://github.com/rematch/rematch/commit/9b68614f646aa565059100b892a40087c713a304))
* model state type inference ([0d29531](https://github.com/rematch/rematch/commit/0d29531ae9539b1ad93f2b3e49905ed3169d113b))
* removed dispatch and fixed some comments ([3e153ae](https://github.com/rematch/rematch/commit/3e153ae2527e6375946e839fdeb64fab7952c34c))
* rootState type inference on effects ([a8b8484](https://github.com/rematch/rematch/commit/a8b84842078d37477fdd8f492d799529170d43cb))
* testing of the new types ([b457478](https://github.com/rematch/rematch/commit/b45747869268d93aa6a2a0c4ed6819eb92257e87))
* using Models as default option ([4e7c29c](https://github.com/rematch/rematch/commit/4e7c29ca649d15b744477db0d3c6f6a753766069))
* **loading:** complete typings ([dfa8688](https://github.com/rematch/rematch/commit/dfa86880b6896b2c0fa645ad888e1693e8019c05))
* **loading:** removed ts-ignore and fixed typings ([0ab397d](https://github.com/rematch/rematch/commit/0ab397d6fbb115da23db011dbb3dd57b9fcee3e1))
* type inference for state and dispatch ([541863b](https://github.com/rematch/rematch/commit/541863b187e5c285dfcd3db70027e94279a183ff))
* type inference of dispatchers ([a129852](https://github.com/rematch/rematch/commit/a129852480fb8468ebdc25ad0883aeb473a0bafb))





# [2.0.0-next.2](https://github.com/rematch/rematch/compare/@rematch/core@2.0.0-next.1...@rematch/core@2.0.0-next.2) (2020-08-19)


### Bug Fixes

* typescript types inference & documentation ([178be27](https://github.com/rematch/rematch/commit/178be27a55753f16bb0c31ed08ab9f8dc2175d4b))





# 2.0.0-next.1 (2020-07-30)


### Reverts

* Revert "chore(release): publish %v [ci skip]" ([10b7f71](https://github.com/rematch/rematch/commit/10b7f71f88b44e6d9bf6f60a9c207e01014ff700))
* Revert "chore(release): publish %v [ci skip]" ([fbc6307](https://github.com/rematch/rematch/commit/fbc6307eec881a9856d01217c2cb570f2d131ca0))





# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2020-03-29

### Changes

- reorganized directories and files to support monorepo structure
- changed building scripts to use tsdx and one common tsconfig as a base
- changed input of validate method - it now accepts a **function** returning a list of validations instead of accepting directly a list, to avoid doing computation in production since it's not needed as errors won't be thrown anyway
- changed behaviour of the validation method - it now collects and throws all errors, not just the first one
- changed the default name assigned to stores from a number to `Rematch Store ${number}` for clarity
- removed possibility for plugins to include any plugins in their configuration as it might introduce duplication etc. It is easy enough to describe in a plugin's readme that some other plugin is required first.
- removed `meta` parameter from action - it was described as *"...for advanced use cases only"* but it seems that anything handled with meta could be also handled without it so for the ease of use and clarity to users, it was removed.
- removed `onInit` hook as there is really no use case for it
- added new hooks for plugins - `onReducer` and `onRootReducer`
- improved typings
- changed dispatch and effects to be internal part of the core code instead of plugins - it makes it easier to reason about the code, to write plugins and to declare types, both for the core and plugins

## [1.4.0] - 2020-02-22

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

- added `model.baseReducer` for using normal redux reducers within a model [#450](https://github.com/rematch/rematch/pull/446). Additional `model.reducers` run after the baseReducer to produce the final state. See [model.baseReducer](https://github.com/rematch/rematch/blob/main/docs/api.md#basereducer) for details.

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
