import { init } from '@rematch/core'
import createReactNavigationPlugin from '../rematch-navigation'
import * as models from './models'
import Routes from '../Routes'
import { NavigationActions } from 'react-navigation'

export const { Navigator, reactNavigationPlugin } = createReactNavigationPlugin({
  Routes,
  initialScreen: 'Login',
  NavigationActions,
})

const store = init({
  models,
  plugins: [reactNavigationPlugin],
})

export default store