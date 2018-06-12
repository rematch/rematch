import createReactNavigationPlugin from '@rematch/react-navigation'
import Routes from '../Routes'

export const { Navigator, reactNavigationPlugin } = createReactNavigationPlugin(
	{ Routes }
)
