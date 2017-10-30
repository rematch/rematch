import { persistStore, persistCombineReducers } from 'redux-persist'
// defaults to localStorage in browser, AsyncStorage in React-Native
import storage from 'redux-persist/es/storage'

const persistConfig = {
  key: 'root',
  storage,
}

const reducer = persistCombineReducers(persistConfig, reducers)

function configureStore () {
  // ...
  let store = createStore(reducer)
  let persistor = persistStore(store)
  
  return { persistor, store }
}

