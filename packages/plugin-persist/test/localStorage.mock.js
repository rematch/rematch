const storage = {}

const localStorageMock = () => {
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

module.exports = function createWebStorage(type) {
  global.localStorage = localStorageMock()
  return {
    getItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(storage.getItem(key))
      })
    },
    setItem: (key, item) => {
      return new Promise((resolve, reject) => {
        resolve(storage.setItem(key, item))
      })
    },
    removeItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(storage.removeItem(key))
      })
    },
  }
}