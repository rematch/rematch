/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/prop-types */
import * as React from 'react'
import { connect } from 'react-redux'

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
      {props.count.persisted}
    </div>
    <div>
      <h3>Non-Persisted</h3>
      {props.count.nonpersisted}
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

const mapState = state => ({
  formattedState: JSON.stringify(state, null, '\t'),
  count: {
    persisted: state.persisted,
    nonpersisted: state.nonpersisted,
  },
})

const mapDispatch = dispatch => ({
  addOne: () => {
    dispatch.persisted.addOne()
    dispatch.nonpersisted.addOne()
  },
})

export default connect(mapState, mapDispatch)(App)
