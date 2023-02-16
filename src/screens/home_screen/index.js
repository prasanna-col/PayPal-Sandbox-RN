import React, { useState } from 'react'
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import { createStackNavigator } from "@react-navigation/stack";

import AddData from './addData';
import EditData from './editData';
import { Provider } from 'react-redux'
import { store } from '../store'
const PaymentScreen = () => {
    const Stack = createStackNavigator();

    return (
        <Provider store={store}>


            <Stack.Navigator
                initialRouteName={"AddData"}
                screenOptions={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                }}
            >

                <Stack.Screen name="AddData" options={{ headerShown: false }}>
                    {(props) => <AddData {...props} />}
                </Stack.Screen>
                <Stack.Screen name="EditData" options={{ headerShown: false }}>
                    {(props) => <EditData {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </Provider>

        // <SafeAreaView style={styles.container} edges={["left", "right"]}>
        //     <View style={styles.outerView}>
        //         <Text>Home screen</Text>
        //     </View>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff", flexGrow: 1,
        position: "relative",
    },
    outerView: { padding: 20, height: "100%" },
    logoView: { alignItems: "center", justifyContent: "center", marginTop: 20 },
    innerView: { paddingTop: 20, paddingLeft: 10, },
    btnView: { flexDirection: "row", alignItems: "center" },
    btnText: { fontWeight: "bold", color: "#fff" },
    webviewStyle: { height: 400, width: "100%", marginTop: 20, borderRadius: 10, borderWidth: 0.3, borderColor: "blue" },
    successDiv: { alignItems: "center", justifyContent: "center", width: "100%", marginTop: 50 },
    successText: { fontSize: 20, fontWeight: "300", marginTop: 20 },
    successText2: { color: "#a3a3a3", fontWeight: "400" },
    imageView: { height: 100, width: 100 },
    btnBoxShadow: {
        // marginBottom: 5,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,

        height: 30,
        width: 150,
        borderRadius: 8,
        alignItems: "center", justifyContent: "center"
    },
    divShadow: {
        // marginBottom: 5,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    }
})
export default PaymentScreen;