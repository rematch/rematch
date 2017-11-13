/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import { connect } from 'react-redux'

type Props = {
 dispatch: () => any,
 nav: any,
}

export const createNavigator = (Routes, ReactNavigation) => {
  const Navigator = ({ dispatch, nav }: Props) => (
    <Routes navigation={ReactNavigation.addNavigationHelpers({
        dispatch,
        state: nav,
      })}
    />
  )

  const mapToProps = state => ({
    nav: state.nav,
  })

  return connect(mapToProps)(Navigator)
}
