import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { Provider } from 'react-redux';

// import AppWithNavigationState from './src/navigators/AppNavigator';
import store from './src/rematch'

class ReduxExampleApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Text>Here</Text>
        {/* <AppWithNavigationState /> */}
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ReduxExample', () => ReduxExampleApp);

export default ReduxExampleApp;
