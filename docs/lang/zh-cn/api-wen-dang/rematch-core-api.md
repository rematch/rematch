# @rematch/core API

```javascript
import { init, dispatch, getState } from '@rematch/core'
```

### init

`init(config)`

该函数被调用去设置Rematch。返回`store`。

```javascript
import { init } from '@rematch/core'

const store = init()
```

Init也可以通过下面的配置选项来调用。

#### models

`init({ models: { [string]: model } })`

```javascript
import { init } from '@rematch/core'

const count = {
  state: 0,
}

init({
  models: {
    count
  }
})
```

对于较小的项目，建议你保存model在一个“models.js”文件中并且命名导出他们。

```javascript
export const count = {
  state: 0,
}
```

对于较大的项目，建议你保存model在一个“models”文件夹中并且导出他们。

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

 该model的初始state

```javascript
const example = {
  state: { loading: false }
}
```

**reducers**

 `reducers: { [string]: (state, payload) => any }`

一个改变该model state的所有函数的对象。这些函数采用model的上一次state和一个payload作为形参，并且返回model的下一个装态。这些应该是仅依赖于state和payload参数来计算下一个state的纯函数。对于依赖“outside world”的代码（不纯的函数，如API调用等）的代码，请使用 effects。

```javascript
{
  reducers: {
    add: (state, payload) => state + payload,
  }
}
```

通过列出'model名字' + 'action名字'来作为key，Reducers也可以监听来自于其它model的action。

```javascript
{
  reducers: {
    'otherModel/actionName': (state, payload) => state + payload,
  }
}
```

**effects**

`effects: { [string]: (payload, rootState) }`

一个可以处理该model world outside功能（所有函数）的对象。

```javascript
{
  effects: {
    logState(payload, rootState) {
      console.log(rootState)
    }
  }
}
```

当与`async/await`一起使用时，Effects提供了一种处理异步action的简单方法。

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

Plugins 用来自定义init配置或内部hooks，它能添加功能到你的Rematch设置当中来。

阅读更多关于现有的插件或关于如何使用plugins API创建你自己的插件。

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

有些情况下您可能想要直接访问Redux。 您可能想要：

* 迁移现有的Redux项目
* 添加中间件
* 创建一个自定义插件

有关所有redux选项的完整摘要，请参阅[init Redux API](https://rematch.gitbooks.io/rematch/docs/reduxApi.html)。

### store

#### store.dispatch

在Redux中，一个分派action的函数。

在Rematch中，`store.dispatch`能被直接调用或者作为一个对象。

```javascript
import store from './index'

const { dispatch } = store
                                                  // state = { count: 0 }
// reducers
dispatch({ type: 'count/increment', payload: 1 }) // state = { count: 1 }
dispatch.count.increment(1)                       // state = { count: 2 }

// effects
dispatch({ type: 'count/incrementAsync', payload: 1 }) // state = { count: 3 } after delay
dispatch.count.incrementAsync(1)                       // state = { count: 4 } after delay
```

#### store.getState

在Redux中，返回该store的state。

#### store.name

为您的store提供一个名称。

当使用多个store时使用它。当全局`getState`被调用时这个名字将变成key。

#### store.model

在调用`init`之后，可以延迟加载model并将它们合并到Rematch中。 使用`store.model`。

```javascript
import { init } from '@rematch/core'

const store = init({
  models: {
    count: { state: 0 }
  }
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

在**所有store中**，Dispatch 发送并触发action。

`dispatch.modelName.actionName(any)`

在Rematch中，使用上面的简写更常见，它将为您创建和构造一个action。

 Dispatch 可以在应用程序中的任何地方被调用，但建议使用`store.dispatch`代替。

```javascript
import { dispatch } from '@rematch/core'

dispatch.cart.addToCart(item)
```

Dispatch具有可选的第二个属性“meta”，它可以用于 subscriptions 或 middleware。 这仅适用于高级用例。

`dispatch.cart.addToCart(item, { syncWithServer: true })`

#### action

`{ type: 'modelName/actionName', payload: any }`

Action是在Redux中发送的消息，作为应用程序的不同部分传递状态更新的一种方式。

在Rematch中，一个action始终是一个“model名称”和“action名称”类型的结构 - 指的是一个reducer或effect名称。

任何附加到action的数据都会添加到payload中。

### getState

`getState(): { [storeName]: state }`

返回一个包含所有store state的对象。

```javascript
import { init, getState } from '@rematch/core'

const firstStore = init({
  name: 'first',
  models: { count: { state: 0 } }
})

const secondStore = init({
  name: 'second',
  models: { count: { state: 5 } }
})

getState() // { first: { count: 1 }, second: { count: 5 } }
```

