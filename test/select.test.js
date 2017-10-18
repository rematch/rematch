// Test for internal store
import { init, model, select, getStore } from '../src'

beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should create a valid list of selectors', () => {
    init()
    model({
      name: 'a',
      state: 0,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    })
    expect(typeof select.a.double).toBe('function')
  })

  it('should allow access to the selector', () => {
    init()
    model({
      name: 'a',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        double: s => s * 2
      },
    })
    const doubled = select.a.double(getStore().getState())
    expect(doubled).toBe(4)
  })
})

