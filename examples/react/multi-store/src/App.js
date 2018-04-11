import React from 'react';
import Left from './containers/left'
import Right from './containers/right'
import { dispatch } from '@rematch/core'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
  }
}

export default class App extends React.Component {
  onClick = () => {
    dispatch.count.increment()
    this.forceUpdate()
  }
  render() {
    return (
     <div style={styles.container}>
       <Left />
       <Right />
       <button onClick={this.onClick}>All</button>
    </div>
    );
  }
}
