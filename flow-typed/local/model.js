declare type $model = {
 name: string,
 state: any,
 reducers?: {
  [name: string]: (state: any, payload: any) => any,
 },
 effects?: {
  [name: string]: (payload: any) => void,
 },
 select?: {
  [name: string]: (state: any) => any,
 },
 hook?: {
  [actionMatch: string]: (action: Object) => void,
 },
}
