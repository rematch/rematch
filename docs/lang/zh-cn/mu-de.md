# 目的

Redux 是一个出色的状态管理工具，有健全的中间件生态与出色的开发工具。

Rematch 在 Redux 的基础上构建并减少了样板代码和执行了一些最佳实践。

说得清楚点，Rematch 移除了 Redux 所需要的这些东西：

* 声明 action 类型
* action 创建函数
* thunks
* store 配置
* mapDispatchToProps
* sagas

### Redux 与 Rematch 的对比

让 Redux 与Rematch 作对比有助于让理解更加清晰。

#### Rematch

1. model

```javascript
import { init } from '@rematch/core'

const count = {
  state: 0,
  reducers: {
    upBy: (state, payload) => state + payload
  }
}

init({
  models: { count }
})
```

2. View

```javascript
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count
})

const mapDispatchToProps = (dispatch) => ({
  countUpBy: dispatch.count.upBy
})

connect(mapStateToProps, mapDispatchToProps)(Component)
```

#### Redux （最佳实践）

1. store

```javascript
import { createStore, combineReducers } from 'redux'
// devtools, reducers, middleware, etc.
export default createStore(reducers, initialState, enhancers)
```

2. Action Type

```javascript
export const COUNT_UP_BY = 'COUNT_UP_BY'
```

3. Action Creator

```javascript
import { COUNT_UP_BY } from '../types/counter'

export const countUpBy = (value) => ({
  type: COUNT_UP_BY,
  payload: value,
})
```

4. Reducer

```javascript
import { COUNT_UP_BY } from '../types/counter'

const initialState = 0

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNT_UP_BY:
      return state + action.payload
    default: return state
  }
}
```

5. view

```javascript
import { countUpBy } from '../actions/count'
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count,
})

connect(mapStateToProps, { countUpBy })(Component)
```

#### 分数板

|  | Redux | Rematch |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 简易设置 |  | √ |
| 更少的样板代码 |  | √ |
| 可读性 | √ | √ |
| 可配置 | √ | √ |
| redux 开发工具 | √ | √ |
| 产生 action 构造函数 | √ | √ |
| 全局分发器 \(dispatch\) |  | √ |
| 异步 | thunks | async/await |



