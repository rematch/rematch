const rematch = require('@rematch/core');
const immerPlugin = require('../src').default
const init = rematch.init;

/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
beforeEach(() => {
  jest.resetModules()
})

describe('immer', () => {
  test('should load the immer plugin with a basic literal', () => {
    const count = {
      state: 0,
      reducers: {
        add(state) {
          state += 1
          return state;
        }
      }
    };

    const store = init({
      plugins: [immerPlugin()],
      models: { count },
    });
    store.dispatch({ type: 'count/add' });

    expect(store.getState()).toEqual({
      count: 1,
    });
  });

  test('should load the immer plugin with a object condition', () => {
    const todo = {
      state: [{
        todo: "Learn typescript",
        done: true
      }, {
        todo: "Try immer",
        done: false
      }],
      reducers: {
        done(state) {
          state.push({todo: "Tweet about it"});
          state[1].done = true
          return state;
        }
      }
    };

    const store = init({
      plugins: [immerPlugin()],
      models: { todo },
    });
    store.dispatch({ type: 'todo/done' });
    const newState = store.getState().todo;

    expect(todo.state.length).toBe(2);
    expect(newState.length).toBe(3);

    expect(todo.state[1].done).toBe(false);
    expect(newState[1].done).toBe(true);
  });
})
