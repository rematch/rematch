import * as R from '@rematch/core'

declare const typedStatePlugin: () => R.Plugin<R.Models, R.Action<any, any>>
export default typedStatePlugin

declare module '@rematch/core' {
	export interface ModelConfig<S = any, SS = S> {
		typings?: {
			[key: string]: any
		}
	}
}
