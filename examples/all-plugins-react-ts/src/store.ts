import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import { models, RootModel } from './models'

import createLoadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading"
import createImmerPlugin from "@rematch/immer"
import createPersistPlugin from "@rematch/persist"
import createUpdatedPlugin, { ExtraModelsFromUpdated } from "@rematch/updated"
import createSelectPlugin from "@rematch/select"
import storage from 'redux-persist/lib/storage'

type FullModel = ExtraModelsFromLoading<RootModel> & ExtraModelsFromUpdated<RootModel>;

export const store = init<RootModel, FullModel>({
	models,
	plugins: [
		createLoadingPlugin(),
		createUpdatedPlugin(),
		// createImmerPlugin(),
		// createPersistPlugin({
		// 	key: 'root',
  	// 	storage,
		// }),
		// createSelectPlugin(),
	]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel & FullModel>
export type RootState = RematchRootState<RootModel & FullModel>
