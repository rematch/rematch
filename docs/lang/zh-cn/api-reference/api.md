# @rematch/core API

- [init](#init)
  - [models](#models)
    - [state](#state)
    - [reducers](#reducers)
    - [effects](#effects)
    - [basereducer](#basereducer)
  - [plugins](#plugins)
  - [redux](#redux)
- [store](#store)
  - [dispatch](#storedispatch)
  - [getState](#storegetstate)
  - [name](#storename)
  - [model](#storemodel)
- [action](#action)

## init

`init(config)`

调用此函数初始化 rematch ,函数返回 `store`.

```javascript
import { init } from '@rematch/core'

const store = init()
```

init 函数也可以通过下面的方法传入参数进行调用。

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

`state: any` 必须

model 的初始 state

```javascript
const example = {
	state: { loading: false },
}
```

**reducers**

`reducers: { [string]: (state, payload) => any }`

一个改变该 model state 的函数的对象。这些函数接收 model 的上一次 state 和一个 payload 作为参数，并且返回 model 的新的 state。这些函数应该是仅依赖于 state 和 payload 参数来计算新的 state 的纯函数。对于依赖“outside world”的代码（不纯的函数，如 API 调用等）的代码，请使用 effects](#effects)

```javascript
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

通过'model 名称' + 'action 名称'来作为 key，Reducers 也可以监听来自于其它 model 的 action。

```javascript
{
  reducers: {
    'otherModel/actionName': (state, payload) => state + payload,
  }
}
```

**effects**

`effects: { [string]: (payload, rootState) }`

一个可以处理这个 model world outside(有副作用的函数例如 API 调用)的对象。

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
      this.update(data)
    }
  },
  reducers: {
    update(prev, data) {
      return {...prev, ...data}
    }
  }
}
```

`effects` 也可以被当做一个工厂函数. 这种方法提供了 Dispatch 其他 model actions 的能力.

```javascript
{
	effects: dispatch => ({
		async loadData(payload, rootState) {
			// wait for data to load
			const response = await fetch('http://example.com/data')
			const data = await response.json()
			// pass the result to a external model reducer
			dispatch.other.update(data)
		},
	})
}
```

`effects` 如果与 reducer 拥有同名函数将在 reducer 之后被调用

```js
{
  effects: {
    // 这将运行在 reducer "update" 函数执行完毕之后
    update(payload, rootState) {
      console.log('update reducer was called with payload: ', payload);
    }
  },
  reducers: {
    update(prev, data) {
      return {...prev, ...data}
    }
  }
}
```

#### baseReducer

`baseReducer: (state, action) => state`

一个运行在 `reducers` 之前运行的 reducer。这个函数将获得上一个 state 和 actions, 然后返回值将会被 `reducers` 所使用.

这对于结构化的方式将 redux 库添加到您的 store 中非常有用详见 [redux plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/recipes/redux.md)


### plugins

```javascript
init({
	plugins: [loadingPlugin, persistPlugin],
})
```

Plugins 用来自定义 init 配置或内部 hooks，它能添加功能到你的 Rematch 设置中。

阅读现有 [plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/plugins.md) 或如何创建自己的插件的更多信息 [plugins API](pluginsapi.md).

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

有关所有 redux 选项的完整摘要，请参阅[init Redux API](./lang/zh-cn/api-reference/reduxapi.md).。

### store

#### store.dispatch

在 Redux 中，一个 dispatch [action](#action) 的函数。

在 Rematch 中，`store.dispatch` 能被直接调用或者作为一个对象。

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

Dispatch 有第二个可选参数 "meta", 可以用于订阅或者中间件. 这仅适用于高级用例.

`dispatch.count.increment(2, { syncWithServer: true })`


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

#### action

`{ type: 'modelName/actionName', payload: any }`

Action 是在 Redux 中发送的消息是应用程序的不同部分传递状态更新的一种方式。

在 Rematch 中，一个 action 始终是一个“model 名称”和“action 名称”类型的结构 - 指的是一个 reducer 或 effect 名称。

任何附加到 action 的数据都会添加到 payload 中。

