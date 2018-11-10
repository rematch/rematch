import port from '@rematch/port'
import { NavigationActions } from 'react-navigation'
import createNavigator from './Navigator'
import createReduxSetup from './redux'

const reactNavigationPlugin = ({
	Routes,
	initialScreen,
	sliceState = state => state.nav,
}) => {
	if (!Routes) {
		throw new Error('Rematch React Navigation requires app routes.')
	}
	if (!initialScreen) {
		throw new Error(
			'Rematch React Navigation requires an initial screen name. For example, "Login"'
		)
	}
	if (typeof sliceState !== 'function') {
		throw new Error(
			'Rematch React Navigation requires sliceState config to be a function.'
		)
	}

	const { addListener, navMiddleware, navReducer } = createReduxSetup(
		Routes,
		initialScreen,
		sliceState
	)

	return {
		Navigator: createNavigator(Routes, addListener, sliceState),
		reactNavigationPlugin: port({
			modelName: 'nav',
			middleware: navMiddleware,
			reducer: navReducer,
			actionCreators: NavigationActions,
		}),
	}
}

export default reactNavigationPlugin
