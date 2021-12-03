---
id: models
title: Models
sidebar_label: Models
slug: /api-reference/models
---

Models are crucial parts of your store. They allow you to define your initial state, reducers and effects. You can provide them to the Rematch [init](/docs/api-reference/#initconfig) method as `config.models` property.

---

### Configuration

Configuration for a model is build using the following properties:
| PropertyName                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :--------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| [`name`] (_string_)                                  | the name will become a key in the store's state and in the dispatch created by Rematch. It means that you will be able to access state of a model named 'count' using `store.getState().count` and dispatch actions using `store.dispatch.count`. If you don't provide a name for the model, Rematch will use a key from the `models` object provided to [init](/docs/api-reference/#initconfig) function.                                                                                          |
| `state` (_any_)                                      | initial state for a model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `reducers` (_{ [string]: (state, payload) => any }_) | an object of functions that change the model's state. These functions take the model's previous state and a payload, and return the model's next state. These should be pure functions relying only on the state and payload arguments to compute the next state. For code that relies on the "outside world" \(impure functions like api calls, etc.\), use effects. Reducers may also listen to actions from other models by listing the 'model name' + 'action name' as their key (see example). |
| [`baseReducer`] (_(state, action) => state_)         | a reducer that will run before the model's `reducers`. This function takes the model's previous state and an action, and returns the model state that `reducers` will use. In general, you don't need to use baseReducer. However, it is especially useful for adding redux libraries to your store in a structured manner. See the recipe for [redux plugins](/docs/recipes/redux-plugins).                                                                                                        |

- [`effects`] (_{ [string]: (payload, rootState) } | (dispatch => { [string]: (payload, rootState) })_): effects have access to model's state and reducers, and they allow to handle the world outside of the model. Therefore, they are often used to manage asynchronous actions.

  Effect is a function which takes a payload and store's **root state** and returns anything. `effects` property is an object with effect functions. `this` reference of each effect is bind to the model's dispatcher, which means it's possible to dispatch model's actions from effects.

  There might a need to access dispatchers for different models - not only the one being defined. In this case, it is possible to define `effects` as a factory taking store's dispatch and returning object with effect functions.

  Effects functions that share a name with a reducer are called **after** their reducer counterpart.

**Example**:

```js title="models.js"
export const countModel = {
  state: { counter: 0 }, // initial state
  reducers: {
    add: (state, payload) => {
      return {
        ...state,
        counter: state.counter + payload,
      };
    },
  },
  effects: {
    async loadData(payload, rootState) {
      const response = await fetch(`http://example.com/${payload}`);
      const data = await response.json();
      this.add(data); // dispatch action to a local reducer
    },
  },
};

export const exampleNamedModel = {
  name: "example",
  state: 1000,
  reducers: {
    subtract: (state, payload) => state - payload,
  },
  effects: (dispatch) => ({
    async triggerData(payload, rootState) {
      console.log(rootState.example); // log current state of example model
      await dispatch.count.loadData(payload); // dispatch action from a different model
    },
  }),
};
```

```js title="store.js"
import { init } from "@rematch/core";
import { countModel, exampleNamedModel } from "./models";

const store = init({
  models: {
    count: countModel, // adding model with a name 'count', taken from the key since our countModel object doesn't define its name
    anything: exampleNamedModel, // adding model with a name 'example' which is defined in the model
  },
});
```
