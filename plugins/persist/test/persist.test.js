/* eslint-disable no-undef */

beforeEach(() => {
  const localStorageMock = (() => {
    let storage = {}
    return {
      getItem(key) {
        return storage[key]
      },
      setItem(key, value) {
        storage[key] = value.toString()
      },
      clear() {
        storage = {}
      },
      removeItem(key) {
        delete storage[key]
      }
    }
  })()
  Object.defineProperty(global, 'localStorage', { value: localStorageMock })
})

describe('persist', () => {
  test('local storage mock should work', () => {
    localStorage.setItem('key', 42)
    expect(localStorage.getItem('key')).toBe('42')
    localStorage.removeItem('key')
    expect(localStorage.getItem('key')).toBe(undefined)
  })
})
