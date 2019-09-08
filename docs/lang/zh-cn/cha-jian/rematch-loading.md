# Rematch Loading

添加自动 loading 指示器 effects 到 [Rematch ](https://github.com/rematch/rematch)。灵感来自于 [dva-loading](https://github.com/dvajs/dva-loading)。

### 安装

```bash
npm install @rematch/loading
```

> 对于 @rematch/core@0.x 使用 @rematch/loading@0.5.0

### 示例

请参见下面的示例，使用一个按钮中的 loading 指示器。

```javascript
import React from 'react'
import { connect } from 'react-redux'
import AwesomeLoadingButton from './components/KindaCoolLoadingButton'

const LoginButton = (props) => (
  <AwesomeLoadingButton onClick={props.submit} loading={props.loading}>
    Login
  </AwesomeLoadingButton>
)

const mapState = (state) => ({
  loading: state.loading.effects.login.submit, // true when the `login/submit` effect is running
  // or
  loading: state.loading.models.login, // true when ANY effect on the `login` model is running
})

const mapDispatch = (dispatch) => ({
  submit: () => dispatch.login.submit()
})

export default connect(mapState, mapDispatch)(LoginButton)
```

### Demo

查看一个 [demo](https://github.com/rematch/rematch/tree/master/plugins/loading/examples/react-loading-example)

![](../../../media/icon.svg)

### 设置

配置 loading。

```javascript
import { init } from '@rematch/core'
import createLoadingPlugin from '@rematch/loading'

// see options API below
const options = {}

const loading = createLoadingPlugin(options)

init({
  plugins: [loading]
})
```

### Options

#### asNumber

```javascript
{ asNumber: true }
```

该 loading state 值 是一个“counter”，返回一个数字（例：`store.getState().loading.global === 5`）

缺省值是`false，`返回一个布尔值（例：`store.getState().loading.global === true`）

#### name

```javascript
{ name: 'load' }
```

在这种情况下，可以从`state.load.global`访问 loading 。

默认名称是`loading`（例：`state.loading.global`）

#### whitelist

一个 action 列表。命名使用“model名称” / “action名称”

```javascript
{ whitelist: ['count/addOne'] })
```

#### blacklist

一个 action 列表，不使用 loading  指示器。

```javascript
{ blacklist: ['count/addOne'] })
```

#### model

`{ model: {...} }`

包含在 loading model 中的 [model ](https://github.com/rematch/rematch/blob/master/docs/api.md#model)配置对象。 用户可以添加自定义的`name`，`reducer`和`state`配置以及`selectors`和其他插件提供的其他有效配置。

这个配置的一个优点是它提供了利用 [@rematch/select](https://github.com/rematch/rematch/blob/master/plugins/select/README.md) 插件的优势，并且添加自定义的`selectors`到你的loading model。例如：

```javascript
import createLoadingPlugin from '@rematch/loading'

// @rematch/selector plugin API
const options = {
  model: {
    selectors: {
      loggingIn(state) { return state.effects.login.submit }
    }
  }
}

const loading = createLoadingPlugin(options)
```

关于模型配置选项的一些注意事项：

* `name`配置将优先并覆盖`model.name`配置。
*  effects 配置\(`model.effects`\)没有经过测试。
*  reducers 配置\(`model.reducers`\)已经过测试，可用于添加 reducer。尽管如此，这个配置的一个例子还不清楚。任何`show`和`hide`reducer都将被插件覆盖。
* 除非你知道你在做什么，否则不建议提供`model.state`配置。 提供错误的配置可能会以意想不到的方式破坏插件。

#### mergeInitialState

`{ mergeInitialState: (state, newObject ) => any }`

通过将 loading model 与提供的对象合并来改变 model 的初始状态的函数。它接受当前的`state`作为第一个参数和要被合并的`newObject`作为第二个参数。 这个函数改变提供的`state`并且不返回一个新的 state 是很重要的。

通常，用户不应该设置此配置。 但是，如果用户未使用JavaScript对象作为store，则需要此配置。 例如，使用Immutable JS时将需要它。

#### loadingActionCreator

`{ loadingActionCreator: (state, name, action, converter, countState) => any }`

一个 reducer 函数，loading effect 被分发时返回新状态。它接受当前的`state`，被分发`model`的`name`（string），被分发的`action`（string），一个 `converter` 函数和当前的 `countState` 对象。

这是一个复杂的函数，最好接受默认值。 如果你想定制这个函数，看看 loading 插件源代码，以了解这个函数应该如何工作。 这个配置是公开的，所以用户可以使用不是JavaScript对象的store（例如Immutable JS）。

### Immutable JS 示例

用户可以通过插件使用 [`Immutable.js`](https://facebook.github.io/immutable-js/) Map。为此，需要设置 `mergeInitialState`，`loadingActionCreator`和`model.state`配置。这是一个简单的例子：

```javascript
import createLoadingPlugin from '@rematch/loading'
import { fromJS } from 'immutable';

// Immutably returns the new state
const immutableLoadingActionCreator = (state, name, action, converter, cntState) => (
  state.asImmutable().withMutations( map => map.set('global', converter(cntState.global))
    .setIn(['models', name], converter(cntState.models[name]))
    .setIn(['effects',name, action], converter(cntState.effects[name][action]))
  )
)

// Mutates the current state with a deep merge
const immutableMergeInitialState = (state, newObj) => (
  state.asMutable().mergeDeep(fromJS(newObj))
)

const options = {
  loadingActionCreator: immutableLoadingActionCreator,
  mergeInitialState: immutableMergeInitialState,
  model: {
    state: fromJS({}),
  }
}

const loading = createLoadingPlugin(options);
```

上面的例子已经过测试，包含在这个包的测试套件中。

