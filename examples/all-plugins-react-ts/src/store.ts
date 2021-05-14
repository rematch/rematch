import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import loading, { ExtraModelsFromLoading } from '@rematch/loading'
import updated, { ExtraModelsFromUpdated } from '@rematch/updated'
import persist from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, RootModel } from './models'

type FullModel = ExtraModelsFromLoading<RootModel> &
	ExtraModelsFromUpdated<RootModel>
export const store = init<RootModel, FullModel>({
	// @ts-ignore
	models,
	plugins: [
		updated(),
		loading(),
		persist(
			{
				key: 'persist-storage',
				storage,
				whitelist: ['settings'],
			},
			{},
			{
				manualPersist: true,
			}
		),
		immerPlugin({
			whitelist: ['settings'],
		}),
		selectPlugin(),
	],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>
