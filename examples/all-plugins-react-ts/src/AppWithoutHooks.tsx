import * as React from 'react'
import { RootState, Dispatch, store } from './store'
import { connect } from 'react-redux'
import { PlayerModel } from './models/players';
import "./index.css";
import "./switch.css";

class App extends React.PureComponent<Props> {
  componentDidMount() {
    const { players } = this.props;
		players.getPlayers();
  }

  componentDidUpdate() {
    const { settingsState } = this.props;
    const theme = settingsState.isLightThemeOn ? 'light' : 'dark'
		document.documentElement.setAttribute('data-theme', theme);
  }

  checkTheme(e: any) {
    const { settings } = this.props;

    if (e.target.checked) {
			settings.SET_THEME("dark");
		} else {
			settings.SET_THEME("light");
		}
  }

  render() {
    const { settingsState, loadingState, playersState } = this.props;
    return (
      <div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between'}}>
          <h1>NBA Class Players:</h1>
          <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input checked={!settingsState.isLightThemeOn} onChange={(e) => this.checkTheme(e)} type="checkbox" id="checkbox" />
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
                <h5>{player.first_name} {player.last_name}</h5>
                <div>
                  <p><b>Position: </b>{player.position}</p>
                  <p><b>Team: </b>{player.team.full_name}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }
}

const selection = store.select(models => ({
  // todo: this isn't getting autocompleted
  total: models.cart.total,
}))

const mapState = (state: RootState) => ({
	settingsState: state.settings,
  loadingState: state.loading,
  playersState: state.players,
  // todo: props shouldn't be required
  ...selection(state, null)
})

const mapDispatch = (dispatch: Dispatch) => ({
  players: dispatch.players,
  settings: dispatch.settings,
});

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>
// todo: we must type the props autocomplete of the selector new values
type Props = StateProps & DispatchProps

export default connect(mapState, mapDispatch)(App);
