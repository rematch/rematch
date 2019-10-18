import { Plugin } from '@rematch/core'
export interface LoadingConfig {
	name?: string
	whitelist?: string[]
	blacklist?: string[]
	asNumber?: boolean
}
declare const _default: (
	config?: LoadingConfig
) => Plugin<
	import('@rematch/core').Models,
	import('@rematch/core').Action<any, any>
>
export default _default
