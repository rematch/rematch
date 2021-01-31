import {
	init,
	RematchDispatch,
	RematchRootState,
	RematchStore,
} from '@rematch/core'
import { models, RootModel } from './models'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import persist from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'

type FullModel = ExtraModelsFromLoading<RootModel> &
	ExtraModelsFromUpdated<RootModel>
export const store = init<RootModel, FullModel>({
	models,
	plugins: [
		updated(),
		loading(),
		persist({
			key: 'persist-storage',
			storage,
			whitelist: ['settings'],
		}),
		immerPlugin({
			whitelist: ['settings'],
		}),
		selectPlugin(),
	],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
