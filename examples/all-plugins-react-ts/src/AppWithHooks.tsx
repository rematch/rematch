import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPersistor } from '@rematch/persist'
import { RootState, Dispatch, store } from './store'
import { PlayerModel } from './models/players'
import { settings } from './models/settings'

const persistor = getPersistor()
const Count = () => {
	const settingsState = useSelector((state: RootState) => state.settings)
	const loadingState = useSelector((state: RootState) => state.loading)
	const playersState = useSelector((state: RootState) => state.players)
	const dispatch = useDispatch<Dispatch>()

	React.useEffect(() => {
		store.addModel(settings)
		persistor.persist()
		dispatch.players.getPlayers()
	}, [])

	React.useEffect(() => {
		const theme = settingsState?.isLightThemeOn ? 'light' : 'dark'
		document.documentElement.setAttribute('data-theme', theme)
	}, [settingsState?.isLightThemeOn])

	const checkTheme = React.useCallback((e) => {
		if (e.target.checked) {
			dispatch.settings.SET_THEME('dark')
		} else {
			dispatch.settings.SET_THEME('light')
		}
	}, [])

	return (
		<div>
			<div
				style={{
					display: 'flex',
					width: '100%',
					justifyContent: 'space-between',
				}}
			>
				<h1>NBA Hook Players:</h1>
				<div className="theme-switch-wrapper">
					<label className="theme-switch">
						<input
							checked={!settingsState?.isLightThemeOn}
							onChange={(e) => checkTheme(e)}
							type="checkbox"
							id="checkbox"
						/>
						<div className="slider round"></div>
					</label>
					<em>Enable Dark Mode!</em>
				</div>
			</div>
			<div className="container">
				{loadingState.models.players ? (
					<div className="loader">Loading...</div>
				) : (
					playersState.players.map((player: PlayerModel) => (
						<div key={player.id} className="card">
							<h5>
								{player.first_name} {player.last_name}
							</h5>
							<div>
								<p>
									<b>Position: </b>
									{player.position}
								</p>
								<p>
									<b>Team: </b>
									{player.team.full_name}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}

export default Count
