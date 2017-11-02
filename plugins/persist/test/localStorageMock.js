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
  global.localStorage = localStorageMock()
}

export default createLocalStorageMock
