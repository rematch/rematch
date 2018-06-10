import { Action, ExtractRematchSelectorsFromModels, Models, Plugin } from '@rematch/core'

export declare const select: {}
export declare function getSelect<M extends Models = Models>(): ExtractRematchSelectorsFromModels<M, any>
export interface SelectConfig {
    sliceState?: any
}
declare const selectPlugin: ({ sliceState, }?: SelectConfig) => Plugin<Models, Action<any, any>>
export default selectPlugin
