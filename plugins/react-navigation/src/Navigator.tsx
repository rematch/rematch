/* eslint-disable react/jsx-filename-extension */
import * as React from 'react'
import { connect } from 'react-redux'

interface Props {
  dispatch: () => any,
  nav: any,
}

export const createNavigator = ({ Routes, ReactNavigation }) => {
  class Navigator extends React.Component<Props> {
    private render() {
      const { dispatch, nav } = this.props
      return (
        <Routes
          navigation={ReactNavigation.addNavigationHelpers({
          dispatch,
          state: nav,
        })}
      />
      )
    }
  }

  const mapToProps = (state, props) => ({
    nav: state.nav,
  })

  return connect(mapToProps)(Navigator)
}
