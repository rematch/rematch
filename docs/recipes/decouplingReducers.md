# Decoupling reducers

Rematch and more generally Redux, encourage to keep a flat state to solve several [issues](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape).
Each model should be considered as a separate entity and should only be updated by its reducer, this is why Rematch doesn't allow nested reducers.

This being said, there is some case where nested reducer can be a good thing.
In this recipe, we will see how to decoupling reducers that tends to grow too much.

Let's start with an example. A common pattern in Redux, when we want to store an ordered list, is "allIds, byId". Store  the entities as
an array requires to iterate over the array to find our target but store the entities as an object doesn't let us to keep 
an order. So let's use both: 

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
`byId` key stores the entity while `allIds` keeps the track of the order of our entities.

This driven us into an edge case: 
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

Now we can separate our `update functions`, the functions that update a part of the state.

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

And we finally mix all together by distibuting a part of the state to our update functions:

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
Our model seems much better and more readable.



 
