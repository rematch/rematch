---
id: testing
title: Testing
sidebar_label: "Testing"
slug: /recipes/testing/
---

:::tip
You can check our full suite of test of [@rematch/core](https://github.com/rematch/rematch/tree/main/packages/core/test) to check examples of how to test. We're using `jest` but they should work with any testing provider.
:::

## Reducers

Testing with store.

```jsx
import { init } from '@rematch/core'
import myModel from './myModel'

describe('myModel model', () => {
	it('reducer: my reducerName should do something', () => {
		const store = init({
			models: { myModel },
		})

		store.dispatch.myModel.reducerName(payload)

		const myModelData = store.getState().myModel
		expect(myModelData).toBe('something')
	})
})
```

Testing reducers directly.

```jsx
import myModel from './myModel'

describe('myModel model', () => {
	it('reducer: my reducerName should do something', () => {
		const result = myModel.reducers.reducerName(payload)
		expect(result).toBe('something')
	})
})
```

## Effects

Testing with store.

```jsx
import { init } from '@rematch/core'
import myModel from './myModel'

describe('myModel model', () => {
	it('effect: my effectName should do something', async () => {
		const store = init({
			models: { myModel },
		})

		await store.dispatch.myModel.effectName(payload)

		const myModelData = store.getState().myModel
		expect(myModelData).toBe('something')
	})
})
```

Testing effects directly.

```jsx
import myModel from './myModel'

describe('myModel model', () => {
	it('effect: my effectName should do something', async () => {
		const reducerMockFn = jest.fn()

		// bind the functions you want to check
		await myModel.effects.effectName.call(
			{ reducerThatIsGoingToBeCalled: reducerMockFn },
			payload
		)

		// checking if it was called
		expect(reducerMockFn).toHaveBeenCalled()

		// checking if it was called with the expected params
		expect(reducerMockFn).toHaveBeenCalledWith('something')
	})
})
```