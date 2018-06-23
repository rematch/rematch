import createReactNavigationPlugin from '@rematch/react-navigation'
import Navigator from '../Navigator'

export const {
	ConnectedNavigator,
	reactNavigationPlugin,
} = createReactNavigationPlugin({ Navigator })
