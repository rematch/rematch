---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---
> Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks.

## Features

Redux is an amazing state management tool, supported by a healthy middleware ecosystem and excellent devtools.
Rematch builds upon Redux by reducing boilerplate and enforcing best practices. It provides the following features:

- Less than 2kb of size
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
[Learn how to integrate easily on Javascript or Typescript (React, Vue...)](getting-started/installation)

## Migrate From Redux

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. See the [migration reference](migrating-from-redux-to-rematch) for the details.

## Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. As a result, developers can make complex custom plugins that modify the setup or add data models, often without requiring any changes to Rematch itself. See the [plugins](plugins) developed by the Rematch team or the [API for creating plugins](api-reference/plugins).


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

This project is licensed under the [MIT license](https://github.com/rematch/rematch/blob/main/LICENSE).