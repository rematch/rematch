interface action {
  type: string,
  payload?: any,
  meta?: any,
}

interface model {
  name?: string,
  state: any,
  reducers?: {
   [name: string]: (state: any, payload: any) => any,
  },
  effects?: {
   [name: string]: (payload: any) => void,
  },
  selectors?: {
   [name: string]: (state: any, arg?: any) => any,
  },
  subscriptions?: {
   [matcher: string]: (action: $action) => void,
  },
 }
 
 declare type plugin = {
  onStoreCreated?: () => void,
  onModel?: (model: model, dispatch: any) => void,
  model?: model,
  middleware?: middleware,
}

declare type pluginCreator = {
  expose: {
    [key]: any,
  },
  config: config,
  init: (exposed: Object) => $plugin
}

interface config {
  models?: {
    [key: string]: model,
  },
  plugins?: plugin[],
  redux: {
    initialState?: any,
    reducers?: {
      [reducerName: string]: (state: any, action: action) => any,
    },
    middlewares?: Function[],
    combineReducers?: (rootReducer: any) => any,
    createStore?: () => any,
    devtoolOptions?: Object,
  }
 }

 