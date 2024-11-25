import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, illustrations, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import { forgotPassword, forgotVetPassword } from '../services/PassswordService'
import CustomModal from '../components/CustomModal'
import { showMessage, hideMessage } from 'react-native-flash-message'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
    },
    inputValidities: {
        email: false,
    },
    formIsValid: false,
}

const ForgotPasswordEmail = ({ route, navigation }) => {
    const { user } = route.params
    console.log(user)

    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false)
    const [modal, setModal] = useState({
        title: '',
        message: '',
        icon: '',
        action: '',
    })

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred', error)
        }
    }, [error])

    const handleForgotPassword = async () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)

        try {
            const email = formState.inputValues.email

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

            setModalVisible(true)
            setModal({
                title: 'Success!',
                message: data.message,
                icon: illustrations.star,
                action: () => {
                    setModalVisible(false)
                    navigation.replace('OTPVerification', {
                        email: email,
                        user: user,
                    })
                },
            })
        } catch (e) {
            setIsLoading(false)
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
            setIsLoading(false) // Set loading back to false after login attempt
        }
    }
    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Forgot Password" />
                <CustomModal
                    visible={modalVisible}
                    onClose={modal.action}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                />
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text style={styles.title}>Enter Your Email</Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Email"
                        placeholderTextColor={COLORS.black}
                        icon={icons.email}
                        keyboardType="email-address"
                    />
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button
                        title={isLoading ? 'Loading...' : 'Reset Password'}
                        filled
                        onPress={handleForgotPassword}
                        style={styles.button}
                    />
                </View>
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
    scrollViewContent: {
        paddingBottom: 100, // Ensure there's space above the button
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 28,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    button: {
        borderRadius: 30,
        width: SIZES.width - 32,
    },
})

export default ForgotPasswordEmail
