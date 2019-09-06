import { init, RematchRootState, RematchDispatch } from '@rematch/core'
import models from './models'

export const store = init({
	models,
})

export type Store = typeof store
export type Dispatch = RematchDispatch<typeof models>
export type iRootState = RematchRootState<typeof models>
