import { init } from '@rematch/core'
import createReactNavigationPlugin from '@rematch/react-navigation'
import AppNavigator from '../navigators'

const reactNavigation = createReactNavigationPlugin({
  AppNavigator,
  initialScreen: 'Landing'
})

const store = init({
  plugins: [reactNavigation],
})

console.log('store', store)

export default store