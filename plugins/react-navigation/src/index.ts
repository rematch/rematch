import { NavigationActions, StackActions } from 'react-navigation'
import createNavigator from './createNavigator'

const reactNavigationPlugin = ({ Routes, sliceState = state => state.nav }) => {
	if (!Routes) {
		throw new Error('Rematch React Navigation requires app routes.')
	}
	if (typeof sliceState !== 'function') {
		throw new Error(
			'Rematch React Navigation requires sliceState config to be a function.'
		)
	}

	const { Navigator, navMiddleware, navReducer } = createNavigator(
		Routes,
		sliceState
	)

	return {
		Navigator,
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
				// NavigationActions
				this.dispatch.nav.navigate = action =>
					this.dispatch(NavigationActions.navigate(action))
				this.dispatch.nav.back = action =>
					this.dispatch(NavigationActions.back(action))
				this.dispatch.nav.setParams = action =>
					this.dispatch(NavigationActions.setParams(action))
				// StackActions
				this.dispatch.nav.reset = action =>
					this.dispatch(StackActions.reset(action))
				this.dispatch.nav.replace = action =>
					this.dispatch(StackActions.replace(action))
				this.dispatch.nav.push = action =>
					this.dispatch(StackActions.push(action))
				this.dispatch.nav.pop = action =>
					this.dispatch(StackActions.pop(action))
				this.dispatch.nav.popToTop = action =>
					this.dispatch(StackActions.popToTop(action))
			},
		},
	}
}

export default reactNavigationPlugin
