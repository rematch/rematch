# Immer Plugin

Immer plugin for Rematch. Wraps your reducers with immer, providing ability to safely do mutable changes resulting in immutable state.

## Compatibility {docsify-ignore}

Install the correct version of immer plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/immer  |
| :--------------------: | :----: |
| 0.x ‎                   |   0.1.0  |
| 1.x                    |    1.x   |
| 2.x                    |    2.x   |

## Install {docsify-ignore}

```bash
npm install @rematch/immer
```

## immerPlugin([config]) {docsify-ignore}

Immer plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`whitelist`] (*string[]*): an array of models' names. Allows defining on a model level, which reducers should be wrapped with immer.
- [`blacklist`] (*string[]*): an array of models' names. Allows defining on a model level, which reducers should **not** be wrapped with immer.

If config isn't provided, reducers from all models will be wrapped with immer.

## Usage {docsify-ignore}

In Immer, reducers can perform mutations to achieve the next immutable state. **Immer doesn't require that you return the next state from a reducer, but @rematch/immer plugin expects you to do it!** Your reducers must always return the next state. Otherwise, you will reset your model's state. See the example below for details.

If your state is a primitive value like a number of a string, plugin automatically avoids using immer to execute the reducer, because immer can only recognize changes to the plain objects or arrays.

**store.js**

```javascript
import immerPlugin from '@rematch/immer'
import { init } from '@rematch/core'
import * as models from './models'

init({
    models,
    // add immerPlugin to your store
	plugins: [immerPlugin()],
})
```

**models.js**

```javascript
export const todo = {
	state: [
		{
			todo: 'Learn typescript',
			done: true,
		},
		{
			todo: 'Try immer',
			done: false,
		},
	],
	reducers: {
		done(state) {
            // mutable changes to the state
			state.push({ todo: 'Tweet about it' })
			state[1].done = true
			return state
		},
        // when 'reset' reducer is executed, the state will be set
        // to 'undefined' because reducer doesn't return the next state
        reset(state) {
           state[0].done = false
        },
	},
}
```
