import React from 'react'
import { connect } from 'react-redux'

const App = ({ count, asyncIncrement, increment }) => (
	<div>
		<h2>
			count is <b style={{ backgroundColor: '#ccc' }}>{count}</b>
		</h2>

		<h2>
			<button onClick={increment}>Increment count</button>{' '}
			<em style={{ backgroundColor: 'yellow' }}>(normal dispatch)</em>
		</h2>

		<h2>
			<button onClick={asyncIncrement}>
				Increment count (delayed 1 second)
			</button>{' '}
			<em style={{ backgroundColor: 'yellow' }}>(an async effect!!!)</em>
		</h2>
	</div>
)

const mapState = state => ({
	count: state.count,
})

const mapDispatch = dispatch => ({
	increment: dispatch.count.increment,
	asyncIncrement: dispatch.count.asyncIncrement,
})

export default connect(
	mapState,
	mapDispatch
)(App)
