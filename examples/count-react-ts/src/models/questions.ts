import { createModel } from '@rematch/core'
import { Dispatch } from '../store'
import { RootModel } from '.'

type QuestionType = 'boolean' | 'multiple' | 'mixed'
// type QuestionsState = {
// 	questions: number[]
// 	amount: number
// 	type: QuestionType
// }

const questions = createModel<RootModel>()({
	state: {
		questions: [] as number[],
		amount: 2,
		type: 'boolean' as QuestionType,
	},
	reducers: {
		// handle state changes with pure functions
		setQuestions(state, payload: Array<number>) {
			console.log('p', payload)

			return { ...state, amount: 1 }
		},
	},
	effects: (dispatch: Dispatch) => ({
		// handle state changes with impure functions.
		// use async/await for async actions
		async loadQuestions({ categoryId }: { categoryId: string }) {
			// const questions = result.data.results;
			dispatch.questions.setQuestions([1, 2])
			// console.log("result", result);
			// console.log("rs", rootState);

			// dispatch.questions.setQuestions(result)
		},
		async otherLoadQuestion() {
			dispatch.questions.loadQuestions({ categoryId: '1' })
		},
	}),
})

export default questions
