import * as React from 'react'
import { connect } from 'react-redux'

import {
	createNavigationPropConstructor, // handles #1 above
	createNavigationReducer, // handles #2 above
	createReactNavigationReduxMiddleware, // handles #4 above
	initializeListeners, // handles #4 above
} from 'react-navigation-redux-helpers'

interface Props {
	dispatch: () => void,
	nav: any,
}

export default (Routes, sliceState) => {
	const navReducer = createNavigationReducer(Routes)
	const navMiddleware = createReactNavigationReduxMiddleware('root', state =>
		sliceState(state)
	)
	const navigationPropConstructor = createNavigationPropConstructor('root')

	class Navigator extends React.Component<Props> {
		public componentDidMount() {
			initializeListeners('root', this.props.nav)
		}
		public render() {
			const navigation = navigationPropConstructor(
				this.props.dispatch,
				this.props.nav
			)
			return <Routes navigation={navigation} />
		}
	}

	const mapToProps = state => ({
		nav: sliceState(state),
	})

	return {
		Navigator: connect(mapToProps)(Navigator),
		navReducer,
		navMiddleware,
	}
}
