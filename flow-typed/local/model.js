declare type $model = {
 name: string,
 state: any,
 reduce?: {
  [name: string]: (state: any, payload: any) => any,
 },
 effect?: {
  [name: string]: (payload: any) => void,
 },
 select?: {
  [name: string]: (state: any) => any,
 },
 hook?: {
  [actionMatch: string]: (action: Object) => void,
 },
}
