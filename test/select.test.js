beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  it('should create a valid list of selectors', () => {
    const { init, model, select } = require('../src')
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
    const { init, model, select } = require('../src')
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
    const doubled = select.a.double()
    expect(doubled).toBe(4)
  })

  it('should allow passing in of params toselector', () => {
    const { init, model, select } = require('../src')
    init()
    model({
      name: 'a',
      state: 2,
      reducers: {
        increment: s => s + 1
      },
      selectors: {
        prependWithLetter: (s, letter) => letter + s
      },
    })
    const prepended = select.a.prependWithLetter('P')
    expect(prepended).toBe('P2')
  })
})

