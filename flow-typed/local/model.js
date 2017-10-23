declare type $model = {
 name: string,
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
