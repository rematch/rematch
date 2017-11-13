
import { dispatch } from '@rematch/core'

export const createNavigationDispatch = (ReactNavigation) => {
  dispatch.nav = {}
  dispatch.nav.navigate = (action) => dispatch(ReactNavigation.NavigationActions.navigate(action))
  dispatch.nav.reset = (action) => dispatch(ReactNavigation.NavigationActions.reset(action))
  dispatch.nav.back = (action) => dispatch(ReactNavigation.NavigationActions.back(action))
  dispatch.nav.setParams = (action) => dispatch(ReactNavigation.NavigationActions.setParams(action))
}
