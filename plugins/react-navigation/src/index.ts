import { RematchStore } from '@rematch/core'
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

	const effects = {
		...NavigationActions,
		...StackActions,
	}

	const selectors = {
		currentRouteName() {
			return state => {
				const nav = state[storeKey]
				return nav.routes[nav.index].routeName
			}
		},
	}

	return {
		ConnectedNavigator,
		reactNavigationPlugin: {
			middleware: navMiddleware,
			config: {
				models: {
					[storeKey]: {
						baseReducer: navReducer,
						effects,
						selectors,
					},
				},
			},
		},
	}
}

export default reactNavigationPlugin
