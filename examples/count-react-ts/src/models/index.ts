import { Models } from '@rematch/core'
import { dolphins } from './dolphins'
import { sharks } from './sharks'
import questions from './questions'

export interface RootModel extends Models<RootModel> {
	dolphins: typeof dolphins
	sharks: typeof sharks
	questions: typeof questions
}

export const models: RootModel = { dolphins, sharks, questions }
