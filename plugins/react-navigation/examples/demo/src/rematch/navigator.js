import createReactNavigationPlugin from '@rematch/react-navigation'
import Routes from '../Routes'

console.log(createReactNavigationPlugin)

export const { Navigator, reactNavigationPlugin } = createReactNavigationPlugin({
  Routes,
  initialScreen: 'Login',
})
