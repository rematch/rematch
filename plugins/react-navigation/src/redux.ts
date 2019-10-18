import {
	createReactNavigationReduxMiddleware,
	createReduxBoundAddListener,
} from 'react-navigation-redux-helpers'

export default (Routes, initialScreen, sliceState): any => {
	const { router } = Routes
	const initialState = router.getStateForAction(
		router.getActionForPathAndParams(initialScreen)
	)

	// reducer
	const navReducer = (state = initialState, action) => {
		const nextState = router.getStateForAction(action, state)
		// Simply return the original `state` if `nextState` is null or undefined.
		return nextState || state
	}

	// middleware
	const navMiddleware = createReactNavigationReduxMiddleware('root', state =>
		sliceState(state)
	)

	const addListener = createReduxBoundAddListener('root')

	return {
		addListener,
		navMiddleware,
		navReducer,
	}
}
