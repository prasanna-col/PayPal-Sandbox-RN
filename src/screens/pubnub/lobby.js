import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Button } from "react-native"

const LobbyScreen = ({ navigation }) => {

    return (
        <View style={{ padding: 20 }}>
            <Text>Lobby Screen</Text>
            <Button
                title="chat"
                onPress={() => { navigation.navigate("Chat Screen") }} />
        </View>
    )
}

const styles = StyleSheet.create({

})
export default LobbyScreen;