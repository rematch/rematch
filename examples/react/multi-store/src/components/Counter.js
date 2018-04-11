import React from 'react'

const styles = {
  container: {
    width: 50,
    height: 50,
    border: '2px solid black',
    borderRadius: 50,
    backgroundColor: 'lightblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
  }
}

export default class Counter extends React.Component {
  onClick = () => {
    this.props.store.dispatch.count.increment()
    this.forceUpdate()
  }
  render() {
    const { count } = this.props.store.getState()
    return (
      <div
        style={styles.container}
        onClick={this.onClick}
      >
        <span style={styles.text}>{count}</span>
      </div>
    )
  }
}
