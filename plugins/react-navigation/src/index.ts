import { NavigationActions, StackActions } from 'react-navigation'
import createNavigator from './createNavigator'

const reactNavigationPlugin = ({
	Navigator,
	storeKey = 'nav',
	sliceState = state => state.nav,
}) => {
	if (!Navigator) {
		throw new Error(
			'Rematch React Navigation requires a preconfigured Navigator.'
		)
	}
	if (typeof sliceState !== 'function') {
		throw new Error(
			'Rematch React Navigation requires sliceState config to be a function.'
		)
	}
	if (typeof storeKey !== 'string') {
		throw new Error(
			'Rematch React Navigation requires storeKey config to be a string.'
		)
	}

	const { ConnectedNavigator, navMiddleware, navReducer } = createNavigator(
		Navigator,
		sliceState
	)

	const effects = dispatch => ({
		// NavigationActions
		navigate(action) {
			return dispatch(NavigationActions.navigate(action))
		},

		back(action) {
			return dispatch(NavigationActions.back(action))
		},

		setParams(action) {
			return dispatch(NavigationActions.setParams(action))
		},

		// StackActions
		reset(action) {
			return dispatch(StackActions.reset(action))
		},
		replace(action) {
			return dispatch(StackActions.replace(action))
		},

		push(action) {
			return dispatch(StackActions.push(action))
		},

		pop(action) {
			return dispatch(StackActions.pop(action))
		},

		popToTop(action) {
			return dispatch(StackActions.popToTop(action))
		},
	})

	return {
		Navigator: ConnectedNavigator,
		reactNavigationPlugin: {
			config: {
				models: {
					[storeKey]: {
						state: null,
						effects,
					},
				},
				redux: {
					middleware: [navMiddleware],
					reducers: {
						nav: navReducer,
					},
				},
			},
		},
	}
}

export default reactNavigationPlugin
