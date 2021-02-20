import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'

import { GlobalApp } from './GlobalApp'
import { store } from './store'
import { cart } from './models/cart'

const TestingProvider: React.FC = ({ children }) => (
	<Provider store={store}>{children}</Provider>
)

test('Application is rendered correctly', () => {
	const { container } = render(<GlobalApp />, { wrapper: TestingProvider })
	expect(container).toMatchSnapshot()
})

test('Store is correctly initialized', () => {
	render(<GlobalApp />, { wrapper: TestingProvider })
	expect(store.getState()).toEqual({
		_persist: {
			rehydrated: true,
			version: -1,
		},
		cart: {
			taxPercent: 8,
			items: [
				{ name: 'apple', value: 1.2 },
				{ name: 'orange', value: 0.95 },
			],
		},
		loading: {
			effects: {
				cart: {},
				players: {},
				settings: {},
				updated: {},
			},
			global: false,
			models: {
				cart: false,
				players: false,
				settings: false,
				updated: false,
			},
		},
		players: {
			players: [],
		},
		settings: {
			isLightThemeOn: true,
		},
		updated: {
			cart: {},
			loading: {},
			players: {},
			settings: {},
		},
	})
})
