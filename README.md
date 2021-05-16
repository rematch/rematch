<div align="center">
<h1>Rematch<sub>js</sub></h1>

Rematch is Redux best practices without the boilerplate. No more action types, action creators, switch statements or thunks in less than 1.4 kilobytes.

<hr />

[![Chat on Discord](https://img.shields.io/badge/discord-rematch-purple.svg?logo=discord&style=flat-square)](https://discord.gg/zMzsMGvEHk) ![Rematch CI](https://github.com/rematch/rematch/workflows/Rematch%20CI/badge.svg?branch=main) [![Bundle size](https://img.shields.io/bundlephobia/minzip/@rematch/core?style=flat-square)](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat-square) [![File size](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat-square)](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat-square) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lerna.js.org/) [![https://img.shields.io/lgtm/grade/javascript/github/rematch/rematch?logo=typescript](https://img.shields.io/lgtm/grade/javascript/github/rematch/rematch?logo=typescript)](https://lgtm.com/projects/g/rematch/rematch?mode=list)  [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/from-referrer/)


[**Documentation**](https://rematchjs.org)  · [**Quickstart**](https://rematchjs.org/docs/getting-started/installation) · [**Examples**](https://rematchjs.org/examples/) · [**Contribute**](./CONTRIBUTING.md) · [**Licence**](#licence)

</div>

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

## Are you ready to use Rematch?

In a few lines you can get easily asynchronous calls to an external API and data stored globally. It's amazing, with Redux you will needs tons of boilerplate, libraries and extra configuration.

```ts
type PlayersState = {
    players: PlayerModel[]
}

export const players = createModel<RootModel>()({
    state: {
        players: [],
    } as PlayersState,
    reducers: {
        SET_PLAYERS: (state: PlayersState, players: PlayerModel[]) => {
            return {
                ...state,
                players,
            }
        },
    },
    effects: (dispatch) => {
        const { players } = dispatch
        return {
            async getPlayers(): Promise<any> {
                let response = await fetch('https://www.balldontlie.io/api/v1/players')
                let { data }: { data: PlayerModel[] } = await response.json()
                players.SET_PLAYERS(data)
            },
        }
    },
})
```

Check it out, [right now!](https://rematchjs.org/)

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

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. See the [migration reference](https://rematchjs.org/docs/migrating-from-redux-to-rematch) for the details.

## Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. As a result, developers can make complex custom plugins that modify the setup or add data models, often without requiring any changes to Rematch itself. See the [plugins](https://rematchjs.org/docs/plugins) developed by the Rematch team or the [API for creating plugins](https://rematchjs.org/docs/api-reference/plugins).


## Contact & Support

- Create a [GitHub issue](https://github.com/rematch/rematch/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/rematch/rematch) to support the project!

### Contributors

Thank you to all the people who have already contributed to rematch!
<a href="https://github.com/rematch/rematch/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=rematch/rematch" />
</a>

Made with [contributors-img](https://contributors-img.web.app).

## Licence

This project is licensed under the [MIT license](https://github.com/rematch/rematch/blob/main/LICENSE).
