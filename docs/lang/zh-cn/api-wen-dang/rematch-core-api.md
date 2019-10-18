# @rematch/core API

```javascript
import { init, dispatch, getState } from '@rematch/core'
```

### init

`init(config)`

该函数被调用去设置 Rematch。返回`store`。

```javascript
import { init } from '@rematch/core'

const store = init()
```

Init 也可以通过下面的配置选项来调用。

#### models

`init({ models: { [string]: model } })`

```javascript
import { init } from '@rematch/core'

const count = {
	state: 0,
}

init({
	models: {
		count,
	},
})
```

对于较小的项目，建议你保存 model 在一个“models.js”文件中并且命名导出他们。

```javascript
export const count = {
	state: 0,
}
```

对于较大的项目，建议你保存 model 在一个“models”文件夹中并且导出他们。

```javascript
// models/count.js
export default {
	state: 0,
}
```

```javascript
// models/index.js
export { default as count } from './count'
export { default as settings } from './settings'
```

这些可以使用`* as alias`语法导入。

```javascript
import { init } from '@rematch/core'
import * as models from './models'

init({ models })
```

**state**

`state: any` Required

该 model 的初始 state

```javascript
const example = {
	state: { loading: false },
}
```

**reducers**

`reducers: { [string]: (state, payload) => any }`

一个改变该 model state 的所有函数的对象。这些函数采用 model 的上一次 state 和一个 payload 作为形参，并且返回 model 的下一个装态。这些应该是仅依赖于 state 和 payload 参数来计算下一个 state 的纯函数。对于依赖“outside world”的代码（不纯的函数，如 API 调用等）的代码，请使用 effects。

```javascript
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

通过列出'model 名字' + 'action 名字'来作为 key，Reducers 也可以监听来自于其它 model 的 action。

```javascript
{
  reducers: {
    'otherModel/actionName': (state, payload) => state + payload,
  }
}
```

**effects**

`effects: { [string]: (payload, rootState) }`

一个可以处理该 model world outside 功能（所有函数）的对象。

```javascript
{
  effects: {
    logState(payload, rootState) {
      console.log(rootState)
    }
  }
}
```

当与`async/await`一起使用时，Effects 提供了一种处理异步 action 的简单方法。

```javascript
{
  effects: {
    async loadData(payload, rootState) {
      // wait for data to load
      const response = await fetch('http://example.com/data')
      const data = await response.json()
      // pass the result to a local reducer
      dispatch.example.update(data)
    }
  }
}
```

#### plugins {#plugins}

```text
init({
  plugins: [loadingPlugin, persistPlugin],
})
```

Plugins 用来自定义 init 配置或内部 hooks，它能添加功能到你的 Rematch 设置当中来。

阅读更多关于现有的插件或关于如何使用 plugins API 创建你自己的插件。

#### redux

```javascript
init({
  redux: {
    middlewares: [reduxLogger],
    reducers: {
      someReducer: (state, action) => ...,
    }
  },
})
```

有些情况下您可能想要直接访问 Redux。 您可能想要：

- 迁移现有的 Redux 项目
- 添加中间件
- 创建一个自定义插件

有关所有 redux 选项的完整摘要，请参阅[init Redux API](https://rematch.gitbooks.io/rematch/docs/reduxApi.html)。

### store

#### store.dispatch

在 Redux 中，一个分派 action 的函数。

在 Rematch 中，`store.dispatch`能被直接调用或者作为一个对象。

```javascript
import store from './index'

const { dispatch } = store
// state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1) // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1) // state = { count: 4 } after delay
```

#### store.getState

在 Redux 中，返回该 store 的 state。

#### store.name

为您的 store 提供一个名称。

当使用多个 store 时使用它。当全局`getState`被调用时这个名字将变成 key。

#### store.model

在调用`init`之后，可以延迟加载 model 并将它们合并到 Rematch 中。 使用`store.model`。

```javascript
import { init } from '@rematch/core'

const store = init({
	models: {
		count: { state: 0 },
	},
})

store.getState()
// { count: 0 }

// later on
store.model({ name: 'countB', state: 99 })

store.getState()
// { count: 0, countB: state: 99 }
```

### dispatch

`dispatch(action, meta)`

在**所有 store 中**，Dispatch 发送并触发 action。

`dispatch.modelName.actionName(any)`

在 Rematch 中，使用上面的简写更常见，它将为您创建和构造一个 action。

Dispatch 可以在应用程序中的任何地方被调用，但建议使用`store.dispatch`代替。

```javascript
import { dispatch } from '@rematch/core'

dispatch.cart.addToCart(item)
```

Dispatch 具有可选的第二个属性“meta”，它可以用于 subscriptions 或 middleware。 这仅适用于高级用例。

`dispatch.cart.addToCart(item, { syncWithServer: true })`

#### action

`{ type: 'modelName/actionName', payload: any }`

Action 是在 Redux 中发送的消息，作为应用程序的不同部分传递状态更新的一种方式。

在 Rematch 中，一个 action 始终是一个“model 名称”和“action 名称”类型的结构 - 指的是一个 reducer 或 effect 名称。

任何附加到 action 的数据都会添加到 payload 中。

### getState

`getState(): { [storeName]: state }`

返回一个包含所有 store state 的对象。

```javascript
import { init, getState } from '@rematch/core'

const firstStore = init({
	name: 'first',
	models: { count: { state: 0 } },
})

const secondStore = init({
	name: 'second',
	models: { count: { state: 5 } },
})

getState() // { first: { count: 1 }, second: { count: 5 } }
```
