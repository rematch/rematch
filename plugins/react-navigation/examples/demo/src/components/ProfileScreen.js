import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

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
});

const ProfileScreen = ({ routeBack }) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>
      Profile Screen
    </Text>
    <Button
      onPress={routeBack}
      title="Go Back"
    />
  </View>
);

ProfileScreen.navigationOptions = {
  title: 'Profile',
};

const mapDispatch = dispatch => ({
  routeBack: () => dispatch.nav.back(),
});

export default connect(null, mapDispatch)(ProfileScreen);
