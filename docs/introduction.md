# Rematch

<a class="github-button" href="https://github.com/rematch/rematch" data-icon="octicon-star" data-show-count="true" aria-label="Star rematch/rematch on GitHub">Star</a> [![Chat on slack](https://img.shields.io/badge/slack-rematchjs-blue.svg?logo=slack&style=flat-square)](https://rematchjs.slack.com) ![Rematch CI](https://github.com/rematch/rematch/workflows/Rematch%20CI/badge.svg?branch=next) ![npm (tag)](https://img.shields.io/npm/v/@rematch/core/next?style=flat-square) [![Bundle size](https://img.shields.io/badge/bundlesize-~2.2kb-brightgreen.svg?style=flat-square)](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat-square) [![File size](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat-square)](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat-square) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lerna.js.org/)

> Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

## Features

Redux is an amazing state management tool, supported by a healthy middleware ecosystem and excellent devtools.
Rematch builds upon Redux by reducing boilerplate and enforcing best practices. It provides the following features:

- No configuration needed
- Reduces Redux boilerplate
- Built-in side-effects support
- [React Devtools](https://github.com/facebook/react/tree/master/packages/react-devtools) support
- TypeScript support
- Supports dynamically adding reducers
- Supports hot-reloading
- Allows to create multiple stores
- Supports React Native
- Extendable with plugins
- Many plugins available out of the box:
    - for persisting data with [redux-persist](https://github.com/rt2zz/redux-persist)
    - for wrapping state with [immer.js](https://github.com/immerjs/immer)
    - for creating selectors with [reselect](https://github.com/reduxjs/reselect)
    - ...and others

## Redux vs Rematch

|                           | Redux  | Rematch      |
| :------------------------ | :----: | :----------: |
| simple setup ‎            |        | ‎✔           |
| less boilerplate          |        | ‎✔           |
| readability               |        | ‎✔           |
| configurable              | ‎   ✔  | ‎✔           |
| redux devtools            |   ‎✔   |       ‎✔     |
| generated action creators | ‎      |       ‎✔     |
| async                     | thunks | ‎async/await |

## How to start
[Learn how to integrate easily on Javascript or Typescript (React, Vue...)](quick-start.md)

## Migrate From Redux

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. See the [migration reference](migration-guide.md) for the details.

## Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. As a result, developers can make complex custom plugins that modify the setup or add data models, often without requiring any changes to Rematch itself. See the [plugins](plugins/summary.md) developed by the Rematch team or the [API for creating plugins](api/plugins.md#plugins-api).


## All plugins


|           name            |   next version  | stable version |
| :------------------------ | :----: | :-----: |
|  ‎         core                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/core/next?style=flat-square)    |      ![npm_tag](https://img.shields.io/npm/v/@rematch/core?style=flat-square)    |
|  ‎         loading                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/loading/next?style=flat-square)    |    ![npm_tag](https://img.shields.io/npm/v/@rematch/loading?style=flat-square)    |
|  ‎         persist                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/persist/next?style=flat-square)    |    ![npm_tag](https://img.shields.io/npm/v/@rematch/persist?style=flat-square)    |
|  ‎         select                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/select/next?style=flat-square)    |    ![npm_tag](https://img.shields.io/npm/v/@rematch/select?style=flat-square)    |
|  ‎         updated                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/updated/next?style=flat-square)    |    ![npm_tag](https://img.shields.io/npm/v/@rematch/updated?style=flat-square)    |
|  ‎         immer                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/immer/next?style=flat-square)    |    ![npm_tag](https://img.shields.io/npm/v/@rematch/immer?style=flat-square)    |

### Deprecated
|           name            |   version  |
| :------------------------ | :----: |
|  ‎         typed-state                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/typed-state?style=flat-square)    |
|  ‎         react-navigation                |    ![npm_tag](https://img.shields.io/npm/v/@rematch/react-navigation?style=flat-square)    |

## Contact & Support

- Create a [GitHub issue](https://github.com/rematch/rematch/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/rematch/rematch) to support the project!

## License

This project is licensed under the [MIT license](https://github.com/rematch/rematch/blob/master/LICENSE).

<!-- GitHub Buttons -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
