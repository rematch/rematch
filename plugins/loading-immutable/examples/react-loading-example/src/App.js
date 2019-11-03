import React from 'react'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'
import Spinner from 'react-spinkit'

const styles = {
	page: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	container: {
		border: '1px solid black',
		backgroundColor: 'lightYellow',
		padding: '1rem',
		width: '15rem',
		height: '18rem',
		display: 'flex',
		justifyContent: 'space-around',
		flexDirection: 'column',
	},
	loading: {
		height: '5rem',
	},
}

const Loading = ({ label, show }) => (
	<div style={styles.loading}>
		<p>
			{label} = <strong>{show.toString()}</strong>
		</p>
		{show && <Spinner name="line-scale" color="black" />}
	</div>
)

const App = ({ submit, loading }) => (
	<div style={styles.page}>
		<button onClick={submit}>Submit Async</button>
		<div style={styles.container}>
			<Loading label="loading.global" show={loading.global > 0} />
			<Loading label="loading.models.form" show={loading.model > 0} />
			<Loading label="loading.effects.form.submit" show={loading.effect > 0} />
		</div>
	</div>
)

const mapState = state => ({
	count: state.example,
	loading: {
		global: state.loading.global,
		model: state.loading.models.example,
		effect: state.loading.effects.example.submit,
	},
	submit: dispatch.example.submit,
})

export default connect(mapState)(App)
