import type { Reducer } from 'redux'

declare type $reducer = Reducer<any, $action>

declare type $reducers = {
 [name: string]: $reducer,
}
