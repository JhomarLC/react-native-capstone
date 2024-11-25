import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { COLORS, illustrations } from '../constants'
import { OtpInput } from 'react-native-otp-entry'
import Button from '../components/Button'
import CustomModal from '../components/CustomModal'
import {
    checkCode,
    checkVetCode,
    forgotPassword,
    forgotVetPassword,
} from '../services/PassswordService'
import { showMessage, hideMessage } from 'react-native-flash-message'

const OTPVerification = ({ route, navigation }) => {
    const { email, user } = route.params
    const [time, setTime] = useState(5)
    const [code, setCode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitLoading, setSubmitIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modal, setModal] = useState({
        title: '',
        message: '',
        icon: '',
        action: '',
    })

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [])
    const handleOTPVerification = async () => {
        if (isSubmitLoading) {
            return
        }
        setSubmitIsLoading(true)

        try {
            let data

            if (user === 'veterinarian') {
                console.log('vet1')
                data = await checkVetCode(code)
            } else if (user === 'petowner') {
                console.log('petowner1')
                data = await checkCode(code)
            } else {
                // Handle other user types or throw an error
                throw new Error('Invalid user type')
            }
            console.log(data)
            setModalVisible(true)
            setModal({
                title: 'Success!',
                message: data.message,
                icon: illustrations.star,
                action: () => {
                    setModalVisible(false)
                    navigation.replace('CreateNewPassword', {
                        code: code,
                        user: user,
                    })
                },
            })
        } catch (e) {
            setSubmitIsLoading(false)
            console.log(e)
            if (e.response?.status === 422) {
                showMessage({
                    message: e.response.data.message,
                    type: 'danger',
                })
            } else if (e.response?.status === 401) {
                showMessage({
                    message: e.response.data.message[0],
                    type: 'danger',
                })
            } else {
                console.log('An error occurred. Please try again.')
            }
        } finally {
            setSubmitIsLoading(false) // Set loading back to false after login attempt
        }
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Forgot Password" />
                <CustomModal
                    visible={modalVisible}
                    onClose={modal.action}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                />
                <ScrollView>
                    <Text
                        style={[
                            styles.title1,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        Code has been sent to
                    </Text>
                    <Text
                        style={[
                            styles.title2,
                            {
                                alignSelf: 'center',
                                color: COLORS.primary,
                            },
                        ]}
                    >
                        {email}
                    </Text>
                    <OtpInput
                        numberOfDigits={4}
                        onTextChange={(text) => console.log(text)}
                        focusColor={COLORS.primary}
                        focusStickBlinkingDuration={500}
                        onFilled={(text) => {
                            setCode(text)
                            console.log(`OTP is ${text}`)
                        }}
                        theme={{
                            pinCodeContainerStyle: {
                                backgroundColor: COLORS.secondaryWhite,
                                borderColor: COLORS.secondaryWhite,
                                borderWidth: 0.4,
                                borderRadius: 10,
                                height: 58,
                                width: 58,
                            },
                            pinCodeTextStyle: {
                                color: COLORS.black,
                            },
                        }}
                    />
                    {time !== 0 ? (
                        <View style={styles.codeContainer}>
                            <Text
                                style={[
                                    styles.code,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Resend code in
                            </Text>
                            <Text style={styles.time}>{`  ${time}  `}</Text>
                            <Text
                                style={[
                                    styles.code,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                s
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.codeContainer}>
                            <TouchableOpacity
                                style={styles.codeContainer}
                                onPress={async () => {
                                    setIsLoading(true)
                                    let data

                                    if (user === 'veterinarian') {
                                        console.log('vet1')
                                        data = await forgotVetPassword(email)
                                    } else if (user === 'petowner') {
                                        console.log('petowner1')
                                        data = await forgotPassword(email)
                                    } else {
                                        // Handle other user types or throw an error
                                        throw new Error('Invalid user type')
                                    }
                                    console.log(data)
                                    setTime(50)
                                    setIsLoading(false)
                                }}
                            >
                                <Text
                                    style={[
                                        styles.code,
                                        {
                                            color: COLORS.primary,
                                        },
                                    ]}
                                >
                                    {isLoading
                                        ? 'Sending new Code'
                                        : 'Resend code'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
                <Button
                    title={isSubmitLoading ? 'Loading...' : 'Verify'}
                    filled
                    style={styles.button}
                    onPress={handleOTPVerification}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    title1: {
        fontSize: 18,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginTop: 54,
    },
    title2: {
        fontSize: 18,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginBottom: 54,
    },
    OTPStyle: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.black,
        borderRadius: 8,
        height: 58,
        width: 58,
        backgroundColor: COLORS.secondaryWhite,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.4,
        borderWidth: 0.4,
        borderColor: 'gray',
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        justifyContent: 'center',
    },
    code: {
        fontSize: 18,
        fontFamily: 'medium',
        color: COLORS.greyscale900,
        textAlign: 'center',
    },
    time: {
        fontFamily: 'medium',
        fontSize: 18,
        color: COLORS.primary,
    },
    button: {
        borderRadius: 32,
    },
})

export default OTPVerification
