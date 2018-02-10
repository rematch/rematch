import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers'

export default (Routes, initialScreen) => {
  const { router } = Routes
  const initialState = router.getStateForAction(router.getActionForPathAndParams(initialScreen))

  // reducer
  const navReducer = (state = initialState, action) => {
    const nextState = router.getStateForAction(action, state)
    console.log(state, nextState)
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state
  }

  // middleware
  const navMiddleware = createReactNavigationReduxMiddleware(
    'root',
    (state) => state.nav,
  )

  const addListener = createReduxBoundAddListener('root')

  return {
    addListener,
    navMiddleware,
    navReducer,
  }
}
