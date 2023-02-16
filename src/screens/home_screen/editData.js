import React, { useEffect, useState, useRef } from "react";
import { Keyboard, Text, TextInput, TouchableOpacity, View, StyleSheet, ScrollView } from "react-native"
import { useSelector, useDispatch } from "react-redux";
import { useKeyboard } from "../../components/keyboardHeight";
import { DeleteThought, CompleteThought, EditThought, EnableEditMode } from "../store/silce";

const EditData = ({ navigation }) => {
    const StoreStateData = useSelector((state) => state.MYSTORE); // get store state data
    const dispatch = useDispatch();
    var ref_input = [];

    const keyboardHeight = useKeyboard();
    console.log("keyboardHeight", keyboardHeight);
    if (StoreStateData.length > 0) {
        StoreStateData.map((val, key) => {
            ref_input[key] = useRef();
        })
    }

    const [keyboardStatus, setKeyboardStatus] = useState('');

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardStatus('on');
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardStatus('hidden');
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    useEffect(() => {
        // console.log("StoreStateData", StoreStateData)
    }, [StoreStateData])

    const backToAddNew = () => {
        return (
            <View style={styles.backtotextview}>
                <TouchableOpacity onPress={() => { navigation.navigate("AddData") }}>
                    <Text style={styles.backtotext}>Add a new thought?</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const onDelete = (index) => {
        dispatch(DeleteThought(index))
    }

    const onComplete = (index) => {
        dispatch(CompleteThought(index))
    }

    const onSaveEdit = async (index) => {
        await dispatch(EnableEditMode(index))
        await setTimeout(() => {
            if (!StoreStateData[index].editMode) {
                ref_input[index].current.focus()
                console.log("focused", index)
            }
        }, 500)

    }

    const onEditThought = (key, txt) => {
        var data = {
            "index": key,
            "value": txt
        }
        dispatch(EditThought(data))
    }


    return (
        <View style={{ padding: 20, }}>
            <ScrollView style={{ marginBottom: keyboardStatus == "on" ? keyboardHeight : 0 }}>


                {backToAddNew()}
                <Text style={{ marginTop: 20, fontWeight: "bold" }}>Your thoughts</Text>
                {
                    StoreStateData.length ?
                        <>
                            {StoreStateData.map((val, key) => {
                                return (
                                    <View style={styles.renderContainerView}>
                                        <View style={styles.col1}>
                                            {/* <Text style={[{ fontWeight: "300", marginTop: 10, }, val.completed == true ? { textDecorationLine: 'line-through' } : {}]}>{val?.id}. {val?.text}</Text> */}
                                            <TextInput
                                                style={[val.completed == true ? { color: "grey", textDecorationLine: 'line-through' } : {}]}
                                                editable={val.editMode}
                                                onChangeText={(txt) => { onEditThought(key, txt) }}
                                                value={val?.text}
                                                ref={ref_input[key]}
                                            />
                                        </View>
                                        <View style={styles.col2}>
                                            {
                                                val.completed == false ?
                                                    <TouchableOpacity activeOpacity={val.editMode ? 2 : 0.5} onPress={() => { onSaveEdit(key) }}>
                                                        <Text style={{ color: "blue" }}>{val.editMode ? "Save" : "Edit"}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            }
                                        </View>
                                        <View style={styles.col2}>
                                            <TouchableOpacity activeOpacity={val.editMode ? 2 : 0.5} onPress={() => { val.editMode == false && onComplete(key) }}>
                                                <Text style={{ color: val.editMode ? "grey" : "green" }}>{val.completed == true ? "Revoke" : "Done"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.col2}>
                                            <TouchableOpacity activeOpacity={val.editMode ? 2 : 0.5} onPress={() => { val.editMode == false && onDelete(key) }}>
                                                <Text style={{ color: val.editMode ? "grey" : "red" }}>Delete</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                )
                            })}
                        </> :
                        <Text style={styles.nodataView}>Oops! No more here.</Text>
                }

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    renderContainerView: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#dbdbdb", paddingBottom: 10, marginTop: 15 },
    col1: { width: "55%", },
    col2: { width: "15%", alignItems: "center", justifyContent: "flex-end" },
    nodataView: { fontWeight: "200", marginTop: 10, textAlign: "center" },
    backtotextview: { width: "100%", alignItems: "flex-end", justifyContent: "center" },
    backtotext: { color: "blue", textDecorationLine: 'underline' },

})
export default EditData;