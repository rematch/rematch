import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { RootModel } from './models'
import { models } from './models'

export const store = init({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type iRootState = RematchRootState<RootModel>
