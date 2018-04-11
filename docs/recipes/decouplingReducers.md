# Decoupling reducers

Rematch and more generally Redux, encourage you to keep a flat state to solve several [issues](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape).
Each model should be considered as a separate entity and should only be updated by its reducer, this is why Rematch doesn't allow nested reducers.

This being said, there is some case where nested reducers can be a good thing.
In this recipe, we will see how to use reusable reducer functions.

Let's start with an example. A common pattern in Redux, when we want to store an ordered list, is "allIds, byId". Storing the entities as an array requires an additional cost of iterating over the array to find our target. On the other hand, storing the entities as an object doesn't preserve the order of items. So let's use both: 

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
`byId` key stores the entity while `allIds` keeps track of the order of our entities.

This creates another issue: 
  - `byId` and `allIds` refers to the same entity, they definitely need to live into the same model
  - `byId` and `allIds` don't depend on each other, they definitely need to be handled separately
 

Let's try to see what we get without decoupling our reducers:
 
 ```javascript
const todoList = {
  state: {...},
  reducer: {
    // update allIds and byId
    remove(state, payload) {
      const { idToRemove } = payload;
      return {
        byId: Object.entries(state.byId)
          .filter(([id, todo]) => id !== idToRemove)
          .reduce((acc, [id, todo]) => ({ ...acc, [id]: todo }), {}),
        allIds: state.allIds.filter(id => id !== idToRemove)
      };
    },
    // update byId only
    toggle(state, payload) {
      const { idToToggle } = payload;
      return {
        ...state, // don't update allIds,
        byId: {
          ...state.byId,
          [idToToggle]: {
            ...state.byId[idToToggle],
            isDone: !state.byId[idToToggle].isDone
          }
        }       
      };
    }
  }
};

```

We see that our reducers start to be big and pretty unreadable.
Hopefully, we can separate our update functions.

We can start to isolate our pure reusable function

```javascript
function filterObjectByKey(obj, f) {
  return Object.entries(obj)
    .filter(([key, value]) => f(key))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

```

Now we can separate our `reducer functions`, the functions that update a part of the state.

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
  return {
   ...state,
   [idToToggle]: {
     ...state[idToToggle],
     isDone: !state[idToToogle].isDone
   }
  }
}

function toggleAllIds(state, payload) {
  return state;
}
```

And we finally mix everything all together by distibuting a part of the state to our reducers functions:

```javascript
const todoList = {
  state: {...},
  reducer: {
    remove(state, payload) {
      return {
        byId: removeById(state.byId, payload),
        allIds: removeAllIds(state.allIds, payload)
      };
    },
    toggle(state, payload) {
      return {
        byId: toggleById(state.byId, payload),
        allIds: toogleAllIds(state.allIds, payload)
      };
    }
  }
};

```
Reducer functions make our model simpler and more readable.



 
