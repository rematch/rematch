import {
	init,
	RematchDispatch,
	RematchRootState,
} from '@rematch/core'
import models from './models'

export const store = init({
	models,
})


export type RootState = RematchRootState<typeof models>
export type RootDispatch = RematchDispatch<typeof models>
