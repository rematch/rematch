// Test for internal store
import { select, createSelectors } from '../src/select'

beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should be an object', () => {
    expect(select).toEqual({})
  })
})

describe('createSelectors:', () => {
  it('should populate "select" with selectors in the correct namespace', () => {
    const model = ({
      name: 'app',
      selectors: {
        selectorWithNoArg: state => state,
        selectorWithArg: (state, arg) => state + arg
      }
    })

    createSelectors(model)

    expect(select).toHaveProperty('app')
    expect(select).toHaveProperty('app.selectorWithNoArg')
    expect(select.app.selectorWithNoArg(1)).toEqual(1)
    expect(select.app.selectorWithArg(1, 1)).toEqual(2)
  })
})
