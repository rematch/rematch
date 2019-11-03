import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'

const App = ({ count, asyncIncrement, lastUpdated }) => (
	<div>
		<h2>
			count is <b style={{ backgroundColor: '#ccc' }}>{count}</b>
		</h2>

		<h2>
			<button onClick={asyncIncrement}>
				Increment count (delayed 1 second)
			</button>{' '}
			<em style={{ backgroundColor: 'yellow' }}>(an async effect!!!)</em>
		</h2>

		<p>{lastUpdated && moment(lastUpdated).format('LLLL')}</p>
	</div>
)

const mapState = state => ({
	count: state.count,
	lastUpdated: state.updated.count.asyncIncrement,
})

const mapDispatch = dispatch => ({
	asyncIncrement: dispatch.count.asyncIncrement,
})

export default connect(
	mapState,
	mapDispatch
)(App)
