declare type $config = {
 initialState?: any,
 plugins?: $plugin[],
 extraReducers?: {
  [reducerName: string]: (state: any, action: Object) => any,
 },
 overwrites?: {
  combineReducers?: (rootReducer: $reducer) => any,
  createStore?: () => any,
 }
}
