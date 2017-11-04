import React from 'react'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loading: {
    border: '1px solid black',
    backgroundColor: 'lightYellow',
    padding: '1rem'
  }
}

const App = (props) => (
  <div style={styles.page}>
    <button onClick={props.submit}>Submit Async</button>
    <div style={styles.loading}>
      <p>state.loading.global: <strong>{props.loading.global.toString()}</strong></p>
      <p>state.loading.models.app: <strong>{props.loading.model.toString()}</strong></p>
      {/* <p>state.loading.effects.app.incrementAsync: <strong>{props.loading.effect.toString()}</strong></p> */}
    </div>
  </div>
)

const mapState = state => ({
  count: state.form,
  submit: dispatch.form.submit,
  loading: {
    global: !!state.loading.global,
    model: !!state.loading.models.form,
    // effect: !!state.loading.effects.form.submit,
  }
})

export default connect(mapState)(App)
