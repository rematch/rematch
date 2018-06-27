## Adding existing Redux Libraries to your Store

### Create a derived store model from a Redux reducer

Most reducers from libraries operate on a private store slice. The easiest way to build functionality on top of these reducers is to create a model for that store slice.

The `baseReducer` option on a store model allows you to introduce a standard redux reducer that will compute the base state of that model. By combining this with `effects`, you can create a public API over the original redux reducer. These effects can be listened for and tracked.

```js
import {
  routerReducer,
  push,
  replace,
  go,
  goBack,
  goForward
} from 'react-router-redux'

const reactRouterModel = {
  baseReducer: routerReducer,
  effects: {
    push,
    replace,
    go,
    goBack,
    goForward
  }
}
```

### Including middleware

Libraries like `react-router` also need middleware to work. Since we need both the model and the middleware configured with our store, the best place to do so would be a simple plugin.

This is as easy as returning a `config` object that is merged into our store.

In our example, `react-router` uses a `history` object that we'll need to be able to pass to a `ConnectedRouter`. We can expose this value for use by attaching it to our store with `onInit()`:

```js
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'react-router-redux'
import reactRouterModel from './model'

export default function createReactRouterPlugin() {
  const history = createBrowserHistory()

  return {
    config: {
      models: {
        [storeKey]: reactRouterModel
      },
      redux: {
        middlewares: [routerMiddleware(history)]
      }
    },
    onInit () {
      return {
        history
      }
    }
  }
}
```

Later, we can use our `history`
```js
const App = () =>
<Provider store={store}>
  <ConnectedRouter history={store.history} children={<Routes />} />
</Provider>
```
