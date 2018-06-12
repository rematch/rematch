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
			onStoreCreated: store => {
				store.dispatch.nav = {}
				// NavigationActions
				store.dispatch.nav.navigate = action =>
					store.dispatch(NavigationActions.navigate(action))
				store.dispatch.nav.back = action =>
					store.dispatch(NavigationActions.back(action))
				store.dispatch.nav.setParams = action =>
					store.dispatch(NavigationActions.setParams(action))
				// StackActions
				store.dispatch.nav.reset = action =>
					store.dispatch(StackActions.reset(action))
				store.dispatch.nav.replace = action =>
					store.dispatch(StackActions.replace(action))
				store.dispatch.nav.push = action =>
					store.dispatch(StackActions.push(action))
				store.dispatch.nav.pop = action =>
					store.dispatch(StackActions.pop(action))
				store.dispatch.nav.popToTop = action =>
					store.dispatch(StackActions.popToTop(action))
			},
		},
	}
}

export default reactNavigationPlugin
