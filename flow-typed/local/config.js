declare type $config = {
 router?: any,
 initialState?: any,
 plugins?: any[],
 middleware?: any[],
 extraReducers?: {
  [reducerName: string]: (state: any, action: Object) => any,
 },
 onError?: (error: Error) => void,
}
