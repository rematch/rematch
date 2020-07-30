# Rematch

[![Chat on slack](https://img.shields.io/badge/slack-rematchjs-blue.svg?logo=slack&style=flat)](https://rematchjs.slack.com) [![Build Status](https://travis-ci.org/rematch/rematch.svg?branch=master)](https://travis-ci.org/rematch/rematch) [![Coverage Status](https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master)](https://coveralls.io/github/rematch/rematch?branch=master) [![Npm version](https://img.shields.io/npm/v/@rematch/core?color=bright-green&style=flat)](https://badge.fury.io/js/%40rematch%2Fcore) [![Bundle size](https://img.shields.io/badge/bundlesize-~2.2kb-brightgreen.svg?style=flat)](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat) [![File size](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat)](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

> Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

Check out the website for the full documentation: https://rematch.github.io/rematch

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

## Migrate From Redux

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. See the [migration reference](https://rematch.github.io/rematch/#/migration-guide.md) for the details.

## Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. As a result, developers can make complex custom plugins that modify the setup or add data models, often without requiring any changes to Rematch itself. See the [plugins](https://rematch.github.io/rematch/#/plugins/summary?id=plugins-summary) developed by the Rematch team or the [API for creating plugins](https://rematch.github.io/rematch/#/api/plugins?id=plugins-api).


## Contact & Support

- Create a [GitHub issue](https://github.com/rematch/rematch/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/rematch/rematch) to support the project!

## License

This project is licensed under the [MIT license](https://github.com/rematch/rematch/blob/master/LICENSE).

<!-- GitHub Buttons -->
<script async defer src="https://buttons.github.io/buttons.js"></script>
