/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import * as React from 'react'
import { connect } from 'react-redux'
import { dispatch } from '@rematch/core'

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    height: 25,
  }
}

const App = (props) => (
  <div style={styles.container}>
    <button onClick={props.addOne}>+1</button>
    <div>
      <h3>Persisted</h3>
      {props.countPersisted}
    </div>
    <div>
      <h3>Non-Persisted</h3>
      {props.countNonpersisted}
    </div>
    <div>
      <h3>State</h3>
      <pre>
        <code>
          {props.formattedState}
        </code>
      </pre>
    </div>
  </div>
)

const mapToProps = state => ({
  formattedState: JSON.stringify(state, null, '\t'),
  countPersisted: state.count.total,
  countNonpersisted: state.nonpersistedCount.total,
  addOne: () => {
    dispatch.count.addOne()
    dispatch.nonpersistedCount.addOne()
  },
})

export default connect(mapToProps)(App)
