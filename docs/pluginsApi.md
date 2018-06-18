# Plugin Examples

There are plenty of examples to base your next plugin on. After all, in Rematch, everything is a plugin: `dispatch`, `effects`, `selectors`, `subscriptions` - all plugins. Optional plugins can be provided as packages, such as "loading" & "persist".

- [core plugins](https://github.com/rematch/rematch/tree/master/src/plugins)
- [plugin packages](https://github.com/rematch/rematch/tree/master/plugins)

# Plugin API Reference

- [config](#config)
- [exposed](#exposed)
- [onModel](#onmodel)
- [middleware](#middleware)
- [onStoreCreated](#onstorecreated)

### config

`{ config: initOptions }`

An init options overwrite object. See [init](./api.md#init) for a full list of options.

```js
// example from persist plugin
const plugin = {
  config: {
    redux: {
      combineReducers: customCombineReducers,
    }
  },
}
```

See "persist" as an example.

### exposed

`{ exposed: { [string]: any } }`

A shared object for plugins to communicate with each other.

```js
// example from select plugin
const selectors = {
  expose: { select: {} },
}
```

See "dispatch", "select" as an example.


### onModel

`{ onModel(model: Model): void }`

```js
const plugin = {
  onModel(model) {
    // do something
  }
}
```

A function called everytime a model is created.

Use this when creating new properties on the model, or augmenting existing properties.

As an example, see "dispatch", "effects", "subscriptions", etc.

### middleware

`{ middleware: (store: Model) => (next: Dispatch) => (action: Action): nextState }`

```js
const plugin = {
  middleware: store => next => action => {
    // do something here
    return next(action)
  }
}
```

Used for creating custom middleware.

See examples with "effects", "loading", & "subscriptions".

### onStoreCreated

`{ onStoreCreated(store: Store): void }`

```js
const plugin = {
  onStoreCreated(store) {
    // do something
  }
}
```

Run last, as it is after the store is created. This provides access to the `store`.

See examples with "dispatch" & "persist".
