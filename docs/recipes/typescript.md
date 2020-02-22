# TypeScript

## Examples

- [Counter](https://github.com/rematch/rematch/tree/master/examples/ts/count/)

## Changes

Rematch can work with TypeScript with the following changes:

### Setup Store

```typescript
import { init, RematchRootState, RematchDispatch } from '@rematch/core'
import { models, RootModel } from './models'

export const store = init({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type iRootState = RematchRootState<RootModel>
```

### Autocomplete Dispatch/Models

Autocomplete works without any special changes. See example below:

```typescript
import { Dispatch } from '../store'
import { delay } from '../helpers'

export type SharksState = number

export const sharks = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(payload: number = 1) {
			await delay(500)
			dispatch.sharks.increment(payload)
            // `dispatch.s` will suggest `sharks`
		},
	}),
}
```

### Connect

import your store typings and use them to infer connectedProps.

```typescript jsx
import * as React from 'react'
import { connect } from 'react-redux'

import { iRootState, Dispatch } from './store'

const mapState = (state: iRootState) => ({
	dolphins: state.dolphins,
	sharks: state.sharks,
})

const mapDispatch = (dispatch: Dispatch) => ({
	incrementDolphins: dispatch.dolphins.increment,
	incrementDolphinsAsync: dispatch.dolphins.incrementAsync,
	incrementSharks: () => dispatch.sharks.increment(1),
	incrementSharksAsync: () => dispatch.sharks.incrementAsync(1),
	incrementSharksAsync2: () =>
		dispatch({ type: 'sharks/incrementAsync', payload: 2 }),
})

type connectedProps = ReturnType<typeof mapState> &
	ReturnType<typeof mapDispatch>
type Props = connectedProps

class Count extends React.Component<Props> {
	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: 120 }}>
					<h3>Dolphins</h3>
					<h1>{this.props.dolphins}</h1>
					<button onClick={this.props.incrementDolphins}>+1</button>
					<button onClick={this.props.incrementDolphinsAsync}>Async +1</button>
				</div>
				<div style={{ width: 200 }}>
					<h3>Sharks</h3>
					<h1>{this.props.sharks}</h1>
					<button onClick={this.props.incrementSharks}>+1</button>
					<button onClick={this.props.incrementSharksAsync}>Async +1</button>
					<button onClick={this.props.incrementSharksAsync2}>Async +2</button>
				</div>
				<p>Using Rematch Models</p>
			</div>
		)
	}
}

export default connect(
	mapState,
	mapDispatch
)(Count)
```

### Select Plugin

> There remain some TS compatability issues with the select plugin. Help is always welcome

You can see a real example of this code in `examples/cart`

```typescript
import { init } from '@rematch/core'
import selectPlugin from '@rematch/select'
import * as models from './models'

export const store = init({
	models,
	plugins: [selectPlugin()],
})
```

## Dependencies

### Ensure `Redux@3.x` is not a dependency.

Rematch relies on `Redux@4.x`, a branch of Redux with cleaned up a lot of complex typings relying on generics.

As Redux is a dependency of Rematch, you may just need to remove any references to Redux in your `package.json` and reinstall modules.
