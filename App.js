import React, { Component } from 'react';
import {Font, AppLoading} from 'expo';
import AppNav from './navigator/AppNavigator';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      isReady: false
    };
  }
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <AppNav/>
    );
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("./assets/fonts/Roboto.ttf"),
      Roboto_medium: require("./assets/fonts/Roboto_medium.ttf"),
      Ionicons: require("./assets/fonts/Ionicons.ttf")
    });
    this.setState({ isReady: true });
  }
}