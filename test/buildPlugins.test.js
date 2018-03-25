describe('buildPlugins:', () => {
  test('should not create a plugin with invalid "onModel"', () => {
    const buildPlugins = require('../src/utils/buildPlugins').default
    const plugin1 = {
      init: () => ({
        onModel: {},
      })
    }
    const plugins = [plugin1]
    expect(() => buildPlugins(plugins, {})).toThrow()
  })

  test('should not create a plugin with invalid "middleware"', () => {
    const buildPlugins = require('../src/utils/buildPlugins').default
    const plugin1 = {
      init: () => ({
        middleware: {},
      })
    }
    const plugins = [plugin1]
    expect(() => buildPlugins(plugins, {})).toThrow()
  })

  test('build plugins should do nothing if no plugin has "init"', () => {
    const buildPlugins = require('../src/utils/buildPlugins').default
    const plugin1 = {}
    const plugins = [plugin1]
    expect(buildPlugins(plugins, {})).toEqual([])
  })
})
