# Inspiration

Refining the ideas of [Dva](github.com/dvajs/dva) & [Mirror](https://github.com/mirrorjs/mirror). We think we've made a few significant improvements:

### State only, no View or Router Opinion

Rematch is not bound to any specific router, view library or framework. It can be used with React, Vue, etc., or any combination of view libraries.

### Easier to Migrate Codebase

Migrating from Redux to Rematch may only involve minor changes to your state management, and no necessary changes to your view logic. You can continue to use your current reducers, passed in to `init` as `extraReducers`. You can also use `dispatch(action)` directly to trigger actions.

### Composable Plugins

Rematch and its internals are all built upon a plugin pipeline. Everything from dispatch to selectors is a plugin. As a result, developers can make complex custom plugins that modify the setup or add to the `model`, often without requiring any changes to Rematch itself.
