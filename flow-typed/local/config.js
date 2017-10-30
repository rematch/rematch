declare type $config = {
 initialState?: any,
 plugins?: $plugin[],
 extraReducers?: {
  [reducerName: string]: (state: any, action: Object) => any,
 },
 customCombineReducers?: (rootReducer: $reducer) => any,
}
