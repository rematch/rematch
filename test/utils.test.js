beforeEach(() => {
  jest.resetModules()
})

describe('deprecate', ()=> {
  const {stub} = require('sinon')
  const module = require('../src/utils/deprecate')
  const deprecate = module.default

  it('should call console.warn when process.env.NODE_ENV is not production', ()=> {
      const warn = stub(console, 'warn')
      const cache = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      deprecate('warning')

      expect(warn.called).toBe(true)

      warn.restore()
      process.env.NODE_ENV = cache
  })
  it('should not call console.warn when process.env.NODE_ENV is production', ()=> {
      const warn = stub(console, 'warn')
      const cache = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      deprecate('warning')

      expect(warn.called).toBe(false)

      warn.restore()
      process.env.NODE_ENV = cache
  })
})
