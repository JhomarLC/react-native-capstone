import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../../constants'
import Header from '../../components/Header'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import Input from '../../components/Input'
import Button from '../../components/Button'
import {
    loadUser,
    loadVetUser,
    login,
    loginAsVet,
} from '../../services/AuthService'
import AuthContext from '../../contexts/AuthContext'
import { showMessage, hideMessage } from 'react-native-flash-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'example@gmail.com' : '',
        password: isTestMode ? '**********' : '',
    },
    inputValidities: {
        email: false,
        password: false,
    },
    formIsValid: false,
}

const VetLogin = ({ navigation }) => {
    const { setUser, setRole } = useContext(AuthContext)

    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false) // Loading state for login button

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            console.log(result)

            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    useEffect(() => {
        if (error) {
            showMessage({
                message: 'An error occurred.',
                type: 'danger',
            })
        }
    }, [error])

    useEffect(() => {
        if (message) {
            showMessage({
                message: message,
                type: 'danger',
            })
        }
    }, [message])

    const onLoginPress = async () => {
        if (loading) return // Prevent multiple requests if already loading
        setMessage('')
        setError(null)

        if (!formState.formIsValid) {
            showMessage({
                message:
                    'Invalid Input. Please enter a valid email and password.',
                type: 'danger',
            })
            return
        }

        setLoading(true) // Set loading to true when login starts
        try {
            const email = formState.inputValues.email
            const password = formState.inputValues.password
            await loginAsVet({ email, password })
            const user = await loadVetUser()
            setRole('veterinarian')
            await AsyncStorage.setItem('role', 'veterinarian')
            setUser(user)

            navigation.replace('VetMain')
        } catch (e) {
            if (e.response?.status === 422) {
                setError(e.response.data.errors)
            } else if (e.response?.status == 401) {
                setMessage(e.response.data.message)
            } else {
                showMessage({
                    message: 'Login failed. Please try again.',
                    type: 'danger',
                })
            }
        } finally {
            setLoading(false) // Set loading back to false after login attempt
        }
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Veterinarian" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logo}
                        />
                    </View>
                    <Text style={[styles.title, { color: COLORS.black }]}>
                        Login to Your Account
                    </Text>
                    <Input
                        id="email"
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['email']}
                        placeholder="Email"
                        placeholderTextColor={COLORS.black}
                        icon={icons.email}
                        keyboardType="email-address"
                    />
                    <Input
                        onInputChanged={inputChangedHandler}
                        errorText={formState.inputValidities['password']}
                        autoCapitalize="none"
                        id="password"
                        placeholder="Password"
                        placeholderTextColor={COLORS.black}
                        icon={icons.padlock}
                        secureTextEntry={true}
                    />

                    <Button
                        title={loading ? 'Loading...' : 'Login'}
                        filled
                        onPress={onLoginPress}
                        disabled={loading} // Disable button while loading
                        style={styles.button}
                    >
                        {loading && (
                            <ActivityIndicator
                                size="small"
                                color={COLORS.white}
                            />
                        )}
                    </Button>

                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('ForgotPasswordMethods')
                        }
                    >
                        <Text style={styles.forgotPasswordBtnText}>
                            Forgot the password?
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text style={[styles.bottomLeft, { color: COLORS.black }]}>
                        Don't have an account?
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('VetSignup')}
                    >
                        <Text style={styles.bottomRight}>{'  '}Sign Up</Text>
                    </TouchableOpacity>
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
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
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
})

export default VetLogin
