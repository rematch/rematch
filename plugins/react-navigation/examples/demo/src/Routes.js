import { createStackNavigator } from 'react-navigation'

import LoginScreen from './components/LoginScreen'
import MainScreen from './components/MainScreen'
import ProfileScreen from './components/ProfileScreen'

export default createStackNavigator({
	Login: { screen: LoginScreen },
	Main: { screen: MainScreen },
	Profile: { screen: ProfileScreen },
})
