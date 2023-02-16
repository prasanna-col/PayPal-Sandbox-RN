/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { NavigationContainer, useNavigationContainerRef, useRoute } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import PaymentScreen from "./src/screens/payment_screen";
import HomeScreen from "./src/screens/home_screen";

export default function App() {


  const Stack = createStackNavigator();

  const Drawer = createDrawerNavigator();

  return (

    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName='PaymentScreen'>
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
      </Stack.Navigator> */}

      <Drawer.Navigator initialRouteName="HomeScreen"
        screenOptions={{
          drawerStyle: {
            backgroundColor: "white",
            zIndex: 100,
          },
          drawerPosition: "right",
        }}
      >
        <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true, title: "@reduxjs/toolkit" }} />
        <Drawer.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: true, title: "PayPal Sandbox" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}