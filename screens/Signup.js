import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
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
import { COLORS, SIZES, icons, images } from '../constants'
import Header from '../components/Header'
import { reducer } from '../utils/reducers/formReducers'
import { validateInput } from '../utils/actions/formActions'
import Input from '../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../components/Button'
import { getFileType, launchImagePicker } from '../utils/ImagePickerHelper'
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons'
import FlashMessage from 'react-native-flash-message'
import { showMessage, hideMessage } from 'react-native-flash-message'
import { loadUser, register } from '../services/AuthService'
import { setToken } from '../services/TokenService'
import AuthContext from '../contexts/AuthContext'
import { API_URL } from '@env'
import axios from 'axios'
const isTestMode = true

const initialState = {
    inputValues: {
        email: isTestMode ? 'carlos.helder@clsu2.edu.ph' : '',
        password: isTestMode ? 'password' : '',
        password_confirmation: isTestMode ? 'password' : '',
        name: isTestMode ? 'Jhomar Candelario' : '',
        addr_zone: isTestMode ? '4' : '',
        addr_brgy: isTestMode ? 'Caanawan' : '',
        phone_number: isTestMode ? '09982369196' : '',
    },
    inputValidities: {
        email: false,
        password: false,
        password_confirmation: false,
        name: false,
        addr_zone: false,
        addr_brgy: false,
        phone_number: false,
    },
    formIsValid: false,
}

const Signup = ({ navigation }) => {
    const { setUser } = useContext(AuthContext)
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState(null)
    const [isChecked, setChecked] = useState(false)
    const [image, setImage] = useState(null)

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

    const pickImage = async () => {
        try {
            const imageData = await launchImagePicker() // Get the image data (uri, fileName, mimeType)

            if (!imageData) return

            setImage(imageData)
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
            addr_zone,
            addr_brgy,
            phone_number,
        } = formState.inputValues

        const fileType = getFileType(image)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation', password_confirmation)
        formData.append('name', name)
        formData.append('addr_zone', addr_zone)
        formData.append('addr_brgy', addr_brgy)
        formData.append('phone_number', phone_number)

        if (image) {
            formData.append('image', {
                uri: image.startsWith('file://') ? image : `file://${image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
        }

        try {
            const { data } = await axios.post(
                `${API_URL}/petowner/register`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            console.log(data)

            await setToken(data.api_token)
            const user = await loadUser()
            setUser(user)
            navigation.replace('Main')
        } catch (e) {
            setIsLoading(false)
            console.log(e)
            if (e.response?.status === 422) {
                console.log(e.response.data.errors)
            } else if (e.response?.status === 401) {
                console.log(e.response.data.message)
            } else {
                console.log('An error occurred. Please try again.')
            }
        }
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Create your account" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
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
                    </View>

                    <View>
                        <Input
                            id="email"
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['email']}
                            placeholder="Email"
                            icon={icons.email}
                            keyboardType="email-address"
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['password']}
                            autoCapitalize="none"
                            id="password"
                            placeholder="Password"
                            icon={icons.padlock}
                            secureTextEntry={true}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            onInputChanged={inputChangedHandler}
                            errorText={
                                formState.inputValidities[
                                    'password_confirmation'
                                ]
                            }
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
                            errorText={formState.inputValidities['name']}
                            placeholder="Full Name"
                            icon={icons.user}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="addr_zone"
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['addr_zone']}
                            placeholder="Zone"
                            icon={icons.location}
                            placeholderTextColor={COLORS.gray}
                            keyboardType="numeric"
                        />
                        <Input
                            id="addr_brgy"
                            onInputChanged={inputChangedHandler}
                            errorText={formState.inputValidities['addr_brgy']}
                            placeholder="Brgy"
                            icon={icons.location2}
                            placeholderTextColor={COLORS.gray}
                        />
                        <Input
                            id="phone_number"
                            onInputChanged={inputChangedHandler}
                            errorText={
                                formState.inputValidities['phone_number']
                            }
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
                                    By continuing you accept our Privacy Policy
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

export default Signup
