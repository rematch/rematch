import { Models } from '@rematch/core'
import { dolphins } from './dolphins'
import { sharks } from './sharks'

const rootModel: RootModel = { dolphins, sharks }

// add interface to avoid recursive type checking
export interface RootModel extends Models {
	dolphins: typeof dolphins,
	sharks: typeof sharks,
}

export default rootModel
