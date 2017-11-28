export const createNavReducer = ({ Routes, initialScreen }) => {
  const actionForPath = Routes.router.getActionForPathAndParams(initialScreen)
  const initialState = Routes.router.getStateForAction(actionForPath)
  const navReducer = (state = initialState, action) => {
    const nextState = Routes.router.getStateForAction(action, state)
    return nextState || state
  }
  return navReducer
}
