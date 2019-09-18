import { init } from '@rematch/core'
import { RematchRootDispatch, RematchRootState } from './models/util'
import * as models from './models'

export const store = init({
	models,
})

export type RootState = RematchRootState<typeof models>

export type RootDispatch = RematchRootDispatch<typeof models>
