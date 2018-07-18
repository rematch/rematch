// Type definitions for @rematch/select 2.0.0
// Definitions by: Sam Richard <https://github.com/d3dc>

import { Action, Models, Plugin } from '@rematch/core'

import * as Reselect from 'reselect'

export interface SelectConfig {
    sliceState?: any;
    selectorCreator?: any;
}

declare const selectPlugin: (config?: SelectConfig) => Plugin<Models, Action<any, any>>
export default selectPlugin

type RematchSelector<S, P = any, R = any> =
    Reselect.Selector<S, R>
    | Reselect.ParametricSelector<S, P, R>

type ModelSelectors<S> = {
    [key: string]: RematchSelector<S>
}

type StoreSelectors<S> = {
    [key: string]: ModelSelectors<S>
}

type ModelSelectorFactories<S> = {
    [key: string]: (
        this: ModelSelectors<S>,
        models: StoreSelectors<S>
    ) => ModelSelectors<S>
}

type RematchSelect<M extends Models | void = void, RootState = any> =
 (
    (mapSelectToProps: (select: RematchSelect<M,RootState>) => object) =>
        Reselect.OutputParametricSelector<RootState, any, object, Reselect.Selector<RootState, object>>
 ) & StoreSelectors<RootState>

declare module '@rematch/core' {
    
    export interface ModelConfig<S = any, SS = S> {
        selectors?: ModelSelectorFactories<S> | ((models: StoreSelectors<S>) => ModelSelectorFactories<S>);
    }
    
    export interface RematchStore<M extends Models = Models, A extends Action = Action> {
        select: RematchSelect<M>;
    }
    
}

