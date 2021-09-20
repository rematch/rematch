---
id: immer
title: Immer
sidebar_label: "@rematch/immer"
slug: /plugins/immer/
---

Immer plugin for Rematch. Wraps your reducers with immer, providing ability to safely do mutable changes resulting in immutable state.

## Compatibility

Install the correct version of immer plugin based on the version of the core Rematch library in your project.

| @rematch/core | @rematch/immer |
| :-----------: | :------------: |
|     1.x.x     |     1.x.x      |
|     2.x.x     |     2.x.x      |

## Install

```bash npm2yarn
npm install @rematch/immer
```

## immerPlugin([config])

Immer plugin accepts one optional argument - **config**, which is an object with the following properties:

- [`whitelist`] (_string[]_): an array of models' names. Allows defining on a model level, which reducers should be wrapped with immer.
- [`blacklist`] (_string[]_): an array of models' names. Allows defining on a model level, which reducers should **not** be wrapped with immer.

If config isn't provided, reducers from all models will be wrapped with immer.

## Usage

In Immer, reducers can perform mutations to achieve the next immutable state. **Immer doesn't require that you return the next state from a reducer, but @rematch/immer plugin expects you to do it!** Your reducers must always return the next state. Otherwise, you will reset your model's state. See the example below for details.

If your state is a primitive value like a number of a string, plugin automatically avoids using immer to execute the reducer, because immer can only recognize changes to the plain objects or arrays.

```twoslash include todoModel
// @filename: todo.ts
import { createModel } from "@rematch/core"
import { RootModel } from "./models"

export const todo = createModel<RootModel>()({
  state: [
    {
      todo: "Learn typescript",
      done: true,
    },
    {
      todo: "Try immer",
      done: false,
    },
  ],
  reducers: {
    done(state) {
      // mutable changes to the state
      state.push({ todo: "Tweet about it", done: false })
      state[1].done = true
    },
  },
})
```

```twoslash include rootModel
// @filename: models.ts
import { Models } from "@rematch/core"
import { todo } from "./todo"

export interface RootModel extends Models<RootModel> {
  todo: typeof todo
}

export const models: RootModel = { todo }
```

```twoslash include store
// @filename: store.ts
import immerPlugin from "@rematch/immer"
import { init, RematchDispatch, RematchRootState } from "@rematch/core"
import { models, RootModel } from "./models"

export const store = init<RootModel>({
  models,
  // add immerPlugin to your store
  plugins: [immerPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
```

```ts twoslash title="store.ts"
// @include: rootModel
// @include: todoModel
// ---cut---
// @include: store
```

```ts twoslash title="todo.ts"
// @include: store
// @include: rootModel
// ---cut---
// @include: todoModel
```
