declare type $reducer = (state: any, action: Object) => any

declare type $reducers = {
 [name: string]: $reducer,
}
