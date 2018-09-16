# `@rematch/port`

`port` is a plugin that exposes several declarative options to use tested, hopefully type-safe, transformations of the store's config. You call it with a flat object and the plugin does all the config merging.

By abstracting even more wiring, unit tests only ~~need to~~ _should_ be written for the binding code in any complex plugins while most redux "ports" have no additional surface area.

### Uses

- port **any** existing redux library inline
- package and encapsulate legacy code
- makes heavyweight plugins trivial or unnecessary
- enables "presets" to include redux and legacy code declaratively

### API

```ts
interface PortConfig {
	modelName?: string
	reducer?: Reducer
	initialState?: any
	middleware?: Middleware
	actionCreators?: ActionCreatorsMapObject
	combineReducers?: typeof combineReducers
	mapReducers?: (reducers: ReducersMapObject) => ReducersMapObject
	mapRootReducer?: (rootReducer: Reducer) => Reducer
	expose?: {} | ((store: RematchStore) => {})
}
```

### Recipes

The package ships with recipes for using redux libraries which can be directly imported:

```js
import recipe from '@rematch/port/recipe/myRecipe'
```

#### Available Recipes

- Immutable.js

### Example

The "Where's my flavor of router?":

```js
const store = init({
  plugins: [
    ...
    port({
      modelName: 'router',
      reducer: connectRouter(history),
      middleware: routerMiddleware(history),
      actionCreators: routerNavigationActions
    })
  ]
}
```

Redux Undo(#509)

```js
function rematchUndoPlugin({ undoable = [] }) {
	const actionCreators = undoable.reduce((actions, key) => {
		actions[key] = () => undo(key)
		return actions
	}, {})

	const mapReducers = reducers =>
		undoable.reduce(
			(nextReducers, key) => {
				nextReducers[key] = undoable(reducers[key])
				return nextReducers
			},
			{ ...reducers }
		)

	return port({
		actionCreators,
		mapReducers,
	})
}
```

## Packaging your port

1.  Create a recipe script and associated test

```sh
$ npm run port
```

2.  Commit your recipe and make a PR on github

3.  When published, recipes are included with the package:

```js
import recipe from '@rematch/port/recipe/myRecipe'
```
