# Plugin API

### Plugin Examples

有很多例子可以为你的下一个插件提供参考基础。毕竟，在 Rematch 中，一切都是插件: `dispatch`, `effects`, `selectors`, `subscriptions` - 它们都是插件。可选的插件可以作为包提供，例如 “loading” 和 “persist” .

* [core plugins](https://github.com/rematch/rematch/tree/master/src/plugins)
* [plugin packages](https://rematch.gitbooks.io/rematch/https:/github.com/rematch/rematch/tree/master/plugins)

### Plugin API Reference

* config
* exposed
* onModel
* middleware
* onStoreCreated

#### config

`{ config: initOptions }`

一个 init options 覆盖对象。参阅[ init](https://rematch.gitbooks.io/rematch/docs/api.html#init) 以获取全部的 options。

```javascript
// example from persist plugin
const plugin = {
  config: {
    redux: {
      combineReducers: customCombineReducers,
    }
  },
}
```

以 “persist” 作为一个例子。

#### exposed

`{ exposed: { [string]: any } }`

一个用于插件间相互通信的共享对象。

```javascript
const selectors = {
  expose: { select: {} },
}
```

以 “dispatch”，“select” 为例。

#### onModel

`{ onModel(model: Model): void }`

```javascript
const plugin = {
  onModel(model) {
    // do something
  }
}
```

每创建一个 model 都会调用的一个函数。在 model 上创建新属性或增加现有属性时使用此函数。

作为例子，请参阅 “ dispatch”，“ effects”，“ subscriptions” 等。

#### middleware

`{ middleware: (store: Model) => (next: Dispatch) => (action: Action): nextState }`

```javascript
const plugin = {
  middleware: store => next => action => {
    // do something here
    return next(action)
  }
}
```

用于创建自定义中间件。

查看 “effects”，“loading” 和 “subscriptions” 的示例。

#### onStoreCreated

`{ onStoreCreated(store: Store): void }`

```javascript
const plugin = {
  onStoreCreated(store) {
    // do something
  }
}
```

最后运行，在创建store之后。提供访问`store`的方法。

参见 “dispatch” 和 “persist” 的例子。



### 



