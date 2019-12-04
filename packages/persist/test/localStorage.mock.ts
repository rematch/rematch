/* eslint-disable @typescript-eslint/ban-ts-ignore,@typescript-eslint/explicit-function-return-type */

const getStorageMock = () => {
	const storage = {}

	return {
		getItem(key) {
			return storage[key]
		},
		setItem(key, value) {
			storage[key] = value.toString()
		},
		// clear() {
		//   storage = {}
		// },
		removeItem(key) {
			delete storage[key]
		},
	}
}

export function createLocalStorageMock() {
	// @ts-ignore
	global.localStorage = getStorageMock()
}

export function createAsyncStorageMock() {
	const storage = getStorageMock()
	return {
		getItem: key => {
			return new Promise(resolve => {
				resolve(storage.getItem(key))
			})
		},
		setItem: (key, item) => {
			return new Promise(resolve => {
				resolve(storage.setItem(key, item))
			})
		},
		removeItem: key => {
			return new Promise(resolve => {
				resolve(storage.removeItem(key))
			})
		},
	}
}
