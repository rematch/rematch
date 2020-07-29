import { Action, AnyAction } from 'redux'

declare module 'redux' {
	export interface Dispatch<A extends Action = AnyAction> {
		dolphins: any
		sharks: any
	}
}
