import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Button, Text, Icon, Footer, FooterTab } from "native-base";
import AdminHome from "../components/AdminHome";
import AdminHistory from "../components/AdminHistory";
import Vehicles from '../components/Vehicles';
export default (AdminScreenNavigator = createBottomTabNavigator(
  {
    AdminHome: { screen: AdminHome },
    AdminHistory: { screen: AdminHistory },
    Vehicles: { screen: Vehicles }
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
              onPress={() => props.navigation.navigate("AdminHome")}>
              <Icon name="bicycle" />
              <Text uppercase={false}>Today's Requests</Text>
            </Button>
            <Button style={styles.button}
              vertical
              active={props.navigation.state.index === 1}
              onPress={() => props.navigation.navigate("AdminHistory")}>
              <Icon name="grid" />
              <Text uppercase={false}>History</Text>
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
    initialRouteName: 'AdminHome'
  }
));


const styles = StyleSheet.create({
  button: {
    backgroundColor:'#3f8bd7',
    borderColor:'#3f8bd7'
  }
});