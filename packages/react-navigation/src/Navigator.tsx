/* eslint-disable import/no-unresolved,@typescript-eslint/ban-ts-ignore */
// @ts-ignore
import * as React from 'react'
// @ts-ignore
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'

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
						// @ts-ignore
						dispatch: this.props.dispatch,
						// @ts-ignore
						state: this.props.nav,
					})}
				/>
			)
		}
	}

	const mapToProps = state => ({
		nav: sliceState(state),
	})

	return connect(mapToProps)(Navigator)
}
