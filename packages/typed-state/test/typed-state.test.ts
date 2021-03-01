import { init } from '@rematch/core'
import T from 'prop-types'
import typedStatePlugin from '../src'

const model = {
	state: {
		name: 'Jon',
		age: 25,
	},
	reducers: {
		update: (_: any, { name, age }: { name: string; age: number }) => ({
			name,
			age,
		}),
	},
}

const typings = {
	name: T.string.isRequired,
	age: T.number.isRequired,
}

describe('typed-state:', () => {
	it('triggers one warning when one type is invalid', () => {
		global.console = {
			...global.console,
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

	it('triggers two warnings when two types are invalid', () => {
		global.console = {
			...global.console,
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

	it('does not trigger warning on valid type', () => {
		global.console = {
			...global.console,
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

	describe('strict mode', () => {
		it('triggers warning when typings config is missing', () => {
			global.console = {
				...global.console,
				warn: jest.fn(),
			}

			const user = {
				...model,
			}

			let store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						strict: false,
					}),
				],
			})
			store.dispatch.user.update({ name: 'Jane', age: 23 })
			expect(global.console.warn).toHaveBeenCalledTimes(0)
			store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						strict: true,
					}),
				],
			})
			store.dispatch.user.update({ name: 'Jane', age: 23 })
			expect(global.console.warn).toHaveBeenCalledTimes(1)
		})
	})

	describe('logSeverity config', () => {
		const user = {
			...model,
			typings,
		}
		it("logs with 'trace'", () => {
			global.console = {
				...global.console,
				trace: jest.fn(),
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'trace',
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.trace).toHaveBeenCalledTimes(1)
			expect(global.console.warn).toHaveBeenCalledTimes(0)
		})
		it("logs with 'debug'", () => {
			global.console = {
				...global.console,
				debug: jest.fn(),
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'debug',
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.debug).toHaveBeenCalledTimes(1)
			expect(global.console.warn).toHaveBeenCalledTimes(0)
		})
		it("logs with 'error'", () => {
			global.console = {
				...global.console,
				error: jest.fn(),
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'error',
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.error).toHaveBeenCalledTimes(1)
			expect(global.console.warn).toHaveBeenCalledTimes(0)
		})
		it("logs with 'warn'", () => {
			global.console = {
				...global.console,
				info: jest.fn(),
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'warn',
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.warn).toHaveBeenCalledTimes(1)
			expect(global.console.info).toHaveBeenCalledTimes(0)
		})
		it("logs with 'info'", () => {
			global.console = {
				...global.console,
				info: jest.fn(),
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'info',
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.info).toHaveBeenCalledTimes(1)
			expect(global.console.warn).toHaveBeenCalledTimes(0)
		})
		it("throws an error with 'fatal'", () => {
			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: 'fatal',
					}),
				],
			})

			expect(() =>
				store.dispatch.user.update({ name: undefined, age: 26 })
			).toThrowErrorMatchingInlineSnapshot(
				`"[rematch] The property \`name\` is marked as required in \`user\`, but its value is \`undefined\`."`
			)
		})
		it("doesn't log if severity is undefined and strict false", () => {
			global.console = {
				...global.console,
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: undefined,
						strict: false,
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.warn).toHaveBeenCalledTimes(0)
		})
		it('logs if severity is undefined but strict true', () => {
			global.console = {
				...global.console,
				warn: jest.fn(),
			}

			const store = init({
				models: { user },
				plugins: [
					typedStatePlugin({
						logSeverity: undefined,
						strict: true,
					}),
				],
			})

			store.dispatch.user.update({ name: undefined, age: 26 })
			expect(global.console.warn).toHaveBeenCalledTimes(1)
		})
	})
})
