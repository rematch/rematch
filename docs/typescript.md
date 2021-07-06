---
id: typescript
title: Typescript
sidebar_label: Typescript
slug: /getting-started/typescript
---

```twoslash include countModel
// @filename: count.ts
import { createModel } from '@rematch/core'
import { RootModel } from "./models"

export const count = createModel<RootModel>()({
	state: 0,
	reducers: {
		increment(state, payload: number) {
			return state + payload
		},
	},
	effects: (dispatch) => ({
		incrementAsync(payload: number, state) {
			dispatch.count.increment(payload)
		},
	}),
})
```

```twoslash include rootModel
// @filename: models.ts
import { Models } from "@rematch/core"
import { count } from "./count"

export interface RootModel extends Models<RootModel> {
  count: typeof count
}

export const models: RootModel = { count }
```

```twoslash include store
// @filename: store.ts
import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'

/** Plugins **/
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/updated'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'

type FullModel =  ExtraModelsFromLoading<RootModel> & ExtraModelsFromUpdated<RootModel>

export const store = init<RootModel, FullModel>({
	models,
	plugins: [
		loadingPlugin(),
		updatedPlugin(),
	]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
```

Rematch handles Typescript inference practically out of the box, we have all our codebase with Typescript (latest version) and we do continuous testing to our [typescript examples](https://github.com/rematch/rematch/tree/main/examples/all-plugins-react-ts).

For getting a cool Typescript setup with Rematch, it's as easy as using `createModel` helper.

### createModel

Use helper method `createModel` to create a model.

```ts twoslash
// @include: rootModel
// @filename: count.ts
// ---cut---
import { createModel } from "@rematch/core";
import type { RootModel } from "./models";

export const count = createModel<RootModel>()({
  state: 0,
  reducers: {
    increment(state, payload: number) {
      return state + payload;
    },
  },
  effects: (dispatch) => ({
    incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
    },
  }),
});
```

In the case of a complex state, you can just type the state with the `as` keyword:

```ts twoslash {12}
// @include: rootModel

// @filename: count.ts
// ---cut---
import { createModel } from "@rematch/core";
import type { RootModel } from "./models";

type Names = "custom";
type ComplexCountState = {
  count: number;
  multiplierName: Names;
};

export const count = createModel<RootModel>()({
  state: {
    count: 0,
    multiplierName: "custom",
  } as ComplexCountState,
  reducers: {
    increment(state, payload: number) {
      return {
        count: state.count + payload,
        multiplierName: "custom",
      };
    },
  },
  effects: (dispatch) => ({
    incrementEffect(payload: number, rootState) {
      dispatch.count.increment(payload);
    },
  }),
});
```

### RootModel

RootModel is the file that stores all your models. We need it because you can dispatch effects and access state from other models (it's global), so we need to know all the models for bringing you the intellisense.

```ts twoslash title="models.ts"
// @include: countModel
// ---cut---
// @include: rootModel
```

## init() store

### init

With your model ready with `createModel()` helper and the `RootModel` exported, you only need to `init()` the store.

Now we like to export some common types:

- **Store**: type
- **RematchDispatch**: useful for knowing all the effects and reducers methods and his parameters
- **RematchRootState**: you will get intellisense of each state of each model.

```ts twoslash  title="store.ts"
// @include: rootModel
// @include: countModel

// @filename: store.ts
// ---cut---
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
```

:::tip
In the case you use some plugin, please read this:
:::

### init with plugins

Some plugins modifies the store like [`@rematch/loading`](/docs/plugins/loading), that introduces a new state with all your promises status, Typescript to know that needs some helper.

You need to pass the [`RootModel`](#RootModel) to `init()` function and introduce the helpers:

- **@rematch/loading**: { ExtraModelsFromLoading }
- **@rematch/updated**: { ExtraModelsFromUpdated }

```ts twoslash {4-9} title="store.ts"
// @include: rootModel
// @include: countModel

// @filename: store.ts
// ---cut---
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { models, RootModel } from "./models";

/** Plugins **/
import updatedPlugin, { ExtraModelsFromUpdated } from "@rematch/updated";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";

type FullModel = ExtraModelsFromLoading<RootModel> &
  ExtraModelsFromUpdated<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loadingPlugin(), updatedPlugin()],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
```

## React Hooks Types

- **RootState** and **Dispatch** types: import this types from the previous file mentioned: [init](#init)

### useSelector

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// @filename: Count.tsx
// ---cut---
import React from "react";
import { RootState } from "./store";
import { useSelector } from "react-redux";

const Count = () => {
  const countState = useSelector((state: RootState) => state.count);

  return <div>example</div>;
};
```

### useDispatch

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// @filename: Count.tsx
// ---cut---
import React, { useEffect } from "react";
import { Dispatch } from "./store";
import { useDispatch } from "react-redux";

const Count = () => {
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    dispatch.count.incrementAsync(2);
    // 												^?
  }, []);

  return <div>example</div>;
};
```

## React class types

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// @filename: App.tsx
// ---cut---
import React from "react";
import { RootState, Dispatch } from "./store";
import { connect } from "react-redux";

class App extends React.PureComponent<Props> {
  render() {
    const { countState } = this.props;
    return <div>example</div>;
  }
}

const mapState = (state: RootState) => ({
  countState: state.count,
});

const mapDispatch = (dispatch: Dispatch) => ({
  count: dispatch.count,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps & DispatchProps;

export default connect(mapState, mapDispatch)(App);
```

## Effects returning values

There's a situation where if you're accessing the `rootState` value of the same model and returning this value. Typescript will fail because circular references itself (has sense)...

You should try to avoid returning values on effects and just dispatch data to reducers or write pure functions outside Rematch for a better performance.

Anyways, you can omit this error force typing the effect. [Related Github Issue](https://github.com/rematch/rematch/issues/864#issuecomment-781357794)

Instead of:

```ts twoslash
// @include: rootModel
// @filename: count.ts
// ---cut---
// @errors: 2502 7022 2615
import { createModel } from "@rematch/core";
import { RootModel } from "./models";

export const count = createModel<RootModel>()({
  state: 0,
  reducers: {
    increment(state, payload: number) {
      return state + payload;
    },
  },
  effects: (dispatch) => ({
    async incrementAsync(payload: number, state) {
      dispatch.count.increment(payload);
      return state.count;
    },
  }),
});
```

Define the return value:

```ts twoslash {11}
// @include: rootModel
// @filename: count.ts
// ---cut---
import { createModel } from "@rematch/core";
import { RootModel } from "./models";

export const count = createModel<RootModel>()({
  state: 0,
  reducers: {
    increment(state, payload: number) {
      return state + payload;
    },
  },
  effects: (dispatch) => ({
    async incrementAsync(payload: number, state): Promise<number> {
      dispatch.count.increment(payload);
      return state.count;
    },
  }),
});
```
