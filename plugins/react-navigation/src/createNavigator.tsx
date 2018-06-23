import { connect } from 'react-redux'
import {
	reduxifyNavigator,
	createReactNavigationReduxMiddleware,
	createNavigationReducer,
} from 'react-navigation-redux-helpers'

interface Props {
	dispatch: () => void;
	nav: any;
}

export default (Navigator, sliceState) => {
	const navReducer = createNavigationReducer(Navigator)
	const navMiddleware = createReactNavigationReduxMiddleware('root', sliceState)

	const ReduxNavigator = reduxifyNavigator(Navigator, 'root')
	const mapStateToProps = state => ({
		state: sliceState(state),
	})

	return {
		Navigator: connect(mapStateToProps)(ReduxNavigator),
		navReducer,
		navMiddleware,
	}
}
