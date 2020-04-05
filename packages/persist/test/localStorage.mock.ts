const createLocalStorageMock = (): any => {
	const storage = {} as any

	return {
		getItem(key: string): string {
			return storage[key]
		},
		setItem(key: string, value: any): void {
			storage[key] = value.toString()
		},
		removeItem(key: string): void {
			delete storage[key]
		},
	}
}

// eslint-disable-next-line import/prefer-default-export
export const createAsyncStorageMock = (): any => {
	const storage = createLocalStorageMock()
	return {
		getItem: (key: string): Promise<string> => {
			return new Promise((resolve) => {
				resolve(storage.getItem(key))
			})
		},
		setItem: (key: string, item: any): Promise<void> => {
			return new Promise((resolve) => {
				resolve(storage.setItem(key, item))
			})
		},
		removeItem: (key: string): Promise<void> => {
			return new Promise((resolve) => {
				resolve(storage.removeItem(key))
			})
		},
	}
}
