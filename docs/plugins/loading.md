# Loading Plugin

The loading plugin for Rematch. Adds automated loading indicators for effects, so you don't need to manage state like `loading: true` by yourself. Inspired by [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading).

## Compatibility {docsify-ignore}

Install the correct version of loading plugin based on the version of the core Rematch library in your project.

|         @rematch/core  | @rematch/immer  |
| :--------------------: | :----: |
| 0.x ‎                   |   0.5.0  |
| 1.x                    |    1.x   |
| 2.x                    |    2.x   |

## Install {docsify-ignore}

```bash
npm install @rematch/loading
```

## loadingPlugin([config]) {docsify-ignore}

The loading plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`name`] (*string?*): key for the loading model in your store. If you name it "custom", loading state can be accessed from _state.custom_. **Defaults to _loading_**.
- [`asNumber`] (*boolean?*): loading plugin by default keeps track of running effects using booleans, so for example: _state.loading.global === true_. You can change that behaviour and use numbers instead - plugin will keep track of the number of times an effect was executed, for example: _state.loading.global === 5_. Defaults to _false_.
- [`whitelist`] (*string[]?*): an array of effects names that you want to use loading plugin for. If defined, plugin will work only for the whitelisted effects.
- [`blacklist`] (*string[]?*): an array of effects names that you **don't want** to use loading plugin for. If defined, plugin will work for all effects except those blacklisted.

Both `blacklist` and `whitelist` accept the "full" effect name, in a format `modelName/effectFunctionName`, for example _'count/addOne'_.

If both `blacklist` and `whitelist` aren't provided, plugin works for all effects.

## Usage {docsify-ignore}

Let's say we have a model 'count' in our store. Loading plugin's state will have the following format:

```javascript
{
	global, // true when any effect in any model is loading
    models: {
      count // true when any effect in 'count' model is loading
    },
    effects: {
      count: {
        addOne, // true when effect 'addOne' in model 'count' is loading
      },
    },
}
```

Check out below an example of how to use loading plugin in React:

**store.js**

Set up your store with default or custom settings.

```javascript
import loadingPlugin from '@rematch/loading'
import { init } from '@rematch/core'
import * as models from './models'

init({
    models,
    // add loadingPlugin to your store
	plugins: [loadingPlugin()],
})
```

**models.js**

Define a model which uses effects.

```javascript
export const auth = {
	state: {
	  user: null,
    },
    reducers: {
      setUser(state, user) {
        return {
          ...state,
           user,
        };
      },
    },
    effects: {
      async login() {
        const user = await api.login();
        this.setUser(user);
      }
    }
}
```

**view.js**

Use state created by the loading plugin in your view.

```javascript
import React from 'react'
import { connect } from 'react-redux'
import AwesomeLoadingButton from './AwesomeLoadingButton'

const LoginButton = props => (
	<AwesomeLoadingButton onClick={props.login} loading={props.isLoading}>
		Login
	</AwesomeLoadingButton>
)

const mapState = state => ({
	isLoading: state.loading.effects.auth.login, // true when the `auth/login` effect is running
	// or
	isLoading: state.loading.models.auth, // true when ANY effect on the `auth` model is running
})

const mapDispatch = dispatch => ({
	login: () => dispatch.auth.login(),
})

export default connect(
	mapState,
	mapDispatch
)(LoginButton)
```
