import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { SaveThought } from "../store/silce";
const AddData = ({ navigation }) => {
    const dispatch = useDispatch();
    const StoreStateData = useSelector((state) => state.MYSTORE); // get store state data

    const [text, setText] = useState("");

    const onSave = async () => {
        await dispatch(SaveThought(text))
        await setText("")
    }

    const seeAll = () => {
        return (
            <View style={styles.linkStyle}>
                <TouchableOpacity onPress={() => { navigation.navigate("EditData") }}>
                    <Text style={styles.listTextstye}>List your thoughts?</Text>
                </TouchableOpacity>
                <Text style={styles.countTextStyle}>Currently you have {StoreStateData?.length} thought(s)</Text>
            </View>
        )
    }

    return (
        <View style={{ padding: 20 }}>
            {seeAll()}
            <TextInput
                style={{ marginTop: 20 }}
                placeholder="Leave your thought here"
                onChangeText={(txt) => { setText(txt) }}
                value={text}
            />
            {
                text ?
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => { onSave() }}>
                        <Text>{"Save"}</Text>
                    </TouchableOpacity>
                    : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    buttonStyle: { height: 30, width: 50, alignItems: "center", justifyContent: "center", borderRadius: 5, borderWidth: 0.1, backgroundColor: "#dbdbdb", marginTop: 20 },
    linkStyle: { width: "100%", alignItems: "flex-end", justifyContent: "center" },
    listTextstye: { color: "blue", textDecorationLine: 'underline' },
    countTextStyle: { marginTop: 10, fontWeight: "200" }
})
export default AddData;