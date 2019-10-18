---
description: Immer提供了开发人员友好的方式来使用Rematch创建不可变reducer。
---

# Immer

请参见下面的一个例子:

```javascript
import produce from 'immer'

export default {
	// state is the array of cell IDs for this page
	state: ['1'],

	reducers: {
		reorder: produce((state, { fromIndex, toIndex }) => {
			const [id] = state.splice(fromIndex, 1)
			if (id) {
				state.splice(toIndex, 0, id)
			}
		}),

		'cells/create': produce((state, { id, atIndex }) => {
			if (atIndex > state.length) {
				throw new Error('Cell index too high')
			}

			state.splice(atIndex, 0, id)
		}),

		'cells/delete': produce((state, { atIndex }) => {
			state.splice(atIndex, 1)
		}),
	},
}
```

如果你想用 Immer produce 包装所有 reducer，请检查[Rematch Immer 插件](https://github.com/rematch/rematch/tree/master/plugins/immer)。
