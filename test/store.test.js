// Test for global exported store object
import { init } from '../src/index'
import { store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('init', () => {
  it('should create a redux store', () => {
    init()

    expect(store.getState()).toEqual({})
  })
})
