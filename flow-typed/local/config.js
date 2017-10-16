declare type $config = {
 initialState?: any,
 plugins: any[],
 extraReducers?: {
  [reducerName: string]: (state: any, action: Object) => any,
 },
}
