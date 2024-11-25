import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native'
import React, {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, illustrations } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import CustomModal from '../components/CustomModal'
import { showMessage, hideMessage } from 'react-native-flash-message'
import { passwordReset, passwordVetReset } from '../services/PassswordService'
import AuthContext from '../contexts/AuthContext'

const isTestMode = true

const initialState = {
    inputValues: {
        newPassword: isTestMode ? '**********' : '',
        confirmNewPassword: isTestMode ? '**********' : '',
    },
    inputValidities: {
        newPassword: false,
        confirmNewPassword: false,
    },
    formIsValid: false,
}

const CreateNewPassword = ({ route, navigation }) => {
    const { code, user } = route.params
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const [isSubmitLoading, setSubmitIsLoading] = useState(false)
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
            Alert.alert('An error occured', error)
        }
    }, [error])
    const handleCreatingNewPassword = async () => {
        if (isSubmitLoading) {
            return
        }
        setSubmitIsLoading(true)

        const { newPassword, confirmNewPassword } = formState.inputValues
        const credentials = {
            code: code,
            password: newPassword,
            password_confirmation: confirmNewPassword,
        }
        try {
            let data

            if (user === 'veterinarian') {
                console.log('vet1')
                data = await passwordVetReset(credentials)
            } else if (user === 'petowner') {
                console.log('petowner1')
                data = await passwordReset(credentials)
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

                    if (user === 'veterinarian') {
                        navigation.replace('VetLogin')
                    } else if (user === 'petowner') {
                        navigation.replace('Login')
                    } else {
                        // Handle other user types or throw an error
                        throw new Error('Invalid user type')
                    }
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
                <Header title="Create New Password" />
                <CustomModal
                    visible={modalVisible}
                    onClose={modal.action}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={illustrations.newPassword}
                            resizeMode="contain"
                            style={styles.success}
                        />
                    </View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        Create Your New Password
                    </Text>
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['newPassword']}
                        autoCapitalize="none"
                        id="newPassword"
                        placeholder="New Password"
                        placeholderTextColor={COLORS.black}
                        icon={icons.padlock}
                        secureTextEntry={true}
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={
                            formState.inputValidities['confirmNewPassword']
                        }
                        autoCapitalize="none"
                        id="confirmNewPassword"
                        placeholder="Confirm New Password"
                        placeholderTextColor={COLORS.black}
                        icon={icons.padlock}
                        secureTextEntry={true}
                    />
                </ScrollView>
                <Button
                    title={isSubmitLoading ? 'Loading..' : 'Continue'}
                    filled
                    onPress={handleCreatingNewPassword}
                    style={styles.button}
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
    success: {
        width: SIZES.width * 0.8,
        height: 250,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 52,
    },
    title: {
        fontSize: 18,
        fontFamily: 'medium',
        color: COLORS.black,
        marginVertical: 12,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    privacy: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.black,
    },
    socialTitle: {
        fontSize: 19.25,
        fontFamily: 'medium',
        color: COLORS.black,
        textAlign: 'center',
        marginVertical: 26,
    },
    socialBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 18,
        position: 'absolute',
        bottom: 12,
        right: 0,
        left: 0,
    },
    bottomLeft: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'black',
    },
    bottomRight: {
        fontSize: 16,
        fontFamily: 'medium',
        color: COLORS.primary,
    },
    button: {
        marginVertical: 6,
        width: SIZES.width - 32,
        borderRadius: 30,
    },
    forgotPasswordBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 12,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.greyscale600,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSubContainer: {
        height: 494,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22,
    },
})

export default CreateNewPassword
