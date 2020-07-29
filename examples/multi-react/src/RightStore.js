import React from 'react'
import { init } from '@rematch/core'
import Counter from './Counter'

const count = {
	state: 0,
	reducers: {
		increment(state) {
			return state + 1
		},
	},
}

export const store = init({
	name: 'right',
	models: {
		count,
	},
})

export default class Right extends React.Component {
	render() {
		return <Counter store={store} />
	}
}
