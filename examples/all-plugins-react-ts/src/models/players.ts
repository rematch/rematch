import { createModel } from '@rematch/core'
import { RootModel } from '.'

export interface Team {
	id: number
	abbreviation: string
	city: string
	conference: string
	division: string
	full_name: string
	name: string
}

export interface PlayerModel {
	id: number
	first_name: string
	last_name: string
	position: string
	height_feet: number
	height_inches: number
	weight_pounds: number
	team: Team
}

type PlayersState = {
	players: PlayerModel[]
}

export const players = createModel<RootModel>()({
	state: {
		players: [],
	} as PlayersState,
	reducers: {
		SET_PLAYERS: (state: PlayersState, players: PlayerModel[]) => {
			return {
				...state,
				players,
			}
		},
	},
	effects: (dispatch) => {
		const { players } = dispatch
		return {
			async getPlayers(): Promise<any> {
				let response = await fetch('https://www.balldontlie.io/api/v1/players')
				let { data }: { data: PlayerModel[] } = await response.json()
				players.SET_PLAYERS(data)
			},
		}
	},
})
