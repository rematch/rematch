const { init } = require('../src')

beforeEach(() => {
  jest.resetModules()
})

describe('init:', () => {
  test('no params should create store with state `{}`', () => {
    const store = init()

    expect(store.getState()).toEqual({})
  })

  test('should create models', () => {
    const store = init({
      models: {
        app: {
          state: 'Hello, model 1',
        },
        app2: {
          state: 'Hello, model 2',
        },
      }
    })

    expect(store.getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2'
    })
  })

  test('should allow both init models & model models', () => {
    const store = init({
      models: {
        app: {
          state: 'Hello, model 1',
        },
      }
    })

    store.model({
      name: 'app2',
      state: 'Hello, model 2',
    })

    expect(store.getState()).toEqual({
      app: 'Hello, model 1',
      app2: 'Hello, model 2'
    })
  })

  test('should throw if models are not an object', () => {
    const model = {
      name: 'app',
      state: 'Hello, world',
    }

    expect(() => init({
      models: [model]
    })).toThrow()
  })

  test('init() & one model of state type `string`', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
    })
  })

  test('init() & one model of state type `number`', () => {
    const store = init()

    store.model({
      name: 'count',
      state: 99,
    })

    expect(store.getState()).toEqual({
      count: 99,
    })
  })

  test('init() & one model of state is 0', () => {
    const store = init()

    store.model({
      name: 'count',
      state: 0,
    })

    expect(store.getState()).toEqual({
      count: 0,
    })
  })

  test('init() & one model of state type `object`', () => {
    const store = init()

    store.model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })

    expect(store.getState()).toEqual({
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
  test('init() & two models', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
    })

    store.model({
      name: 'count',
      state: 99,
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
      count: 99,
    })
  })

  test('init() & three models', () => {
    const store = init()

    store.model({
      name: 'app',
      state: 'Hello, world',
    })

    store.model({
      name: 'count',
      state: 99,
    })

    store.model({
      name: 'todos',
      state: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })

    expect(store.getState()).toEqual({
      app: 'Hello, world',
      count: 99,
      todos: {
        abc: {
          text: 'PRty down',
          done: true,
        },
      },
    })
  })
  test('should not validate if production', () => {
    process.env.NODE_ENV = 'production'
    
    const model = {
      name: 'app',
      state: 'Hello, world',
    }

    expect(() => init({
      models: [model]
    })).not.toThrow()
  })
})
