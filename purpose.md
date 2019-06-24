# Purpose

Redux is an amazing state management tool, supported by a healthy middleware ecosystem and excellent devtools.

Rematch builds upon Redux by reducing boilerplate and enforcing best practices.

To clarify, Rematch removes the need for:

* declared action types
* action creators
* thunks
* store configuration
* mapDispatchToProps
* sagas

## Comparing Redux & Rematch

A comparison of Rematch & Redux may help clear things up.

### Rematch

#### 1. model

```javascript
import { init } from '@rematch/core'

const count = {
  state: 0,
  reducers: {
    upBy: (state, payload) => state + payload
  }
}

init({
  models: { count }
})
```

#### 2. View

```javascript
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count
})

const mapDispatchToProps = (dispatch) => ({
  countUpBy: dispatch.count.upBy
})

connect(mapStateToProps, mapDispatchToProps)(Component)
```

Or using hooks

```js
import { useSelector, useDispatch } from 'react-redux'

// Component

const ConnectedComponent = () => {
	const count = useSelector(state => state.count)
	const dispatch = useDispatch()

	return <Component count={count} countUpBy={dispatch.count.upBy} />
}

```

### Redux \(best practices\)

#### 1. Store

```javascript
import { createStore, combineReducers } from 'redux'
// devtools, reducers, middleware, etc.
export default createStore(reducers, initialState, enhancers)
```

#### 2. Action Type

```javascript
export const COUNT_UP_BY = 'COUNT_UP_BY'
```

#### 3. Action Creator

```javascript
import { COUNT_UP_BY } from '../types/counter'

export const countUpBy = (value) => ({
  type: COUNT_UP_BY,
  payload: value,
})
```

#### 4. Reducer

```javascript
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

#### 5. View

```javascript
import { countUpBy } from '../actions/count'
import { connect } from 'react-redux'

// Component

const mapStateToProps = (state) => ({
  count: state.count,
})

connect(mapStateToProps, { countUpBy })(Component)
```

### Scoreboard

|  | Redux | Rematch |
| :--- | :--- | :--- |
| simple setup ‎ |  | ‎✔ |
| less boilerplate |  | ‎✔ |
| readability |  | ‎✔ |
| configurable | ‎✔ | ‎✔ |
| redux devtools | ‎✔ | ‎✔ |
| generated action creators | ‎ | ‎✔ |
| async | thunks | ‎async/await |

