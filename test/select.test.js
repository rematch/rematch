import { model, init, select } from '../src/index'
import { _store } from '../src/store'

beforeEach(() => {
  jest.resetModules()
})

describe('select:', () => {
  test('should be an object', () => {
    expect(select).toEqual({})
  })

  test('model name should be added as key', () => {
    init()

    model({
      name: 'count',
      state: 99,
      select: {
        value: state => state
      }
    })

    expect(Object.keys(select)).toEqual(['count'])
  })

  test('model selector with no args should return correct value', () => {
    init()

    model({
      name: 'count',
      state: 99,
      select: {
        value: state => state
      }
    })

    expect(select.count.value()).toEqual(99)
  })

  test('model selector with 1 arg should return correct value', () => {
    init()

    model({
      name: 'price',
      state: 10.00,
      select: {
        tax: (state, taxPercent) => state * taxPercent
      }
    })

    expect(select.price.tax(0.15)).toEqual(1.5)
  })

  test('model selector with multiple args should return correct value', () => {
    init()

    model({
      name: 'todos',
      state: [
        { id: 4, text: 'eat lunch' },
        { id: 9, text: 'eat dinner' },
        { id: 2, text: 'eat breakfast' }
      ],
      select: {
        findByKey: (state, key, value) =>
          state.find(todo => todo[key] === value)
      }
    })

    const resultA = select.todos.findByKey('id', 9)

    expect(resultA).toEqual({
      id: 9,
      text: 'eat dinner'
    })

    const resultB = select.todos.findByKey('text', 'eat lunch')

    expect(resultB).toEqual({
      id: 4,
      text: 'eat lunch'
    })

  })

  test('two selectors', () => {
    init()

    model({
      name: 'price',
      state: 10.00,
      select: {
        tax: (state, taxPercent) => state * taxPercent,
        withTax: (state, taxPercent) => state + (state * taxPercent)
      }
    })

    expect(select.price.tax(0.15)).toEqual(1.5)
    expect(select.price.withTax(0.15)).toEqual(11.50)
  })

  test('selector within a selector', () => {
    init()

    model({
      name: 'price',
      state: 10.00,
      select: {
        tax: (state, taxPercent) => state * taxPercent,
        withTax: (state, taxPercent) => select.price.tax(taxPercent) + state
      }
    })

    expect(select.price.tax(0.15)).toEqual(1.5)
    expect(select.price.withTax(0.15)).toEqual(11.50)
  })
})
