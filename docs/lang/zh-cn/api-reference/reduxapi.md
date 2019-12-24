# Init Redux API

> 除非您正在构建自己的插件或添加中间件，否则本节可能对您没有帮助。 有关常见 init 选项的列表，请参阅 @rematch / core API

> 如果你只是想添加 redux 库到你的 store 中, 请查阅 [redux plugins](https://github.com/rematch/rematch/tree/e4fe17537a947bbe8a9faf1e0e77099beb7fef91/docs/recipes/redux.md)

- init
  - [redux](#redux)
    - [initialState](#initialstate)
    - [reducers](#reducers)
    - [middlewares](#middlewares)
    - [enhancers](#enhancers)
    - [rootReducers](#rootreducers)
    - [combineReducers](#combinereducers)
    - [createStore](#createstore)
    - [devtoolOptions](#devtooloptions)

## Redux

本节提供对 Redux 设置的访问以及覆盖 Redux 方法的选项。

### initialState

```javascript
init({
	redux: {
		initialState: any,
	},
})
```

你的 app 的 initialState. 这可能不是必需的，因为 model 的 state 会覆盖 initial state 。

### reducers

```javascript
const someReducer = (state, action) => {
	switch (action.type) {
		default:
			return state
	}
}

init({
	redux: {
		reducers: {
			someReducer,
		},
	},
})
```

允许传递 reducer functions，而不是 model 。 虽然不推荐，但可用于迁移 Redux 代码库或配置不同的 Redux 扩展。

### middlewares

```javascript
init({
	redux: {
		middlewares: [customMiddleware()],
	},
})
```

添加 middleware 到你的 store.

### enhancers

```javascript
init({
	redux: {
		enhancers: [customEnhancer()],
	},
})
```

添加 enhancers 到你的 store.

### rootReducers

```javascript
init({
	redux: {
		rootReducers: {
			RESET: (state, action) => undefined,
		},
	},
})
```

一种在你的 root reducer 基础上设置中间件钩子的方法， 与中间件不同，返回值是下一个状态。如果`undefined`，这个 state 将会退回到 reducers 的初始 state.

### combineReducers

```javascript
init({
	redux: {
		combineReducers: customCombineReducers,
	},
})
```

允许访问覆写 Redux 的 `combineReducers` 方法。对于当前设置 Redux persist v5 来说是必须的。

### createStore

```javascript
init({
	redux: {
		createStore: customCreateStore,
	},
})
```

允许访问覆写 Redux 的 `createStore` 方法。对于基于 Redux 设置 Reactotron 来说是必须的。

### devtoolOptions

```javascript
init({
	redux: {
		devtoolOptions: customDevtoolOptions,
	},
})
```

访问 [redux devtool options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md) .在 [devtool recipes](https://rematch.gitbooks.io/rematch/docs/recipes/devtools) 之上了解更多配置 devtools 的信息。
