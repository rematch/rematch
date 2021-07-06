---
id: index
title: Rematch API Reference
sidebar_label: Introduction
slug: /api-reference/
---

The API exposed by Rematch is very simple and it is based around the [init](#initconfig) method. It creates and returns a [Rematch store](store), which is essentially a [Redux store](https://redux.js.org/api/store) with a few additional properties and extra features.

- To use Rematch in your project, you need to understand how to define [models](models) that are passed to the init configuration.
- If you are planning to migrate from the plain Redux setup or you want to make some changes to the Redux configuration,
  check out [init's Redux configuration](redux).
- If you would like to develop a new plugin, see the [Plugin API](plugins) reference.

## init([config])

The function called to setup Rematch.

**Arguments**:

Init accepts one argument - **config**, which is an object with the following properties:

- [`name`] (_string_): a name for your store. It might be useful when creating multiple stores. Default value is: _"Rematch Store {counter}"_.

- [`models`] (_Object_): each model describes its part of the state, reducers and effects. This parameter is a mapping from models' names to their configuration. See [Model API](models) for details.

- [`plugins`] (_Array_): plugins are special sets of configuration that can extend the functionality of your store. You can pass an array of plugins that you want to use in your store. See the [plugins](/docs/plugins/) developed by the Rematch team or the [API for creating plugins](plugins).

- [`redux`] (_Object_): there are situations where you might want to access Redux configuration directly, e.g. to migrate existing redux project or add middlewares. See [Redux API](redux) for details.

**Returns**:

(_Object_) Fully configured Redux store with extra properties and methods supplied by Rematch. See [Store API](store) for details.

**Example**:

```js
import { init } from "@rematch/core";

const store = init({
  name: "my custom store name",
  models: { example1, example2 },
  plugins: [plugin1, plugin2],
  redux: customReduxConfig,
});
```

For more comprehensive examples, visit [examples](/examples/).
