import React, { Component } from "react";
import { createDrawerNavigator } from 'react-navigation-drawer';
import MainScreenNavigator from './UserTabNavigator';
const AppDrawerNavigator = createDrawerNavigator(
  {
    CreateRequest: { screen: MainScreenNavigator }
  },
  {
    drawerPosition: 'right'
  }
);
export default AppDrawerNavigator;