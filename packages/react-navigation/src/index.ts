/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NavigationActions } from 'react-navigation'
import createNavigator from './Navigator'
import createReduxSetup from './redux'

const reactNavigationPlugin = ({
  Routes,
  initialScreen,
  sliceState = state => state.nav,
}) => {
  if (!Routes) {
    throw new Error('Rematch React Navigation requires app routes.')
  }
  if (!initialScreen) {
    throw new Error(
      'Rematch React Navigation requires an initial screen name. For example, "Login"'
    )
  }
  if (typeof sliceState !== 'function') {
    throw new Error(
      'Rematch React Navigation requires sliceState config to be a function.'
    )
  }

  const { addListener, navMiddleware, navReducer } = createReduxSetup(
    Routes,
    initialScreen,
    sliceState
  )

  return {
    Navigator: createNavigator(Routes, addListener, sliceState),
    reactNavigationPlugin: {
      config: {
        redux: {
          middleware: [navMiddleware],
          reducers: {
            nav: navReducer,
          },
        },
      },
      onStoreCreated(_store, rematch): void {
        rematch.dispatch.nav = {}
        rematch.dispatch.nav.navigate = action =>
          rematch.dispatch(NavigationActions.navigate(action))
        rematch.dispatch.nav.reset = action =>
          rematch.dispatch(NavigationActions.reset(action))
        rematch.dispatch.nav.back = action =>
          rematch.dispatch(NavigationActions.back(action))
        rematch.dispatch.nav.setParams = action =>
          rematch.dispatch(NavigationActions.setParams(action))
      },
    },
  }
}

export default reactNavigationPlugin
