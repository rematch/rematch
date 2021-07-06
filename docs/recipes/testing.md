---
id: testing
title: Testing
sidebar_label: "Testing"
slug: /recipes/testing/
---

Rematch testing works out of the box with many libraries like Jest, Mocha, Ava, and of course works fine with end to end tests like Cypress or Testing Library.

:::tip
You can check our full suite of test of [@rematch/core](https://github.com/rematch/rematch/tree/main/packages/core/test) to check examples of how to test. We're using `jest` but they should work with any testing provider.
:::

## Jest

This tests are based in Jest, but should be pretty similar in other testing frameworks.

### Reducers

Testing with store.

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

export const store = init<RootModel>({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
```

```ts twoslash
// @include: countModel
// @include: rootModel
// @filename: count.test.ts
// ---cut---
import { init } from "@rematch/core";
import { models, RootModel } from "./models";

describe("[count] model", () => {
  it("incrementAsync effect should increment given a payload", async () => {
    const store = init<RootModel>({
      models,
    });

    await store.dispatch.count.incrementAsync(3);

    const myModelData = store.getState().count;
    expect(myModelData).toEqual(3);
  });
});
```

### Effects

Testing with store.

```ts twoslash
// @include: countModel
// @include: rootModel
// @filename: count.test.ts
// ---cut---
import { init } from "@rematch/core";
import { models, RootModel } from "./models";

describe("[count] model", () => {
  it("effect: my incrementAsync effect should do something", async () => {
    const store = init<RootModel>({
      models,
    });

    await store.dispatch.count.incrementAsync(3);

    const countData = store.getState().count;
    expect(countData).toEqual(3);
  });
});
```

Testing effects directly.

```ts twoslash
// @include: countModel
// @include: rootModel
// @filename: count.test.ts
// ---cut---
import { count } from "./count";

describe("myModel model", () => {
  it("effect: my effectName should do something", async () => {
    const reducerMockFn = jest.fn();

    // bind the functions you want to check
    await (count.effects as any).incrementAsync.call(
      { reducerThatIsGoingToBeCalled: reducerMockFn },
      { payload: "" }
    );

    // checking if it was called
    expect(reducerMockFn).toHaveBeenCalled();

    // checking if it was called with the expected params
    expect(reducerMockFn).toHaveBeenCalledWith("something");
  });
});
```

## Testing Library

To get started with Testing Library tests since they're similar to e2e you have to wrap your React application with the React-Redux Provider:

```twoslash include testUtils
// @filename: testUtils.tsx
// ---cut---
import React from "react"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import type { Store } from "redux"

export const renderWithRematchStore = (ui: React.ReactElement, store: Store) =>
  render(ui, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  })
```

```tsx twoslash title="testUtils.tsx"
// @include: testUtils
```

Now, we can just use this `renderWithRemathStore` instead of the native `render` function that `@testing-library` exposes, to render any component that is connected to Rematch store.
(For ex: using `useSelector`, or `useDispatch`)

Imagine an scenario where we have a component called `<ButtonCounter>` that recovers information of the count model and increments the value:

```twoslash include buttonCounter
// @filename: ButtonCounter.tsx
// ---cut---
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, Dispatch } from "./store"

export const ButtonCounter = () => {
  const dispatch = useDispatch<Dispatch>()
  const counter = useSelector((rootState: RootState) => rootState.count)

  return (
    <div>
      <span aria-label="Counter">Current counter: {counter}</span>
      <button
        aria-label="Increment Button"
        type="button"
        onClick={() => dispatch.count.incrementAsync(1)}
      >
        Increment Asynchronous
      </button>
    </div>
  )
}
```

```tsx twoslash
// @include: countModel
// @include: rootModel
// @include: store
// @include: buttonCounter
```

We could test with Testing Library that pressing in that buttons correctly dispatches the incrementAsync effect and the `counter` value it's correctly refreshed.

```tsx twoslash
// @noErrors
import React from "react";
import { screen } from "@testing-library/react";
import { store } from "./store";
import { renderWithRematchStore } from "./testUtils";

import { ButtonCounter } from "./ButtonCounter";

describe("ButtonCounter", () => {
  it("should be rendered correctly", async () => {
    renderWithRematchStore(<ButtonCounter />, store);
    expect(screen.getByLabelText("Increment Button")).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Increment Button"));
    expect(screen.getByLabelText("Increment Button")).toBeInTheDocument();
    expect(screen.getByLabelText("Counter")).toEqual("Current counter: 1");
  });
});
```

Thanks to `aria-label` tags inside our `ButtonCounter` component we can query this DOM elements with the `screen` property exported by Testing Library.

We recover these DOM elements and we use the Testing Library assertions like `.toBeInTheDocument()` to make sure that everything runs fine.
