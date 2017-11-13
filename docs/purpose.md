# Purpose

Redux is an amazing state management tool, supported by a healthy middleware ecosystem and excellent devtools. 

Rematch builds upon Redux by reducing boilerplate and enforcing best practices. 

To clarify, Rematch removes the need for:
- declared action types
- action creators
- thunks
- store configuration
- mapDispatchToProps
- sagas

## Comparing Redux & Rematch

A comparison of Rematch & Redux may help clear things up.

### Rematch

##### 1. model
```js
import { init } from '@rematch/core'

const count = {
  name: 'count',
  state: 0,
  reducers: {
    upBy: (state, payload) => state + payload
  }
}

init({
  models: { count }
})

```

##### 2. view
```js
import { dispatch } from '@rematch/core'
import { connect } from 'react-redux'

// Component

const mapToProps = (state) => ({
  count: state.count,
  countUpBy: dispatch.count.upBy,
})

connect(mapToProps)(Component)
```

### Redux (best practices)

##### 1. Store
```js
import { createStore, combineReducers } from 'redux'
// devtools, reducers, middleware, etc.
export default createStore(reducers, initialState, enhancers)
```

##### 2. Action Type
```js
export const COUNT_UP_BY = 'COUNT_UP_BY'
```

##### 3. Action Creator
```js
import { COUNT_UP_BY } from '../types/counter'

export const countUpBy = (value) => ({
  type: COUNT_UP_BY,
  payload: value,
})
```

##### 4. Reducer
```js
import { COUNT_UP_BY } from '../types/counter'

const initialState = 0

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNT_UP_BY:
      return state + action.payload
    default: return state
  }
}
```

##### 5. View
```js
import { countUpBy } from '../actions/count'
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count,
})

const mapDispatchToProps = dispatch => ({
  countUpBy(payload) {
    dispatch(countUpBy(payload))
  },
})

connect(mapStateToProps, mapDispatchToProps)(Component)
```

### Scoreboard

|   | Redux  | Rematch  |
|---|---|---|
| simple setup ‎ |   |  ‎✔	 |
| less boilerplate |   | ‎✔	 |
| readability  |   | ‎✔	|
| configurable | ‎✔  |  ‎✔	 |
| redux devtools  | ‎✔  |  ‎✔	 |
| generated action creators | ‎  |  ‎✔	 |
| global dispatch | ‎  |  ‎✔	 |
| selectors | ‎  |  ‎✔	 |
| action listeners | custom ‎middleware  |  ‎✔	 |
| async | thunks | ‎async/await  |
