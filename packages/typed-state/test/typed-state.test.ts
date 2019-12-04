/* eslint-disable @typescript-eslint/ban-ts-ignore */
import T from 'prop-types'
import { init } from '@rematch/core'
import typedStatePlugin from '../src'

const model = {
	state: {
		name: 'Jon',
		age: 25,
	},
	reducers: {
		update: (_state, { name, age }) => ({
			name,
			age,
		}),
	},
}

const typings = {
	name: T.string.isRequired,
	age: T.number.isRequired,
}

describe('typings:', () => {
	test('triggers one warning when one type is invalid', () => {
		// @ts-ignore
		global.console = {
			warn: jest.fn(),
		}

		const user = {
			...model,
			typings,
		}

		const store = init({
			models: { user },
			plugins: [typedStatePlugin()],
		})

		store.dispatch.user.update({ name: undefined, age: 26 })
		expect(global.console.warn).toHaveBeenCalledTimes(1)
	})

	test('triggers two warnings when two types are invalid', () => {
		// @ts-ignore
		global.console = {
			warn: jest.fn(),
		}

		const user = {
			...model,
			typings,
		}

		const store = init({
			models: { user },
			plugins: [typedStatePlugin()],
		})

		store.dispatch.user.update({ name: undefined, age: '26' })
		expect(global.console.warn).toHaveBeenCalledTimes(2)
	})

	test('does not trigger warning on valid type', () => {
		// @ts-ignore
		global.console = {
			warn: jest.fn(),
		}

		const user = {
			...model,
			typings,
		}

		const store = init({
			models: { user },
			plugins: [typedStatePlugin()],
		})

		store.dispatch.user.update({ name: 'Jane', age: 23 })
		expect(global.console.warn).toHaveBeenCalledTimes(0)
	})

	test('triggers warning when typings config is missing', () => {
		// @ts-ignore
		global.console = {
			warn: jest.fn(),
		}

		const user = {
			...model,
		}

		const store = init({
			models: { user },
			plugins: [typedStatePlugin()],
		})

		store.dispatch.user.update({ name: 'Jane', age: 23 })
		expect(global.console.warn).toHaveBeenCalledTimes(1)
	})
})
