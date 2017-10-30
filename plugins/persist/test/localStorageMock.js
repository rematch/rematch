const localStorageMock = () => {
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
    }
  }
}

const createLocalStorageMock = () => {
  Object.defineProperty(global, 'localStorage', { value: localStorageMock() })
}

export default createLocalStorageMock
