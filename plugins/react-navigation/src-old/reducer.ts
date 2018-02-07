export const createNavReducer = ({ Routes, initialScreen }) => {
  const actionForPath = Routes.router.getActionForPathAndParams(initialScreen)
  const initialState = Routes.router.getStateForAction(actionForPath)
  const navReducer = (state = initialState, action) => {
    // fix for routing to duplicate routes
    // see https://github.com/react-navigation/react-navigation/issues/271
    if (action.type.startsWith('Navigation/')) {
      const {routeName} = action
      const lastRoute = state.routes[state.routes.length - 1]
      if (routeName === lastRoute.routeName) {
        return state
      }
    }
    const nextState = Routes.router.getStateForAction(action, state)
    return nextState || state
  }
  return navReducer
}
