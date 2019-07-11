import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { RootState, RootDispatch } from './store'

const mapState = (state: RootState) => ({
	dolphins: state.dolphins,
	sharks: state.sharks,
})

const mapDispatch = (dispatch: RootDispatch) => ({
	incrementDolphins: () => dispatch.dolphins.increment(),
	incrementDolphinsAsync: () => dispatch.dolphins.incrementAsync(),
	incrementSharks: () => dispatch.sharks.increment(1),
	incrementSharksAsync: () => dispatch.sharks.incrementAsync(1),
	incrementSharksAsync2: () => dispatch.sharks.incrementAsync(2),
})

export default function Count() {
	const { dolphins, sharks } = useSelector(mapState)
	const dispatch: RootDispatch = useDispatch()
	const {
		incrementDolphins,
		incrementDolphinsAsync,
		incrementSharks,
		incrementSharksAsync,
		incrementSharksAsync2,
	} = mapDispatch(dispatch)

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<div style={{ width: 120 }}>
				<h3>Dolphins</h3>
				<h1>{dolphins}</h1>
				<button onClick={() => incrementDolphins}>+1</button>
				<button onClick={incrementDolphinsAsync}>Async +1</button>
			</div>
			<div style={{ width: 200 }}>
				<h3>Sharks</h3>
				<h1>{sharks}</h1>
				<button onClick={incrementSharks}>+1</button>
				<button onClick={incrementSharksAsync}>Async +1</button>
				<button onClick={incrementSharksAsync2}>Async +2</button>
			</div>
			<p>Using Rematch Models</p>
		</div>
	)
}
