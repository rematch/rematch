# Updated Plugin

Rematch plugin for maintaining timestamps when an effect is triggered.

Updated is primarily used for optimizing effects. It can be used to:

- prevent expensive fetch requests within a certain time period
- throttle effects

## Compatibility {docsify-ignore}

Install the correct version of the updated plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/updated  |
| :--------------------: | :----: |
| 0.x ‎                   |   0.1.5  |
| 1.x                    |    1.x   |
| 2.x                    |    2.x   |

## Install {docsify-ignore}

```bash
npm install @rematch/updated@next
```

or

```bash
yarn add @rematch/updated@next
```

## updatedPlugin([config]) {docsify-ignore}

The updated plugin accepts one optional argument - **config**, which is an object with the following properties:

- `name` (_string_): the key for the updated state. Default value is `updated`.

- `blacklist` (_string[]_): list of blacklisted **model** names, for which the plugin will not track effects

- `dateCreator` (_() => any_): by default it's a function which returns new Date object when an effect is called. However, if you prefer to use moment or any other custom library, you can provide a custom implementation, such as `() => moment()`.

## Usage {docsify-ignore}

Let’s say we have a model ‘count’ in our store which has two effects - _fetchOne_ and _fetchTwo_. Updated plugin’s state will have the following format:

```javascript
{
  count: {
    fetchOne, // Date when fetchOne effect was last fetched
    fetchTwo, // Date when fetchTwo effect was last fetched
  }
}
```

To use the plugin, start with adding it to your store:

**store.js**

```javascript
import updatedPlugin from '@rematch/updated'
import { init } from '@rematch/core'
import * as models from './models'

init({
    models,
    // add updatedPlugin to your store
	plugins: [updatedPlugin()],
})
```

**models.js**

Define a model which uses effects.

```javascript
export const count = {
	...,
    effects: {
      async fetchOne() {},
      async fetchTwo() {},
    }
}
```

Use the updated state:

```javascript
const state = store.getState()

console.log(state.updated.count.fetchOne)
console.log(state.updated.count.fetchTwo)
```
