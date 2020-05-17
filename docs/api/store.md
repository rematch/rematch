## Store {docsify-ignore}

Store returned by Rematch is essentially a [Redux store](https://redux.js.org/api/store) with a few additional properties and extra features. Therefore, for more in-depth reference of the functions '*provided by Redux*', refer to the Redux documentation.

---

Store is an object which contains the following properties:

- `name` (*string*): name of a store

- `addModel(namedModel)`: it allows to lazy-load models and merge them into Rematch after [init](api/reference.md#init) has been called. **addModel** accepts *namedModel* which means it needs to have parameter `name` defined (see example below).

- `getState()`: provided by Redux, returns the state of your store.

- `subscribe(listener: () => void): Unsubscribe`: provided by Redux, adds a change listener.

- `replaceReducer(nextReducer): void`: provided by Redux, replaces the reducer currently used by the store to calculate the state.

- `dispatch(action)`: provided by Redux, a function that dispatches actions to the store. However, in Rematch **dispatch** can be also used as an object which contains action dispatchers (see example below).

**Example**:

```javascript
import store from './store'

// dispatch reducers actions
store.dispatch({ type: 'count/increment', payload: 1 }) // regular dispatch usage
store.dispatch.count.increment(1) // the same as above but with action dispatcher

// dispatch effects actions
store.dispatch({ type: 'count/incrementAsync', payload: 1 }) // regular dispatch usage
store.dispatch.count.incrementAsync(1) // the same as above but with action dispatcher

// add model dynamically
// (1) initially
store.getState() // { count: 0 }
// (2) add model
store.model({ name: 'countB', state: 99 })
// (3) after adding
store.getState() // { count: 0, countB: 99 }
```
