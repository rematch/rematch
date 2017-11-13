import { createNavigator } from './Navigator'
import { createNavReducer } from './reducer'
import { createNavigationDispatch } from './dispatch'

export default (ReactNavigation, Routes, initialScreen = 'Landing') => {
  createNavigationDispatch(ReactNavigation)
  return {
    Navigator: createNavigator(Routes, ReactNavigation),
    reactNavigationPlugin: {
      config: {
        extraReducers: {
          nav: createNavReducer(Routes, initialScreen),
        }
      }
    }
  }
}
