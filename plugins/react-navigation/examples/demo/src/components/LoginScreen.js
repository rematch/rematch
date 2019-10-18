import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
})

const LoginScreen = ({ navigation, routeToHome }) => (
	<View style={styles.container}>
		<Text style={styles.welcome}>Screen A</Text>
		<Text style={styles.instructions}>This is great</Text>
		<Button onPress={routeToHome} title="Go Home" />
	</View>
)

LoginScreen.navigationOptions = {
	title: 'Log In',
}

const mapDispatch = dispatch => ({
	routeToHome: () => dispatch.nav.navigate({ routeName: 'Main' }),
})

export default connect(
	null,
	mapDispatch
)(LoginScreen)
