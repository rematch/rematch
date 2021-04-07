import * as React from 'react'
import { connect } from 'react-redux'
import { RootState, Dispatch } from './store'

const mapState = (state: RootState) => ({
	dolphins: state.dolphins,
	sharks: state.sharks,
})

const mapDispatch = (dispatch: Dispatch) => ({
	incrementDolphins: () => dispatch.dolphins.increment(1),
	incrementDolphinsAsync: dispatch.dolphins.incrementAsync,
	incrementSharks: () => dispatch.sharks.increment(1),
	incrementSharksAsync: () => dispatch.sharks.incrementAsync(1),
	incrementSharksAsync2: () =>
		dispatch({ type: 'sharks/incrementAsync', payload: 2 }),
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>
type Props = StateProps & DispatchProps

class Count extends React.Component<Props> {
	render() {
		return (
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div style={{ width: 120 }}>
					<h3>Dolphins</h3>
					<h1>{this.props.dolphins}</h1>
					<button onClick={this.props.incrementDolphins}>+1</button>
					<button onClick={this.props.incrementDolphinsAsync}>Async +1</button>
				</div>
				<div style={{ width: 200 }}>
					<h3>Sharks</h3>
					<h1>{this.props.sharks}</h1>
					<button onClick={this.props.incrementSharks}>+1</button>
					<button onClick={this.props.incrementSharksAsync}>Async +1</button>
					<button onClick={this.props.incrementSharksAsync2}>Async +2</button>
				</div>
				<p>Using Rematch Models</p>
			</div>
		)
	}
}

export default connect(mapState, mapDispatch)(Count)
