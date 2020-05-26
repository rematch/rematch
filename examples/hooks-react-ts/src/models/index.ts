import { dolphins } from './dolphins'
import { sharks } from './sharks'
import { Models } from '@rematch/core'

export interface RootModel extends Models {
	dolphins: typeof dolphins
	sharks: typeof sharks
}

export const models: RootModel = { dolphins, sharks }
