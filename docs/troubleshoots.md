# Troubleshoots

### Persist Plugin error after migrating from V1.

On `v1.x.x` version persist plugin config wasn't required to use storage, internally was using always local storage.
```js
const persistPlugin = createRematchPersist({
  whitelist: ['preferences'],
  version: 1
});
```

On `v2.x.x` you need to import from redux-persist the storage you want.

```javascript
import storage from 'redux-persist/lib/storage'

const persistPlugin = createRematchPersist({
  key: 'storage',
  storage,
  whitelist: ['preferences'],
  version: 1
});
```

### Destructuring dispatch models gives circular referencing issue on Typescript

On `Typescript` we have some issues with circularity referencing when destructuring models from dispatch parameters.
https://github.com/microsoft/TypeScript/issues/40279

So it's recommended to use this way:

```typescript
// model.ts

export const players = createModel<RootModel>()({
	// ...
	effects: (dispatch) => {
		const { players } = dispatch
		return {
      async getPlayers(): Promise<any> {
        // inside effect is also allowed
        // 	const { players } = dispatch
				let response = await fetch("https://www.balldontlie.io/api/v1/players");
				let { data } : { data:PlayerModel[] }  = await response.json()
				players.SET_PLAYERS(data)
			},
		}
	},
})
```

### Loading plugin - Breaking change

>  Not released yet, in discussion

Loading plugin after `v2.x.x` changed how works internally and now just uses `1-0` or `true-false`, in `v1.x.x` was using an index to increment, if asBoolean config is on

On `v1.x.x`:

```javascript
  // internal code
	cntState.global += i
	cntState.models[name] += i
	cntState.effects[name][action] += i
```

On `v2.x.x`:

```javascript
  // internal code
  reducers: {
      hide: createLoadingAction(converter, 0, cntState),
      show: createLoadingAction(converter, 1, cntState),
  },
	cntState.global = i
	cntState.models[name] = i
	cntState.effects[name][action] = i
```
