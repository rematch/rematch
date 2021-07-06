---
id: from-redux
title: From Redux to Rematch
sidebar_label: From Redux to Rematch
slug: /migrating-from-redux-to-rematch
---

Moving from Redux to Rematch involves very few steps.

### 1. Setup Rematch `init` with Redux

Imagine a simple app than increments a value in a redux store written in React.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import sharks from "./redux/sharks";
import App from "./App";

// generate Redux store
const store = init({
  redux: {
    reducers: {
      sharks,
    },
    middlewares: [thunk],
  },
});

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Root />, document.querySelector("#root"));
```

### 2. Mix reducers & models

Our currently `Redux` reducers are currently like this:

```js
const INCREMENT = "sharks/increment";

export const incrementSharks = (payload) => ({
  type: INCREMENT,
  payload,
});

export default (state = 0, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + action.payload;
    default:
      return state;
  }
};
```

But now we'll move them to Rematch Models, create a new file called `/models/sharks.js`:

```js
export default {
  state: 0,
  reducers: {
    increment: (state, payload) => state + payload,
  },
};
```

:::info
Both snippets (Redux one and Rematch Model) are equivalent.
:::

Now, add it to your `init()` method and remove `redux-thunk` because isn't required with Rematch:

```js
const store = init({
  models: {
    sharks,
  },
});
```

Views probably will work out of the box, because we're compatible with `react-redux`.

Enjoy your refactored code-base :)
