import React, { Component } from "react";
import { StyleSheet } from "react-native";
import CreateRequest from '../components/CreateRequest';
import ViewRequest from '../components/ViewRequest';
import MyRequests from '../components/MyRequests';
import Vehicles from '../components/Vehicles';
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Button, Text, Icon, Footer, FooterTab } from "native-base";
export default (MainScreenNavigator = createBottomTabNavigator(
  {
    CreateRequest: { screen: CreateRequest },
    MyRequests: { screen: MyRequests },
    Vehicles: { screen: Vehicles },
    ViewRequest: { screen: ViewRequest }
  },
  {
    tabBarPosition: "bottom",
    tabBarComponent: props => {
      return (
        <Footer>
          <FooterTab>
            <Button style={styles.button}
              vertical
              active={props.navigation.state.index === 0}
              onPress={() => props.navigation.navigate("CreateRequest")}>
              <Icon name="bicycle" />
              <Text uppercase={false}>Ask Valet</Text>
            </Button>
            <Button style={styles.button}
              vertical
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("MyRequests")}>
              <Icon name="grid" />
              <Text uppercase={false}>My Requests</Text>
            </Button>
            <Button style={styles.button}
              vertical
              active={props.navigation.state.index === 2}
              onPress={() => props.navigation.navigate("Vehicles")}>
              <Icon name="person" />
              <Text uppercase={false}>User</Text>
            </Button>
          </FooterTab>
        </Footer>
      );
    }
  }, {
    initialRouteName: 'CreateRequest'
  }
));


const styles = StyleSheet.create({
  button: {
    backgroundColor:'#3f8bd7',
    borderColor:'#3f8bd7'
  }
});