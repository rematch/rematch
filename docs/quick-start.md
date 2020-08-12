# Quick Start

## Installation

Installation is as simple as running the npm command:

```bash
npm install @rematch/core@next
```
or

```bash
yarn add @rematch/core@next
```

If you want to update all your @rematch packages to next features you can try:

```bash
npx update-by-scope -t next @rematch
```

## Basic usage

### Step 1: Define models

**Model** brings together state, reducers, async actions in one place. It describes a slice of your redux store and how it changes.

Understanding configuration of models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle async actions? **effects** with async/await

Below we define a simple model `count`.

<!-- tabs:start -->

#### ** JavaScript **

**models.js**

```javascript
export const count = {
	state: 0, // initial state
	reducers: {
		// handle state changes with pure functions
		increment(state, payload) {
			return state + payload
		},
	},
	effects: dispatch => ({
		// handle state changes with impure functions.
		// use async/await for async actions
		async incrementAsync(payload, rootState) {
			await new Promise(resolve => setTimeout(resolve, 1000))
			dispatch.count.increment(payload)
		},
	}),
}
```

#### ** TypeScript **

**count.ts**

Use helper method `createModel` to create a model.
Unfortunately, creating the effects is not as 'clean' as we would like it to be. Due to some TypeScript limitations, you need to cast the `dispatch` method and `rootState` to get their correct types. See the example below on how to do that.

```typescript
import { createModel } from '@rematch/core'
import { Dispatch, RootState } from './store'

type CountState = number

// Explicit typing of the initial state is required. Note that it can be ommitted in this case because \
// 0 is inferred as number which is the exact state type. But for complex states, this won't work.
const initialState : CountState = 0
export const count = createModel<CountState>()({
	state: 0, // initial state
	reducers: {
		// handle state changes with pure functions
		// Don't forget to type your payload to get types in other places of your code.
		increment(state, payload: number) {
			return state + payload
		},
	},
	effects: (dispatch) => ({
		// handle state changes with impure functions.
		// use async/await for async actions
		async incrementAsync(payload: number, rootState) {
            const typedDispatch = dispatch as Dispatch
            const typedState = rootState as RootState

            console.log('This is current root state', typedState);
			await new Promise(resolve => setTimeout(resolve, 1000))
			typedDispatch.count.increment(payload)
		},
	}),
});
```

**models.ts**

```typescript
import { Models } from '@rematch/core'
import { count } from './count'

export interface RootModel extends Models {
	count: typeof count
}

export const models: RootModel = { count }
```

<!-- tabs:end -->

### Step 2: Init store

**init** is the only method you need to call to build a fully configured Redux store. You can visit [api reference](api.md) to learn more about all configuration parameters that can be used but as a bare minimum it is enough to provide `models` object. It should contain mapping from a model name to model definition (created in step 1).

<!-- tabs:start -->

#### ** JavaScript **

**store.js**

```javascript
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
	models,
})

export default store
```

#### ** TypeScript **

**store.ts**

```typescript
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'

export const store = init({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
```

<!-- tabs:end -->

### Step 3: Dispatch actions

With **dispatch** you can trigger reducers & effects in your models. Dispatch standardizes your actions without the need for writing action types or action creators. Dispatch can be called directly, just like with plain Redux, or with the `dispatch[model][action](payload)` shorthand.

```javascript
const { dispatch } = store
// state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1) // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1) // state = { count: 4 } after delay
```

### Step 4: View

Rematch can be used with native redux integrations such as "react-redux". See an example below.

<!-- tabs:start -->

#### ** JavaScript **

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import store from './store'

const Count = (props) => (
	<div>
		The count is {props.count}
		<button onClick={props.increment}>increment</button>
		<button onClick={props.incrementAsync}>incrementAsync</button>
	</div>
)

const mapState = (state) => ({
	count: state.count,
})

const mapDispatch = (dispatch) => ({
	increment: () => dispatch.count.increment(1),
	incrementAsync: () => dispatch.count.incrementAsync(1),
})

const CountContainer = connect(
	mapState,
	mapDispatch
)(Count)

ReactDOM.render(
	<Provider store={store}>
		<CountContainer />
	</Provider>,
	document.getElementById('root')
)
```

#### ** TypeScript **

```tsx
import * as React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from './store'

const mapState = (state: RootState) => ({
	count: state.count,
})

const mapDispatch = (dispatch: Dispatch) => ({
	increment: () => dispatch.count.increment(1),
    incrementAsync: () => dispatch.count.incrementAsync(1),
})

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

class Count extends React.Component<Props> {
	render() {
		return (
			<div>
                The count is {props.count}
                <button onClick={props.increment}>increment</button>
                <button onClick={props.incrementAsync}>incrementAsync</button>
            </div>
		)
	}
}

const CountContainer = connect(
	mapState,
	mapDispatch
)(Count)

ReactDOM.render(
	<Provider store={store}>
		<CountContainer />
	</Provider>,
	document.getElementById('root')
)
```

You might need to 'patch' Redux types to avoid having issues with libraries such as `react-redux`. If Rematch doesn't work out of the box with your library of choice, add a file **redux.d.ts** to your project, with the following content:

```typescript
import { Action, AnyAction } from 'redux'

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
        // list all your models names here
		count: any // we have one model - count, so we added it
	}
}
```

Don't forget to include this file in your TypeScript config in ```compilerOptions.types``` array. Check out the [example](https://github.com/rematch/rematch/examples/count-react-ts) in Rematch repository.
<!-- tabs:end -->
