
import createNavigator from './Navigator'
import createReduxSetup from './redux'

interface Params {
  AppNavigator: any,
  initialScreen: string,
}

const reactNavigationPlugin = (AppNavigator, initialScreen) => {

  const { addListener, navMiddleware, navReducer } = createReduxSetup(AppNavigator, initialScreen)
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
