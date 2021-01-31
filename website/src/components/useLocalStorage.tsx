/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
// https://github.com/streamich/react-use/blob/master/src/useLocalStorage.ts
import { useState, useCallback, Dispatch, SetStateAction } from 'react'

type ParserOptions<T> = {
	raw: boolean
	serializer: (value: T) => string
	deserializer: (value: string) => T
}

function useLocalStorage<T>(
	key: string,
	initialValue?: T,
	options?: ParserOptions<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
	if (!key) {
		throw new Error('useLocalStorage key may not be falsy')
	}

	const deserializer = options
		? options.raw
			? (value) => value
			: options.deserializer
		: JSON.parse

	const [state, setState] = useState<T | undefined>(() => {
		try {
			const serializer = options
				? options.raw
					? String
					: options.serializer
				: JSON.stringify

			const localStorageValue = localStorage.getItem(key)
			if (localStorageValue !== null) {
				return deserializer(localStorageValue)
			}
			initialValue && localStorage.setItem(key, serializer(initialValue))
			return initialValue
		} catch {
			// If user is in private mode or has storage restriction
			// localStorage can throw. JSON.parse and JSON.stringify
			// can throw, too.
			return initialValue
		}
	})

	const set: Dispatch<SetStateAction<T | undefined>> = useCallback(
		(valOrFunc) => {
			try {
				const newState =
					typeof valOrFunc === 'function'
						? (valOrFunc as Function)(state)
						: valOrFunc
				if (typeof newState === 'undefined') {
					return
				}
				let value: string

				if (options) {
					if (options.raw) {
						if (typeof newState === 'string') {
							value = newState
						} else {
							value = JSON.stringify(newState)
						}
					} else if (options.serializer) {
						value = options.serializer(newState)
					} else {
						value = JSON.stringify(newState)
					}
				} else {
					value = JSON.stringify(newState)
				}

				localStorage.setItem(key, value)
				setState(deserializer(value))
			} catch {
				// If user is in private mode or has storage restriction
				// localStorage can throw. Also JSON.stringify can throw.
			}
		},
		[key, setState]
	)

	const remove = useCallback(() => {
		try {
			localStorage.removeItem(key)
			setState(undefined)
		} catch {
			// If user is in private mode or has storage restriction
			// localStorage can throw.
		}
	}, [key, setState])

	return [state, set, remove]
}

export default useLocalStorage
