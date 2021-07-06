---
id: redux-plugins
title: Redux Plugins
sidebar_label: "Redux Plugins"
slug: /recipes/redux-plugins/
---

### Adding existing Redux Libraries to your Store

Most reducers from libraries operate on a private store slice. The easiest way to build functionality on top of these reducers is to create a model for that store slice.

The `baseReducer` option on a store model allows you to introduce a standard redux reducer that will compute the base state of that model. By combining this with `effects`, you can create a public API over the original redux reducer. These effects can be listened for and tracked.

```js
import { bindActionCreators } from "redux";
import {
  routerReducer,
  push,
  replace,
  go,
  goBack,
  goForward,
} from "react-router-redux";

const reactRouterModel = {
  baseReducer: routerReducer,
  effects: (dispatch) =>
    bindActionCreators(
      {
        push,
        replace,
        go,
        goBack,
        goForward,
      },
      dispatch
    ),
};
```

### Including middleware

Libraries like `react-router` also need middleware to work. Since we need both the model and the middleware configured with our store, the best place to do so would be a simple plugin.

This is as easy as returning a `config` object that is merged into our store.

In our example, `react-router` uses a `history` object that we'll need to be able to pass to a `ConnectedRouter`. We can expose this value for use by attaching it to our store with `onInit()`:

```js
import { createBrowserHistory } from "history";
import { routerMiddleware } from "react-router-redux";
import reactRouterModel from "./model";

export default function createReactRouterPlugin() {
  const browserHistory = createBrowserHistory();
  const middleware = routerMiddleware(browserHistory);

  return {
    middleware,
    config: {
      models: {
        [storeKey]: reactRouterModel,
      },
    },
    onStoreCreated(store) {
      return {
        browserHistory,
      };
    },
  };
}
```

Later, we can use our `history`

```jsx
const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={store.browserHistory} children={<Routes />} />
  </Provider>
);
```
