---
id: redux-devtools
title: Redux Devtools
sidebar_label: "Redux Devtools"
slug: /recipes/redux-devtools/
---

Rematch works with [Redux Devtools](https://github.com/zalmoxisus/redux-devtools-extension) out of the box. No configuration required.

```ts twoslash
import { init } from "@rematch/core";
init(); // devtools up and running
```

Its also possible to add redux devtools [configuration options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md).

```ts twoslash
import { init } from "@rematch/core";

init({
  redux: {
    devtoolOptions: {
      actionSanitizer: (action) => action,
    },
  },
});
```

To disable redux devtools, set `disabled` property to `true`:

```ts twoslash
import { init } from "@rematch/core";

init({
  redux: {
    devtoolOptions: {
      disabled: true,
    },
  },
});
```

## Remote Redux-Devtools

Remote-redux-devtools is not supported in rematch see this [issue](https://github.com/rematch/rematch/issues/419).
You can use [react-native-debugger](https://github.com/jhen0409/react-native-debugger) which works out of the box with rematch.

## Reactotron

Setup Rematch to also work with [Reactotron devtools](https://github.com/infinitered/reactotron).

```ts twoslash title="Reactotron.config.js"
// @noErrors
import Reactotron from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";

export default Reactotron.configure({
  name: "MyAwesomeApp",
})
  .use(reactotronRedux())
  // add other devtools here
  .connect();
```

Overwrite `createStore` to complete the config.

```ts twoslash title="store.ts"
// @noErrors
import { init } from "@rematch/core";
import Reactotron from "./Reactotron.config.js";

init({
  redux: {
    enhancers: [Reactotron.createEnhancer()],
    // If using typescript/flow, enhancers: [Reactotron.createEnhancer!()]
  },
});
```
