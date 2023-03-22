import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { createStackNavigator } from "@react-navigation/stack";
import LobbyScreen from "./lobby";
import ChatScreen from "./chat";
const PubStacks = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName={"Lobby Screen"}
            screenOptions={{
                headerShown: true,
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen name="Chat Screen" options={{ headerShown: false }}>
                {(props) => <ChatScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Lobby Screen" options={{ headerShown: false }}>
                {(props) => <LobbyScreen {...props} />}
            </Stack.Screen>
        </Stack.Navigator>

    )
}

const styles = StyleSheet.create({

})
export default PubStacks;