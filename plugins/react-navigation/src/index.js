import { createNavigator } from './Navigator'
import { createNavReducer } from './reducer'

export default ({
  ReactNavigation, Routes, initialScreen
}) => ({
  Navigator: createNavigator({ Routes, ReactNavigation }),
  reactNavigationPlugin: {
    config: {
      redux: {
        reducers: {
          nav: createNavReducer({ Routes, initialScreen }),
        }
      }
    },
    init: ({ dispatch }) => ({
      onStoreCreated() {
        const { NavigationActions } = ReactNavigation
        dispatch.nav = {}
        dispatch.nav.navigate = (action) => dispatch(NavigationActions.navigate(action))
        dispatch.nav.reset = (action) => dispatch(NavigationActions.reset(action))
        dispatch.nav.back = (action) => dispatch(NavigationActions.back(action))
        dispatch.nav.setParams = (action) => dispatch(NavigationActions.setParams(action))
      }
    })
  }
})
