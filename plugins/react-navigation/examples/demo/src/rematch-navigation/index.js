
import { NavigationActions } from 'react-navigation'
import createNavigator from './Navigator'
import createReduxSetup from './redux'

const reactNavigationPlugin = ({ Routes, initialScreen }) => {
  const { addListener, navMiddleware, navReducer } = createReduxSetup(Routes, initialScreen)

  return {
    Navigator: createNavigator(Routes, addListener),
    reactNavigationPlugin: {
      config: {
        redux: {
          middleware: [navMiddleware],
          reducers: {
            nav: navReducer,
          },
        },
      },
      init: ({ dispatch }) => ({
        onStoreCreated() {
          dispatch.nav = {}
          dispatch.nav.navigate = (action) => dispatch(NavigationActions.navigate(action))
          dispatch.nav.reset = (action) => dispatch(NavigationActions.reset(action))
          dispatch.nav.back = (action) => dispatch(NavigationActions.back(action))
          dispatch.nav.setParams = (action) => dispatch(NavigationActions.setParams(action))
        }
      }),
    }
  }
}

export default reactNavigationPlugin
