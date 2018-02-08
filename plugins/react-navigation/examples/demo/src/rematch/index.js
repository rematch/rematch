import { init } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import * as models from './models'
import AppNavigator from '../navigators/AppNavigator'

const reactNavigation = createReactNavigationPlugin({
  AppNavigator,
  initialScreen: 'Login'
})

const store = init({
  models,
  // plugins: [reactNavigation],
})

console.log('store', store.getState())

export default store