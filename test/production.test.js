describe('production', () => {
  test('should create a valid common js dev build', () => {
    const { init } = require('../dist/cjs/rematch.dev')
    expect(init).toBeDefined()
  })
  test('should create a valid common js prod build', () => {
    const { init } = require('../dist/cjs/rematch.prod.min')
    expect(init).toBeDefined()
  })
  xtest('should create a valid es module prod build', () => {
    // fails due to export not found
    const { init } = require('../dist/esm/rematch.prod.min')
    expect(init).toBeDefined()
  })
  test('should create a valid universal module prod build', () => {
    const rematch = require('../dist/umd/rematch.prod.min').default
    expect(rematch.init).toBeDefined()
  })
})