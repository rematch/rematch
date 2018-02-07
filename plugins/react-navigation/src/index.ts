import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers'
import { createNavigator } from './Navigator'

interface Params {
  AppNavigator: any,
  initialScreen: string,
}

const reactNavigationPlugin = ({
  AppNavigator, initialScreen,
}: Params) => {
  const { router } = AppNavigator
  const initialState = router.getStateForAction(router.getActionForPathAndParams(initialScreen))

  // reducer
  const navReducer = (state = initialState, action) => {
    const nextState = router.getStateForAction(action, state)
    // Simply return the original `state` if `nextState` is null or undefined.
    return nextState || state
  }

  // middleware
  const navMiddleware = createReactNavigationReduxMiddleware(
    'root',
    (state) => state.nav,
  )
  const addListener = createReduxBoundAddListener('root')

  const Navigator = createNavigator({ AppNavigator, addListener })

  return {
    config: {
      redux: {
        middleware: [navMiddleware],
        reducers: {
          nav: navReducer,
        },
      },
    },
    // init: ({ dispatch }) => ({
    //   onStoreCreated() {
    //     const { NavigationActions } = ReactNavigation
    //       dispatch.nav = {}
    //       dispatch.nav.navigate = (action) => dispatch(NavigationActions.navigate(action))
    //       dispatch.nav.reset = (action) => dispatch(NavigationActions.reset(action))
    //       dispatch.nav.back = (action) => dispatch(NavigationActions.back(action))
    //       dispatch.nav.setParams = (action) => dispatch(NavigationActions.setParams(action))
    //   },
    // }),
  }
}

export default reactNavigationPlugin
