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
		reactNavigationPlugin: {
			config: {
				redux: {
					middleware: [navMiddleware],
					reducers: {
						nav: navReducer,
					},
				},
			},
			onStoreCreated() {
				this.dispatch.nav = {}
				this.dispatch.nav.navigate = action =>
					this.dispatch(NavigationActions.navigate(action))
				this.dispatch.nav.reset = action =>
					this.dispatch(NavigationActions.reset(action))
				this.dispatch.nav.back = action =>
					this.dispatch(NavigationActions.back(action))
				this.dispatch.nav.setParams = action =>
					this.dispatch(NavigationActions.setParams(action))
			},
		},
	}
}

export default reactNavigationPlugin
