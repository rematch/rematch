import { Models } from '@rematch/core'
import { players } from './players'
import { settings } from './settings'

export interface RootModel extends Models<RootModel> {
	players: typeof players
	settings: typeof settings
}

export const models: RootModel = { players, settings }
