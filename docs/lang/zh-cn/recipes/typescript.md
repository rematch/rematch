# TypeScript

## Examples

- [Counter](https://github.com/rematch/rematch/tree/master/examples/ts/count/)

## Changes

Rematch 能与 Typescript 一起工作，使用如下更改：

### Setup Store

```typescript
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import models from './models'

export const store = init({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<typeof models>
export type iRootState = RematchRootState<typeof models>
```

### Autocomplete Dispatch/Models

为了确保类型自动推导生效, 需要使用 `Model` . 请看下面的例子:

```typescript
import { Model } from '@rematch/core'

import { delay } from '../helpers'

export type SharksState = number

export const sharks: Model<SharksState> = {
	state: 0,
	reducers: {
		increment: (state: SharksState, payload: number): SharksState =>
			state + payload,
	},
	effects: (dispatch: Dispatch) => ({
		async incrementAsync(payload: number = 1) {
			await delay(500)
			dispatch.sharks.increment(payload)
		},
	}),
}
```

### Connect

导入您的 store 类型并使用他们来自动推导推断 connectedProps.

```typescript
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
// to include additional typings
// use `type Props = connectedProps & { ...additionalTypings }

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

export default connect(mapState, mapDispatch)(Count)
```

### Select Plugin

> select 插件仍然存在一些问题. 随时欢迎您的帮助

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

### 确保 `Redux@3.x` 不是一个依赖项.

Rematch 依赖于`Redux@4.x`, 是一个 Redux 的分支，它依靠泛型清理了大量复杂的类型.

由于 Redux 是 Rematch 的一个依赖项， 您可能需要删除 `package.json` 中对 Redux 的任何引用，然后重新安装模块.
