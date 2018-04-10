# combineReducers

Rematch and more generally Redux, encourage to keep a flat state to solve several [issues](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape).
Each model should be considered as a separate entity and should only be updated by its reducer, this is why Rematch doesn't allow nested reducers.

This being said, there is some case where nest reducer can be a good thing.

Let's start with an example. A common pattern in Redux when we want to store an ordered list: "allIds, byId". Store entities as
an array require to iterate over the array to find our target and store the entities as an object doesn't let us to keep 
an order.

```javascript
const todoList = {
  state: {
    byId: {
      0: {
        task: 'Learn Rematch',
        isDone: true
      },
      1: {
        task: 'Learn functional programming',
        isDone: false
      }
    },
    allIds: [1, 0]
  }
}
```

`combineReducers` would be helpful here because:
  - byId and allIds refers to the same model, they are the same entity
  - they don't depend to each other, so they would be handled separately
  
 ## Example without separating byId and allIds
 
 ```javascript
const todoList = {
  state: {...},
  reducer: {
    // remove update allIds and byId, but independately
    remove(state, payload) {
      const { idToRemove } = payload;
      return {
        byId: Object.entries(state.byId)
          .filter(([id, todo]) => id !== idToRemove)
          .reduce((acc, [id, todo]) => ({ ...acc, [id]: todo }), {}),
        allIds: state.allIds.filter(id => id !== idToRemove)
      };
    },
    // update only update our byId key
    toggle(state, payload) {
      const { idToToggle } = payload;
      return {
        ...state, // don't update allIds,
        byId: Object.entries(state.byId)
          .map(([id, todo]) => [
            id,
            id === idToToggle ? { ...todo, isDone: !todo.isDone } : todo
          ])
          .reduce((acc, [id, todo]) => ({ ...acc, [id]: todo }), {})
      };
    }
  }
};

```
Our reducer is doing too much here.
We can separate our reducer easily by creating some update function.

Start decoupling the reducers with reusable functions:

```javascript
function filterObjectByKey(obj, f) {
  return Object.entries(obj)
    .filter(([key, value]) => f(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

function updateObject(obj, f) {
  return Object.entries(obj)
    .map(([key, value]) => [key, f(key, value)])
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}
```

Let's rewrite it!

```javascript
function removeById(state, payload) {
  const { idToRemove } = payload;
  return filterObjectById(state, id => id !== idToRemove);
}

function removeAllIds(state, payload) {
  const { idToRemove } = payload;
  return state.filter(id => id !== idToRemove);
}

function toggleById(state, payload) {
  const { idToToggle } = payload;
  return updateObject(
    state,
    (id, todo) => (id === idToToggle ? { ...todo, isDone: !todo.isDone } : todo)
  );
}

function toggleAllIds(state, payload) {
  return state;
}
```

Now we can use:

```javascript
const todoList = {
  state: {...},
  reducer: {
    // remove update allIds and byId, but independately
    remove(state, payload) {
      return {
        byId: removeById(state.byId, payload),
        allIds: removeAllIds(state.allIds, payload)
      };
    },
    // update only update our byId key
    toggle(state, payload) {
      return {
        byId: toggleById(state.byId, payload),
        allIds: toogleAllIds(state.allIds, payload)
      };
    }
  }
};

```




 
