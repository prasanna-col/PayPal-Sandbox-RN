import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from "react-native"

export default function AppButton({
    ButtonColor,
    ButtonText,
    onpressBtn,
    Small
}) {
    return (
        <TouchableOpacity
            style={[
                styles.btnBoxShadow,
                Small && styles.smallBtn,
                { backgroundColor: ButtonColor }]}
            onPress={onpressBtn}
        >
            <Text style={styles.btnText}>{ButtonText}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnText: {
        fontWeight: "bold",
        color: "#fff"
    },
    btnBoxShadow: {
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        height: 30,
        width: 150,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    smallBtn: {
        width: 90
    }
})
