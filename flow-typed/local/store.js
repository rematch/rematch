import type { Middleware, Store } from 'redux'

declare type $middleware = Middleware<any, $action, any>

declare type $store = Store<any, $action, any>
