---
id: plugins
title: Plugins
sidebar_label: Plugins
slug: /api-reference/plugins
---

Plugins provide the possibility to extend Rematch functionality. They can overwrite configuration, add new models or even replace the whole store. To get the idea how to build plugins, you can visit [plugins](/docs/plugins/) section and refer to the source code of each plugin built by the Rematch team.

---

### Configuration

Plugin is an object that can contain the following properties:

- [`config`] (*{models, redux}*): object with two properties - `models` and `redux`. They allow to add additional models to the store with a plugin and overwrite redux configuration. The shape of these properties is the same as accepted by the [init](/docs/api-reference/#initconfig) method. Refer to the [Models](models) and [Redux](redux) documentation for details.

- [`exposed`] (*{[string]: ((rematchStore, ...args) => any) | object}*): it allows to assign extra properties to the store for communication between plugins as it is executed before *onModel* and *onStoreCreated* hooks. It must be either an object or a function accepting Rematch store and returning a value.

- [`createMiddleware`] (*(bag) => Redux.Middleware*): used for creating custom middleware that needs access to Rematch internals available in the Rematch 'bag'. If you don't need to access 'bag', you can also put middleware in `config.redux.middlewares` as described in [Redux](redux).

- [`onReducer`] (*(reducer, modelName, bag) => reducer | void*): executed when a *base reducer* is created for a model. It can return a new reducer, in which case it will overwrite the one created by Rematch.

- [`onRootReducer`] (*(reducer, bag) => reducer | void*): executed when a *root reducer* is created for the store. It can return a new root reducer, in which case it will overwrite the one created by Rematch.

- [`onModel`] (*(namedModel, rematchStore) => void*): when the whole setup for models is completed - reducers and dispatchers are ready, `onModel` hook is executed for each model. It is also executed every time a model is added dynamically to the store. It can be used to collect information about models' reducers and effects, to overwrite them or create new properties.

- [`onStoreCreated`] (*(rematchStore, bag) => rematchStore | void*): the last hook, runs at the end when Rematch Store is ready. It can return a new store, in which case it will overwrite the one created by Rematch. Usually, it is used to add extra properties or functions to the store. If you choose to do this with a plugin with TypeScript, be sure to update your stores typings.

### Example of plugins implementation:

```js
const plugin = {
	config: {
		redux: {
			combineReducers: customCombineReducers,
		},
        models: {
          extra: extraModel,
        },
	},
    expose: { select: {} },
    createMiddleware: rematchBag => store => next => action => {
        // do something here
        return next(action)
    },
    onReducer(reducer, modelName, bag) {
      // do something
    },
    onRootReducer(reducer, bag) {
      // do something
    },
    onModel(namedModel, rematchStore) {
      // do something
    },
    onStoreCreated(rematchStore, bag) {
      // do something
    },
}
```

You can look at our official plugins to check examples to start with.