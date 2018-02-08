/* eslint-disable react/jsx-filename-extension */
import * as React from 'react'
import { addNavigationHelpers } from 'react-navigation'
import { connect } from 'react-redux'

interface Props {
  dispatch: () => any,
  nav: any,
}

export default ({ AppNavigator, addListener }) => {
  class Navigator extends React.Component<Props> {
    private render() {
      const { dispatch, nav } = this.props
      return (
        <AppNavigator navigation={addNavigationHelpers({
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
