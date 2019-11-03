# Testing

Todo 示例：[React](https://codesandbox.io/s/yvpy2zr8mj)

### Reducers

用 store 测试。

```javascript
import { init, dispatch } from '@rematch/core'
import myModel from './myModel'

describe('myModel model', () => {
	it('reducer: my reducerName should do something', () => {
		const store = init({
			models: { myModel },
		})

		dispatch.myModel.reducerName(payload)

		const myModelData = store.getState().myModel
		expect(myModelData).toBe('something')
	})
})
```

直接测试 reducer。

```javascript
import myModel from './myModel'

describe('myModel model', () => {
	it('reducer: my reducerName should do something', () => {
		const result = myModel.reducers.reducerName(payload)
		expect(result).toBe('something')
	})
})
```

### Effects

用 store 测试。

```javascript
import { init, dispatch } from '@rematch/core'
import myModel from './myModel'

describe('myModel model', () => {
	it('effect: my effectName should do something', async () => {
		const store = init({
			models: { myModel },
		})

		await dispatch.myModel.effectName(payload)

		const myModelData = store.getState().myModel
		expect(myModelData).toBe('something')
	})
})
```

直接测试 effects。

```javascript
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
