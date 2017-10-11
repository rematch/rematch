declare type $config = {
 view?: (viewImplementation : any => any) => void,
 router?: any,
 initialState?: any,
 plugins?: any[],
 middleware?: any[],
 extraReducers?: {
  [reducerName: string]: (state: any, action: Object) => any,
 },
 onError?: (error: Error) => void,
}
