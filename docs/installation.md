---
id: installation
title: Installation
sidebar_label: Installation
slug: /getting-started/installation
---

Installation is as simple as running the npm command:

```bash npm2yarn
npm install @rematch/core
```

## Basic usage

### Step 1: Define models

**Model** brings together state, reducers, async actions in one place. It describes a slice of your redux store and how it changes.

Understanding configuration of models is as simple as answering a few questions:

1. What is my initial state? **state**
2. How do I change the state? **reducers**
3. How do I handle async actions? **effects** with async/await

Below we define a simple model `count`.

import { MultiLangComponent } from "/src/components/MultiLangComponent"

<MultiLangComponent>

```js
export const count = {
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload) {
      return state + payload;
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch.count.increment(payload);
    },
  }),
};
```

<>

- Use helper method `createModel` to create a model.
- You must pass the `RootModel` type that is exported on your index.ts of your models.
- State is automatically infered, if your state contains complex types you only need to use an `as` [Look at count-react-ts example on questions.ts](https://github.com/rematch/rematch/blob/next-types/examples/count-react-ts/src/models/questions.ts)

> All the examples of Rematch with TypeScript are fully tested in our testing suite, so feel free to look at the /examples folder for an easier integration with your codebase.

```ts title="./models/countModel.ts"
import { createModel } from "@rematch/core";
import { RootModel } from "./models";

export const count = createModel<RootModel>()({
  state: 0, // initial state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload: number) {
      return state + payload;
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload: number, state) {
      console.log("This is current root state", state);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch.count.increment(payload);
    },
  }),
});
```

```ts title="./models/index.ts"
import { Models } from "@rematch/core";
import { count } from "./count";

export interface RootModel extends Models<RootModel> {
  count: typeof count;
}

export const models: RootModel = { count };
```

**Example with a more complex state**

```ts
import { createModel } from "@rematch/core";
import { RootModel } from "./models";

type QuestionType = "true-false" | "other-value";
type Question = {
  title: string;
};

interface CountState {
  questions: Array<Question>;
  questionType: QuestionType;
}

export const count = createModel<RootModel>()({
  state: {
    questions: [],
    questionType: "true-false",
  } as CountState, // typed complex state
  reducers: {
    // handle state changes with pure functions
    increment(state, payload: number) {
      return state;
    },
  },
  effects: (dispatch) => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload: number, state) {
      console.log("This is current root state", state);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch.count.increment(payload);
    },
  }),
});
```

</>

</MultiLangComponent>

### Step 2: Init store

**init** is the only method you need to call to build a fully configured Redux store. You can visit [api reference](/docs/api-reference) to learn more about all configuration parameters that can be used but as a bare minimum it is enough to provide `models` object. It should contain mapping from a model name to model definition (created in step 1).

<MultiLangComponent>

```js title="store.js"
import { init } from "@rematch/core";
import * as models from "./models";

const store = init({ models });

export default store;
```

```ts title="store.ts"
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
```

</MultiLangComponent>

### Step 3: Dispatch actions

With **dispatch** you can trigger reducers & effects in your models. Dispatch standardizes your actions without the need for writing action types or action creators. Dispatch can be called directly, just like with plain Redux, or with the `dispatch[model][action](payload)` shorthand.

```js
const { dispatch } = store;
// state = { count: 0 }
// reducers
dispatch({ type: "count/increment", payload: 1 }); // state = { count: 1 }
dispatch.count.increment(1); // state = { count: 2 }

// effects
dispatch({ type: "count/incrementAsync", payload: 1 }); // state = { count: 3 } after delay
dispatch.count.incrementAsync(1); // state = { count: 4 } after delay
```

### Step 4: View

Rematch can be used with native redux integrations such as "react-redux". See an example below.

<MultiLangComponent>

```js title="App.js"
import React from "react";
import ReactDOM from "react-dom";
import { Provider, connect } from "react-redux";
import store from "./store";

const Count = (props) => (
  <div>
    The count is {props.count}
    <button onClick={props.increment}>increment</button>
    <button onClick={props.incrementAsync}>incrementAsync</button>
  </div>
);

const mapState = (state) => ({
  count: state.count,
});

const mapDispatch = (dispatch) => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1),
});

const CountContainer = connect(mapState, mapDispatch)(Count);

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById("root")
);
```

```ts title="App.tsx"
import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch } from "./store";

const mapState = (state: RootState) => ({
  count: state.count,
});

const mapDispatch = (dispatch: Dispatch) => ({
  increment: () => dispatch.count.increment(1),
  incrementAsync: () => dispatch.count.incrementAsync(1),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;

class Count extends React.Component<Props> {
  render() {
    return (
      <div>
        The count is {props.count}
        <button onClick={() => props.increment()}>increment</button>
        <button onClick={() => props.incrementAsync()}>incrementAsync</button>
      </div>
    );
  }
}

const CountContainer = connect(mapState, mapDispatch)(Count);

ReactDOM.render(
  <Provider store={store}>
    <CountContainer />
  </Provider>,
  document.getElementById("root")
);
```

</MultiLangComponent>
