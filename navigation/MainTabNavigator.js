import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import ImagesScreen from "../screens/ImagesScreen";
import StartScreen from "../screens/StartScreen";
import SettingsScreen from "../screens/SettingsScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const ImagesTab = createStackNavigator(
  {
    Images: ImagesScreen
  },
  config
);

ImagesTab.navigationOptions = {
  tabBarLabel: "Analyzed Images",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-folder" : "md-folder"}
    />
  )
};

ImagesTab.path = "";

const StartTab = createStackNavigator(
  {
    Links: StartScreen
  },
  config
);

StartTab.navigationOptions = {
  tabBarLabel: "Start",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-home" : "md-home"}
    />
  )
};

StartTab.path = "";

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

SettingsStack.path = "";

const tabNavigator = createBottomTabNavigator({
  StartTab,
  ImagesTab
});

tabNavigator.path = "";

export default tabNavigator;
