import React, { useState } from 'react'
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from "react-native"
import axios from "axios";
import Paypal_logo from "../assets/image/paypal_logo.png"
import Success_img from "../assets/image/paymentsuccess.png"
import failed_img from "../assets/image/paymentfailed.png"

import { WebView } from 'react-native-webview';
import AppButton from '../components/AppButton';

const PaymentScreen = () => {

    const amount = 2
    const currency_ = "USD"

    const [Loader, setloader] = useState(false)
    const [accessToken, setAccessToken] = useState("")
    const [paymentId, setPaymentId] = useState("")
    const [approvalUrl, setApprovalUrl] = useState("")

    const [paymentStatus, setPaymentStatus] = useState(1)
    // 1 - checkout btn visible
    // 2 - proceed btn visible
    // 3 - cancel payment btn visible

    const [TracnsactionDetails, setTracnsactionDetails] = useState({})
    const [PaymentSuccess, setPaymentSuccess] = useState(null)

    const onCheckOut = async () => {
        setloader(true)
        axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', { grant_type: 'client_credentials' },
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': "Basic " + process.env.BASIC_AUTH
                }
            }
        )
            .then(response => {

                console.log("response 1", response)
                setAccessToken(response.data.access_token)

                const dataDetail = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "transactions": [{
                        "amount": {
                            "total": amount,
                            "currency": currency_,
                            "details": {
                                "subtotal": amount,
                                "tax": "0",
                                "shipping": "0",
                                "handling_fee": "0",
                                "shipping_discount": "0",
                                "insurance": "0"
                            }
                        }

                    }],
                    "redirect_urls": {
                        "return_url": "https://example.com",
                        "cancel_url": "https://example.com"
                    }
                }

                setTimeout(() => {
                    if (response?.data?.access_token) {
                        axios.post('https://api.sandbox.paypal.com/v1/payments/payment', dataDetail,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${response?.data?.access_token}`
                                }
                            }
                        )
                            .then(response => {

                                console.log("response 2", response)

                                const { id, links } = response.data
                                const approvalUrl = links.find(data => data.rel == "approval_url")

                                setPaymentId(id)
                                setApprovalUrl(approvalUrl.href)
                                setPaymentStatus(2) // proceed btn visible
                                setloader(false)
                            }).catch(err => {
                                console.log({ ...err })
                                setloader(false)

                            })
                    }
                }, 2000);
            }).catch(err => {
                console.log({ ...err })
                setloader(false)
            })
    }

    const onpaymentSuccess = async (data) => {
        if (data?.state == "approved") {
            var res = data?.transactions[0].related_resources
            if (res.length) {
                setTracnsactionDetails(res[0]?.sale?.transaction_fee)
            }
            setPaymentSuccess(true)

        } else {
            setPaymentSuccess(false)
        }
    }


    const _onNavigationStateChange = async (webViewState) => {

        console.log("webViewState", webViewState)
        if (webViewState.url.includes('https://example.com/')) {
            // setApprovalUrl(null)

            let url = webViewState.url
            let regex = /[?&]([^=#]+)=([^&#]*)/g,
                params = {},
                match
            while ((match = regex.exec(url))) {
                params[match[1]] = match[2]
                console.log(match[1], match[2])
            }
            const { PayerID, paymentId } = params

            console.log("PayerID, paymentId ", PayerID, paymentId)

            axios.post(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, { payer_id: PayerID },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            )
                .then(response => {
                    console.log("execute res", response)
                    setApprovalUrl(null)
                    onpaymentSuccess(response.data);
                }).catch(err => {
                    console.log({ ...err })
                })

        }
    }

    const onProceedPay = () => {
        setPaymentStatus(3) // cancel payment visible
    }

    const resetAll = () => {
        setAccessToken("")
        setPaymentId("")
        setApprovalUrl("")
        setPaymentStatus(1) // checkout btn visible
        setPaymentSuccess(null)
    }

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            <View style={styles.outerView}>
                <View style={styles.logoView}>
                    <Image source={Paypal_logo} style={styles.imageView} />
                </View>

                <View style={styles.innerView}>
                    <Text style={{ fontWeight: "bold" }}>Payment details</Text>
                    <Text style={{ marginTop: 10 }}>Amount to Pay: {amount} {currency_}</Text>
                </View>

                <View style={styles.innerView}>
                    {
                        paymentStatus == 1 ?
                            <View style={styles.btnView}>
                                <AppButton
                                    ButtonColor={"#1d2fa8"}
                                    ButtonText={Loader ? "Processing..." : "Check Out"}
                                    onpressBtn={() => { onCheckOut() }}
                                />
                                {
                                    Loader ? <ActivityIndicator style={{ marginLeft: 10 }} color={"blue"} /> : null
                                }
                            </View>
                            :
                            paymentStatus == 2 ?
                                <View style={styles.btnView}>
                                    <AppButton
                                        ButtonColor={"#0d7008"}
                                        ButtonText={"Proceed to Pay"}
                                        onpressBtn={() => { onProceedPay() }}
                                    />
                                    <Text style={{ marginHorizontal: 5 }}> (or) </Text>
                                    <AppButton
                                        ButtonColor={"#ff974d"}
                                        ButtonText={"Reset?"}
                                        onpressBtn={() => { resetAll() }}
                                        Small
                                    />
                                </View>
                                :
                                paymentStatus == 3 ?
                                    <AppButton
                                        ButtonColor={"#f52525"}
                                        ButtonText={"Reset?"}
                                        onpressBtn={() => { resetAll() }}
                                    />
                                    : null
                    }
                </View>

                {
                    (approvalUrl && paymentStatus == 3) ?
                        <WebView
                            style={[styles.divShadow, styles.webviewStyle]}
                            source={{ uri: approvalUrl }}
                            onNavigationStateChange={_onNavigationStateChange}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            startInLoadingState={false}
                        />
                        : null
                }

                {
                    PaymentSuccess == true ?
                        <View style={styles.successDiv}>
                            <Image source={Success_img} style={styles.imageView} />
                            <Text style={styles.successText}>Payment Successful!</Text>
                            <Text style={styles.successText2}>Payee transaction fee: {TracnsactionDetails?.value} {TracnsactionDetails?.currency}</Text>
                        </View>
                        : PaymentSuccess == false ?
                            <View style={styles.successDiv}>
                                <Image source={failed_img} style={styles.imageView} />
                                <Text style={styles.successText}>Payment Failed!</Text>
                            </View>
                            : null
                }

            </View>


        </SafeAreaView>
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