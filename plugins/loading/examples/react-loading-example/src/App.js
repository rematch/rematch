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
    padding: '1rem',
    width: '15rem',
  }
}

const Value = ({ label, value }) => (
  <p>{label} = <strong>{value.toString()}</strong></p>
)

const App = ({ submit, loading }) => (
  <div style={styles.page}>
    <button onClick={submit}>
      Submit Async
    </button>
    <div style={styles.loading}>
      <Value label='loading.global' value={loading.global} />
      <Value label='loading.models.form' value={loading.model} />
      <Value label='loading.effects.form.submit' value={loading.effect} />
    </div>
  </div>
)

const mapState = state => ({
  count: state.example,
  loading: {
    global: state.loading.global,
    model: state.loading.models.example,
    effect: state.loading.effects.example.submit,
  },
  submit: dispatch.example.submit,
})

export default connect(mapState)(App)
