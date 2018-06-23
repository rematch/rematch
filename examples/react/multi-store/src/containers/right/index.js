import React from 'react'
import store from './store'
import Counter from '../../components/Counter'

export default class Right extends React.Component {
	render() {
		return <Counter store={store} />
	}
}
