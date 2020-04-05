import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState, Dispatch } from './store'

const Count = () => {
	const dolphins = useSelector((state: RootState) => state.dolphins)
	const sharks = useSelector((state: RootState) => state.sharks)
	const dispatch = useDispatch<Dispatch>()

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			<div style={{ width: 120 }}>
				<h3>Dolphins</h3>
				<h1>{dolphins}</h1>
				<button onClick={dispatch.dolphins.increment}>+1</button>
				<button onClick={dispatch.dolphins.incrementAsync}>Async +1</button>
			</div>
			<div style={{ width: 200 }}>
				<h3>Sharks</h3>
				<h1>{sharks}</h1>
				<button onClick={() => dispatch.sharks.increment(1)}>+1</button>
				<button onClick={() => dispatch.sharks.incrementAsync(1)}>
					Async +1
				</button>
				<button
					onClick={() =>
						dispatch({ type: 'sharks/incrementAsync', payload: 2 })
					}
				>
					Async +2
				</button>
			</div>
			<p>Using Rematch Models</p>
		</div>
	)
}

export default Count
