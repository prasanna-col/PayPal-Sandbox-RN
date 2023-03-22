import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"

const ChatScreen = ({ navigation }) => {

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => { navigation.navigate("Lobby Screen") }} style={{ justifyContent: "center", alignItems: "flex-start" }}>
                <Text>⬅Lobby</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({

})
export default ChatScreen;