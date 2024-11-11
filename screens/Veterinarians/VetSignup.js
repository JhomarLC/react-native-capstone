import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, { useCallback, useContext, useReducer, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../../constants'
import Header from '../../components/Header'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import Input from '../../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../../components/Button'
import {
    getFileType,
    launchImagePicker,
    launchSignaturePicker,
} from '../../utils/ImagePickerHelper'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import FlashMessage from 'react-native-flash-message'
import { showMessage, hideMessage } from 'react-native-flash-message'
import {
    loadUser,
    loadVetUser,
    register,
    registerVet,
} from '../../services/AuthService'
import { setToken } from '../../services/TokenService'
import AuthContext from '../../contexts/AuthContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'carlos.helder@clsu2.edu.ph' : '',
        password: isTestMode ? 'password' : '',
        password_confirmation: isTestMode ? 'password' : '',
        name: isTestMode ? 'Jhomar Candelario' : '',
        position: isTestMode ? 'Veterinary II' : '',
        license_number: isTestMode ? '1234567' : '',
        phone_number: isTestMode ? '09982369196' : '',
    },
    inputValidities: {
        email: false,
        password: false,
        password_confirmation: false,
        name: false,
        position: false,
        license_number: false,
        phone_number: false,
    },
    formIsValid: false,
}

const VetSignup = ({ navigation }) => {
    const { setUser, setRole } = useContext(AuthContext)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState({})
    const [isChecked, setChecked] = useState(false)
    const [image, setImage] = useState(null)
    const [signature, setSignature] = useState(null)

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            setError({})
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const pickImage = async () => {
        try {
            const imageData = await launchImagePicker() // Get the image data (uri, fileName, mimeType)

            if (!imageData) return

            setImage(imageData)
        } catch (error) {
            console.error(error) // Log error for debugging
        }
    }
    const pickSignature = async () => {
        try {
            const signatureData = await launchSignaturePicker() // Get the image data (uri, fileName, mimeType)

            if (!signatureData) return

            setSignature(signatureData)
        } catch (error) {
            console.error(error) // Log error for debugging
        }
    }
    const handleSignup = async () => {
        if (isLoading) {
            return
        }
        if (!image) {
            showMessage({
                message: 'No image selected. Please pick an image to upload.',
                type: 'danger',
            })
            return
        }

        if (!formState.formIsValid || !isChecked) {
            showMessage({
                message:
                    'Please fill out all fields and accept the Privacy Policy.',
                type: 'danger',
            })
            return
        }

        const {
            email,
            password,
            password_confirmation,
            name,
            position,
            license_number,
            phone_number,
        } = formState.inputValues

        const fileType = getFileType(image)
        const signatureFileType = getFileType(signature)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation', password_confirmation)
        formData.append('name', name)
        formData.append('position', position)
        formData.append('license_number', license_number)
        formData.append('phone_number', phone_number)

        if (image) {
            formData.append('image', {
                uri: image.startsWith('file://') ? image : `file://${image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
            formData.append('electronic_signature', {
                uri: signature.startsWith('file://')
                    ? signature
                    : `file://${signature}`,
                name: `photo.${signatureFileType.split('/')[1]}`,
                type: signatureFileType,
            })
        }

        setIsLoading(true)
        try {
            const data = await registerVet(formData)
            console.log(data)

            await setToken(data.api_token)
            const user = await loadVetUser()

            setRole('veterinarian')
            await AsyncStorage.setItem('role', 'veterinarian')
            console.log(user)
            setUser(user)
            navigation.replace('VetMain')
        } catch (e) {
            setIsLoading(false)
            console.log(e)
            if (e.response?.status === 422) {
                setError(e.response.data.errors)
                console.log(e.response.data.errors)
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
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Signup as Veterinarians" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 20,
                            alignItems: 'center',
                        }}
                    >
                        <View style={styles.logoContainer}>
                            <Image
                                source={
                                    image
                                        ? {
                                              uri: image,
                                          }
                                        : icons.userDefault2
                                }
                                resizeMode="cover"
                                style={styles.avatar}
                            />
                            <TouchableOpacity
                                onPress={pickImage}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.logoContainer}>
                            <Image
                                source={
                                    signature
                                        ? {
                                              uri: signature,
                                          }
                                        : icons.signature
                                }
                                resizeMode="contain"
                                style={styles.signature}
                            />
                            <TouchableOpacity
                                onPress={pickSignature}
                                style={styles.pickImage}
                            >
                                <MaterialCommunityIcons
                                    name="pencil-outline"
                                    size={24}
                                    color={COLORS.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <Input
                            id="email"
                            onInputChanged={inputChangedHandler}
                            errorText={error.email}
                            placeholder="Email"
                            icon={icons.email}
                            keyboardType="email-address"
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            onInputChanged={inputChangedHandler}
                            errorText={error.password}
                            autoCapitalize="none"
                            id="password"
                            placeholder="Password"
                            icon={icons.padlock}
                            secureTextEntry={true}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            onInputChanged={inputChangedHandler}
                            errorText={error.password_confirmation}
                            autoCapitalize="none"
                            id="password_confirmation"
                            placeholder="Password"
                            icon={icons.padlock}
                            secureTextEntry={true}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="name"
                            onInputChanged={inputChangedHandler}
                            errorText={error.name}
                            placeholder="Full Name"
                            icon={icons.user}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="position"
                            onInputChanged={inputChangedHandler}
                            errorText={error.position}
                            placeholder="Position"
                            icon={icons.apple}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="license_number"
                            onInputChanged={inputChangedHandler}
                            errorText={error.license_number}
                            placeholder="License Number"
                            icon={icons.shield}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="phone_number"
                            onInputChanged={inputChangedHandler}
                            errorText={error.phone_number}
                            placeholder="Phone Number"
                            placeholderTextColor={COLORS.gray}
                            icon={icons.telephone}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                color={isChecked ? COLORS.primary : 'gray'}
                                onValueChange={setChecked}
                            />
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={[
                                        styles.privacy,
                                        {
                                            color: COLORS.black,
                                        },
                                    ]}
                                >
                                    By continuing, you confirm that all
                                    information provided is accurate.
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Button
                        title={isLoading ? 'Loading...' : 'Sign Up'}
                        filled
                        onPress={handleSignup}
                        disabled={isLoading}
                        style={styles.button}
                    >
                        {isLoading && (
                            <ActivityIndicator
                                size="small"
                                color={COLORS.white}
                            />
                        )}
                    </Button>
                </ScrollView>
                <View style={styles.bottomContainer}>
                    <Text
                        style={[
                            styles.bottomLeft,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        Already have an account ?
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Login', {
                                email,
                                password,
                            })
                        }
                    >
                        <Text style={styles.bottomRight}> Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlashMessage position="top" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    signature: {
        height: 130,
        width: 130,
        borderRadius: 5,
    },
    pickImage: {
        height: 42,
        width: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    logo: {
        width: 100,
        height: 100,
        // tintColor: COLORS.primary
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
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 22,
    },
    checkBoxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 18,
    },
    checkbox: {
        marginRight: 8,
        height: 16,
        width: 16,
        borderRadius: 4,
        borderColor: COLORS.primary,
        borderWidth: 2,
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
})

export default VetSignup
