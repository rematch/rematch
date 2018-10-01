import { Action, Models, Plugin } from '@rematch/core'

export interface LoadingConfig {
    name?: string
    whitelist?: string[]
    blacklist?: string[]
    asNumber?: boolean
}

declare const _default: (config?: LoadingConfig) => Plugin<Models, Action<any, any>>

export default _default
