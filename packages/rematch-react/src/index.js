import React from 'react'
import PropTypes from 'prop-types'

const REACT_NO_NAME_COMPONENT = 'Unknown' // for react chrome dev tools. May change in future versions of react
const REMATCH_KEY_FOR_API_VIEW = 'view' // for react chrome dev tools. May change in future versions of rematch

const getDisplayName = (Component) => {
  return Component.displayName || Component.name || REACT_NO_NAME_COMPONENT
}

export default subscribe => (selector, modelName, selectorName = '') => Component => {

  return class extends React.Component {

    static propTypes = {
      valuePropName: PropTypes.string
    }

    static defaultProps = {
      valuePropName: selectorName || modelName
    }

    static displayName = `${REMATCH_KEY_FOR_API_VIEW}.${modelName}${selectorName && `.${selectorName}`}(${getDisplayName(Component)})`

    componentWillMount = () => {
      const { valuePropName, ...selectorArgs} = this.props
      const componentSelector = state => selector(state[modelName], selectorArgs)
      const handleStateChange = value => this.setState({ [valuePropName]: value })

      // subscribe to changes on this particular piece of the store's state
      this.storeSubscription = subscribe(componentSelector, handleStateChange)
    }

    componentWillUnmount = () => {
      // remove subscription to changes on this particular piece of the store's state
      this.storeSubscription()
    }

    render = () => {
      const { valuePropName, ...selectorArgs} = this.props
      return (
        <Component {...{
          ...selectorArgs,
          [valuePropName]: this.state[valuePropName]
        }} />
      )
    }
  }

}