declare type $config = {
 models?: Object,
 plugins?: $plugin[],
 redux: {
   initialState?: any,
   reducers?: {
     [reducerName: string]: (state: any, action: Object) => any,
   },
   middlewares?: Function[],
   combineReducers?: (rootReducer: $reducer) => any,
   createStore?: () => any,
   devtoolOptions?: Object,
 }
}
