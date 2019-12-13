# 快速开始

![](_media/icon.svg)

[![Chat on slack](https://img.shields.io/badge/slack-rematchjs-blue.svg?logo=slack&style=flat)](https://rematchjs.slack.com)[![Build Status](https://travis-ci.org/rematch/rematch.svg?branch=master)](https://travis-ci.org/rematch/rematch)[![Coverage Status](https://coveralls.io/repos/github/rematch/rematch/badge.svg?branch=master)](https://coveralls.io/github/rematch/rematch?branch=master)[![Npm version](https://img.shields.io/npm/v/@rematch/core?color=bright-green&style=flat)](https://badge.fury.io/js/%40rematch%2Fcore)[![Bundle size](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat)](https://img.shields.io/badge/bundlesize-~5kb-brightgreen.svg?style=flat)[![File size](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat)](https://img.shields.io/badge/dependencies-redux-brightgreen.svg?style=flat)[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Rematch

### Rethink Redux.

Rematch 是没有样板文件的 Redux 最佳实践。没有 action tyoes 、action creators、switch 或 thunks

- [为什么我们创建 Rematch](https://hackernoon.com/redesigning-redux-b2baee8b8a38)
- [Video: Rematch 介绍](https://www.youtube.com/watch?v=3ezSBYoL5do)
- [Redux 与 Rematch 的比较](https://rematch.gitbook.io/handbook/mu-de)

### 索引

- 快速开始
- 目的
- 例子
- 迁移指南
- API 参考
  - 核心 API
  - 初始 Redux API
  - 插件 API
- 技巧
  - Devtools
  - React
  - Vue
  - Testing
  - TypeScript
  - Immer
  - Decoupling reducers
- 插件
  - Selectors
  - Loading
  - Persist
  - Updated
  - React Navigation
  - Immer
- 灵感

### 快速开始

```bash
npm install @rematch/core
```

#### 第一步：Init

**init** 用来配置你的 reducers, devtools & store。

index.js

```javascript
import { init } from '@rematch/core'
import * as models from './models'

const store = init({
	models,
})

export default store
```

_对于更高级的设置，查看_[_插件_](https://rematch.gitbooks.io/rematch/docs/plugins.md)_和_[_Redux 配置选项_](https://rematch.gitbook.io/handbook/~/edit/primary/api-wen-dang/init-redux-api)_。_

#### 第二步：Models

model 使 state， reducers， async actions 和 action creators 集中在一起。

models.js

```javascript
export const count = {
	state: 0, // initial state
	reducers: {
		// handle state changes with pure functions
		increment(state, payload) {
			return state + payload
		},
	},
	effects: {
		// handle state changes with impure functions.
		// use async/await for async actions
		async incrementAsync(payload, rootState) {
			await new Promise(resolve => setTimeout(resolve, 1000))
			this.increment(payload)
		},
	},
}
```

_查看_[_reducer 文档_](https://github.com/rematch/rematch/blob/master/docs/api.md#reducers)_以了解更多信息，包括如何从其他 modal 触发 actions。_

理解 models 就像回答几个问题一样简单：

1. 我初始 state 是什么? **state**
2. 我应该如何改变 state？ **reducers**
3. 我应该如何处理异步 action？ **effects** 和 async/await

#### Step 3: Dispatch

**dispatch** 是我们触发您 model 中 reducers 和 effects 的方法。 Dispatch 标准化了你的 action，而无需编写 action types 或者 action creators。

```javascript
import { dispatch } from '@rematch/core'

// state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1) // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1) // state = { count: 4 } after delay
```

Dispatch 能被直接调用，或者使用 `dispatch\[model\]\[action\]\(payload\)`简化调用。

#### Step 4: View

- Count: [JS](https://codepen.io/Sh_McK/pen/BJMmXx?editors=1010) \| [React](https://codesandbox.io/s/3kpyz2nnz6)\| [Vue](https://codesandbox.io/s/n3373olqo0) \| [Angular](https://stackblitz.com/edit/rematch-angular-5-count)
- Todos: [React](https://codesandbox.io/s/92mk9n6vww)

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, connect } from 'react-redux'
import store from './index'

const Count = props => (
	<div>
		The count is {props.count}
		<button onClick={props.increment}>increment</button>
		<button onClick={props.incrementAsync}>incrementAsync</button>
	</div>
)

const mapState = state => ({
	count: state.count,
})

const mapDispatch = ({ count: { increment, incrementAsync } }) => ({
	increment: () => increment(1),
	incrementAsync: () => incrementAsync(1),
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

### 从 Redux 迁移

从 Redux 转到 Rematch 几步。

1. 设置 Rematch init 初始化 Redux  [step 1](https://codesandbox.io/s/yw2wy1q929)
2. 合并 reducers 和 models [step 2](https://codesandbox.io/s/9yk6rjok1r)
3. 迁移到 models [step 3](https://codesandbox.io/s/mym2x8m7v9)

### API

详见 [@rematch/core API](https://rematch.gitbooks.io/rematch/docs/api.html)

### 更新日志

查看 [CHANGELOG](https://github.com/rematch/rematch/blob/master/CHANGELOG.md) 获取更新详情.

喜欢这个项目? 请在 GitHub 为我们点亮 ★  :\)
