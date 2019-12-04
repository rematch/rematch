import * as R from '@rematch/core'

declare const typedStatePlugin: () => R.Plugin
export default typedStatePlugin

declare module '@rematch/core' {
	export interface Model<S = any, SS = S> {
		typings?: {
			[key: string]: any
		}
	}
}
