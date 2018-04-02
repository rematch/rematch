const { isImmutable, fromJS } = require('immutable')
const { combineReducers } = require('redux-immutable')

const delay = ms => new Promise(r => setTimeout(r, ms))

exports.delay = delay

exports.count = {
  state: 0,
  reducers: {
    addOne: s => s + 1
  },
  effects: {
    async timeout() {
      await delay(200)
      await this.addOne()
    }
  }
}

exports.redux = {
  initialState: fromJS({}),
  combineReducers: combineReducers,
}

const immutableLoadingActionCreator = (state, name, action, converter, cntState) => (
  state.asImmutable().withMutations( map => map.set('global', converter(cntState.global))
    .setIn(['models', name], converter(cntState.models[name]))
    .setIn(['effects',name, action], converter(cntState.effects[name][action]))
  )
)

const immutableMergeInitialState = (state, newObj) => (
  state.asMutable().mergeDeep(fromJS(newObj))
)

exports.loadingImmutable = {
  asNumber: true,
  loadingActionCreator: immutableLoadingActionCreator,
  mergeInitialState: immutableMergeInitialState,
  model: {
    state: fromJS({}),
  }
}