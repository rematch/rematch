/* eslint-disable react/jsx-filename-extension */
import * as React from 'react'
import { addNavigationHelpers } from 'react-navigation'
import { connect } from 'react-redux'

export default (Routes, addListener) => {
  class Navigator extends React.Component {
    render() {
      const { dispatch, nav } = this.props
      return (
        <Routes navigation={addNavigationHelpers({
          addListener,
          dispatch: this.props.dispatch,
          state: this.props.nav,
        })} />
      )
    }
  }

  const mapToProps = (state, props) => ({
    nav: state.nav,
  })

  return connect(mapToProps)(Navigator)
}
