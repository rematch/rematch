describe('deprecate', ()=> {
  const module = require('../src/utils/deprecate')
  const deprecate = module.default

  it('should call console.warn when process.env.NODE_ENV is not production', ()=> {
      const warn = jest.spyOn(console, 'warn')
      const cache = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      deprecate('warning')
      expect(warn).toHaveBeenCalled()

      warn.mockReset();
      warn.mockRestore();
      process.env.NODE_ENV = cache
  })
  it('should not call console.warn when process.env.NODE_ENV is production', ()=> {
    const warn = jest.spyOn(console, 'warn')
    const cache = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    deprecate('warning')
    expect(warn).not.toHaveBeenCalled()

    warn.mockReset();
    warn.mockRestore();
    process.env.NODE_ENV = cache
  })
})
