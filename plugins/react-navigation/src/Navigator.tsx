/* eslint-disable react/jsx-filename-extension */
import * as React from 'react'
import { addNavigationHelpers } from 'react-navigation'
import { connect } from 'react-redux'

type Props = {
	dispatch: () => void
	nav: any
}

export default (Routes, addListener, sliceState) => {
	class Navigator extends React.Component<Props> {
		public render() {
			return (
				<Routes
					navigation={addNavigationHelpers({
						addListener,
						dispatch: this.props.dispatch,
						state: this.props.nav,
					})}
				/>
			)
		}
	}

	const mapToProps = (state, props) => ({
		nav: sliceState(state),
	})

	return connect(mapToProps)(Navigator)
}
