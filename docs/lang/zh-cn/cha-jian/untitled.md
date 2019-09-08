---
description: 给Rematch使用的selectors插件
---

# Rematch Select

### 安装

```bash
npm install @rematch/select
```

> 对于@rematch/core@0.x 使用 @rematch/select@0.3.0

### 设置

```javascript
import selectorsPlugin from '@rematch/select'
import { init } from '@rematch/core'

const select = selectorsPlugin()

init({
  plugins: [select]
})
```

### selectors

`selectors: { [string]: (state, ...params) => any }`

selectors是只读状态的片段。

```javascript
{
  name: 'cart',
  state: [{
    price: 42.00,
    amount: 3,
  }],
  selectors: {
    total(state) {
      return state.reduce((a, b) => a + (b.price * b.amount), 0)
    }
  }
}
```

> 注意：默认情况下，selector state不是指完整的state，而仅指model内的state。 要更改此行为，请使用下面描述的sliceState配置选项。

selector可以在应用程序的任何位置调用。

```javascript
import { select } from '@rematch/select'

const store = init({ ... })

select.cart.total(store.getState())
```

选择器也可以用于memoization库，如[reselect](https://github.com/reactjs/reselect)。

```javascript
import { createSelector } from 'reselect'

{
  selectors: {
    total: createSelector(
      state => state,
      state => state.reduce((a, b) => a + (b.price * b.amount), 0)
    )
  }
}
```

### 配置选项

`selectorPlugin()`方法将接受具有以下属性的配置对象。

#### sliceState:

`sliceState: (rootState, model) => any`

一个选项，允许用户指定state在传递给selector之前将如何切片。该函数将`rootState`作为第一个参数，并将selector对应的`model`作为第二个参数。它应该返回selector所需要的状态切片。

缺省情况是返回与拥有model名称相对应的state切片，但是这里假定store是一个Javascript对象。 大多数时候应该使用默认值。但是，有些情况下可能需要指定`sliceState`函数。

#### 示例1 -  在选择器中使用根 state 而不是切片：

这很容易通过在`getState`配置中返回`rootState`完成：

```javascript
const select = selectorsPlugin({ sliceState: rootState => rootState });
```

现在，传递给所有selector的`state`参数将成为 root state。

#### 示例1 -  使用不可变的 JS 对象作为store

如果你正在使用一个 [Immutable.js](https://facebook.github.io/immutable-js/) Map 作为你的 store，你将需要使用 [Map.get\(\)](http://facebook.github.io/immutable-js/docs/#/Map/get) 切片该 state ：

```javascript
const select = selectorsPlugin({ sliceState: (rootState, model) => rootState.get(model.name) })
```

现在你可以使用一个 [Immutable.js Map](http://facebook.github.io/immutable-js/docs/#/Map) 来作为你的 store 并且在每个你的 selector 中访问适当的 state 片段。





