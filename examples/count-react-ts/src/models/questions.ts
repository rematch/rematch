import { createModel, ModelReducers } from '@rematch/core'
import { Dispatch } from '../store'

type QuestionType = 'boolean' | 'multiple' | 'mixed'
type QuestionsState = {
	questions: number[]
	amount: number
	type: QuestionType
}

const questions = createModel()({
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
	effects: (dispatch) => ({
		// handle state changes with impure functions.
		// use async/await for async actions
		async loadQuestions({ categoryId }: { categoryId: string }) {
			const typedDispatch = dispatch as Dispatch
			// const questions = result.data.results;
			typedDispatch.questions.setQuestions([1, 2])
			// console.log("result", result);
			// console.log("rs", rootState);

			// typedDispatch.questions.setQuestions(result)
		},
		async otherLoadQuestion() {
			const typedDispatch = dispatch as Dispatch
			typedDispatch.questions.loadQuestions()
		},
	}),
})

export default questions
