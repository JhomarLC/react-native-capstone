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
import { COLORS, SIZES, icons, illustrations, images } from '../../constants'
import Header from '../../components/Header'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import Input from '../../components/Input'
import Checkbox from 'expo-checkbox'
import Button from '../../components/Button'
import { getFileType, launchImagePicker } from '../../utils/ImagePickerHelper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import FlashMessage from 'react-native-flash-message'
import { showMessage } from 'react-native-flash-message'
import { registerVet } from '../../services/AuthService'
import AuthContext from '../../contexts/AuthContext'
import CustomModal from '../../components/CustomModal'
const isTestMode = false
import { API_URL } from '@env'
import axios from 'axios'
import RNPickerSelect from 'react-native-picker-select'

const initialState = {
    inputValues: {
        email: isTestMode ? 'carlos.helder@clsu2.edu.ph' : '',
        password: isTestMode ? 'password' : '',
        password_confirmation: isTestMode ? 'password' : '',
        name: isTestMode ? 'Jhomar Candelario' : '',
        addr_zone: isTestMode ? '4' : '',
        position: isTestMode ? 'Veterinary II' : '',
        license_number: isTestMode ? '1234567' : '',
        phone_number: isTestMode ? '09982369196' : '',
    },
    inputValidities: {
        email: false,
        password: false,
        password_confirmation: false,
        addr_zone: false,
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
    const [selectedBarangay, setSelectedBarangay] = useState()

    const [error, setError] = useState({})
    const [isChecked, setChecked] = useState(false)
    const [image, setImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [modal, setModal] = useState({
        title: '',
        message: '',
        icon: '',
        action: '',
    })
    const [resendDisabled, setResendDisabled] = useState(false) // To disable "Get Code" button
    const [countdown, setCountdown] = useState(0) // Countdown timer state
    const [isSendingCode, setIsSendingCode] = useState(false) // Track loading state for "Get Code"

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            setError({})
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )
    const barangays = [
        { label: 'A. Pascual', value: 'A. Pascual' },
        { label: 'Abar Ist', value: 'Abar Ist' },
        { label: 'Abar 2nd', value: 'Abar 2nd' },
        { label: 'Bagong Sikat', value: 'Bagong Sikat' },
        { label: 'Caanawan', value: 'Caanawan' },
        { label: 'Calaocan', value: 'Calaocan' },
        { label: 'Camanacsacan', value: 'Camanacsacan' },
        { label: 'Culaylay', value: 'Culaylay' },
        { label: 'Dizol', value: 'Dizol' },
        { label: 'Kaliwanagan', value: 'Kaliwanagan' },
        { label: 'Kita-Kita', value: 'Kita-Kita' },
        { label: 'Malasin', value: 'Malasin' },
        { label: 'Manicla', value: 'Manicla' },
        { label: 'Palestina', value: 'Palestina' },
        { label: 'Parang Mangga', value: 'Parang Mangga' },
        { label: 'Villa Joson', value: 'Villa Joson' },
        { label: 'Pinili', value: 'Pinili' },
        { label: 'Rafael Rueda, Sr. Pob.', value: 'Rafael Rueda, Sr. Pob.' },
        {
            label: 'Ferdinand E. Marcos Pob.',
            value: 'Ferdinand E. Marcos Pob.',
        },
        { label: 'Canuto Ramos Pob.', value: 'Canuto Ramos Pob.' },
        { label: 'Raymundo Eugenio Pob.', value: 'Raymundo Eugenio Pob.' },
        { label: 'Crisanto Sanchez Pob.', value: 'Crisanto Sanchez Pob.' },
        { label: 'Porais', value: 'Porais' },
        { label: 'San Agustin', value: 'San Agustin' },
        { label: 'San Juan', value: 'San Juan' },
        { label: 'San Mauricio', value: 'San Mauricio' },
        { label: 'Santo Niño 1st', value: 'Santo Niño 1st' },
        { label: 'Santo Niño 2nd', value: 'Santo Niño 2nd' },
        { label: 'Santo Tomas', value: 'Santo Tomas' },
        { label: 'Sibut', value: 'Sibut' },
        { label: 'Sinipit Bubon', value: 'Sinipit Bubon' },
        { label: 'Santo Niño 3rd', value: 'Santo Niño 3rd' },
        { label: 'Tabulac', value: 'Tabulac' },
        { label: 'Tayabo', value: 'Tayabo' },
        { label: 'Tondod', value: 'Tondod' },
        { label: 'Tulat', value: 'Tulat' },
        { label: 'Villa Floresca', value: 'Villa Floresca' },
        { label: 'Villa Marina', value: 'Villa Marina' },
    ]

    const handleSendCode = async () => {
        const email = formState.inputValues.email
        if (formState.inputValidities.email) {
            showMessage({
                message:
                    'Please enter a valid email to get the verification code.',
                type: 'danger',
            })
            return
        }

        setIsSendingCode(true) // Start loading indicator
        try {
            // Example API call to send the verification code
            const res = await axios.post(
                `${API_URL}/vet-send-verification-email`,
                {
                    email,
                }
            )
            console.log(res)

            showMessage({
                message: 'Verification code sent to your email.',
                type: 'success',
            })
            setResendDisabled(true) // Disable resend button
            setCountdown(60) // Start countdown
        } catch (error) {
            showMessage({
                message: error.response.data.message,
                type: 'danger',
            })
        } finally {
            setIsSendingCode(false) // Stop loading indicator
        }
    }

    // Countdown logic
    useEffect(() => {
        if (countdown === 0) {
            setResendDisabled(false)
            return
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [countdown])

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
            verificationCode,
            password,
            password_confirmation,
            addr_zone,
            name,
            position,
            license_number,
            phone_number,
        } = formState.inputValues

        const fileType = getFileType(image)

        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)
        formData.append('password_confirmation', password_confirmation)
        formData.append('name', name)
        formData.append('addr_zone', addr_zone)
        formData.append('addr_brgy', selectedBarangay)
        formData.append('position', position)
        formData.append('license_number', license_number)
        formData.append('phone_number', phone_number)

        if (image) {
            formData.append('image', {
                uri: image.startsWith('file://') ? image : `file://${image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
        }

        setIsLoading(true)
        try {
            await axios.post(
                `${API_URL}/vet-verify-verification-email`,
                {
                    email: email,
                    verification_code: verificationCode,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )

            await registerVet(formData)
            setModalVisible(true)
            setModal({
                title: 'Success!',
                message:
                    'Your account is pending admin verification. You’ll be notified once it’s approved.',
                icon: illustrations.star,
                action: () => {
                    setModalVisible(false)
                    navigation.navigate('VetLogin')
                },
            })
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
            } else if (e.response?.status === 400) {
                showMessage({
                    message: e.response.data.message,
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
                {/* {renderModal()} */}
                <CustomModal
                    visible={modalVisible}
                    onClose={modal.action}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                />
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
                    </View>

                    <View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Email *</Text>
                            <Input
                                id="email"
                                onInputChanged={inputChangedHandler}
                                errorText={error.email}
                                placeholder="Email"
                                icon={icons.email}
                                keyboardType="email-address"
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>
                        <View style={styles.verificationContainer}>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}>
                                        Verification Code *
                                    </Text>
                                    <Input
                                        id="verificationCode"
                                        onInputChanged={inputChangedHandler}
                                        errorText={error.verification_code}
                                        placeholder="Verification Code"
                                        placeholderTextColor={COLORS.gray}
                                        icon={icons.shield}
                                    />
                                </View>
                            </View>
                            <View style={styles.buttonWrapper}>
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}></Text>
                                    <TouchableOpacity
                                        onPress={handleSendCode}
                                        disabled={resendDisabled}
                                        style={[
                                            styles.resendButton,
                                            resendDisabled &&
                                                styles.resendButtonDisabled,
                                        ]}
                                    >
                                        <Text style={styles.resendText}>
                                            {isSendingCode ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color={COLORS.white}
                                                />
                                            ) : (
                                                <Text style={styles.resendText}>
                                                    {resendDisabled
                                                        ? `${countdown}s`
                                                        : 'Get Code'}
                                                </Text>
                                            )}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Password *</Text>
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
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Confirm Password *</Text>
                            <Input
                                onInputChanged={inputChangedHandler}
                                errorText={error.password_confirmation}
                                autoCapitalize="none"
                                id="password_confirmation"
                                placeholder="Confirm Password"
                                icon={icons.padlock}
                                secureTextEntry={true}
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Full Name *</Text>
                            <Input
                                id="name"
                                onInputChanged={inputChangedHandler}
                                errorText={error.name}
                                placeholder="Full Name"
                                icon={icons.user}
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>
                        <View style={styles.verificationContainer}>
                            <View style={styles.inputWrapperZone}>
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}>Zone *</Text>
                                    <Input
                                        id="addr_zone"
                                        onInputChanged={inputChangedHandler}
                                        errorText={error.addr_zone}
                                        placeholder="Zone"
                                        icon={icons.location}
                                        placeholderTextColor={COLORS.gray}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View style={styles.inputWrapper}>
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}>Barangay *</Text>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Select Barangay',
                                            value: '',
                                        }}
                                        items={barangays}
                                        value={selectedBarangay}
                                        onValueChange={(value) =>
                                            setSelectedBarangay(value)
                                        }
                                        style={{
                                            inputAndroid: {
                                                borderRadius: 12,
                                                borderWidth: 1,
                                                marginVertical: 5,
                                                fontSize: 14,
                                                paddingHorizontal: 10,
                                                color: COLORS.black,
                                                paddingRight: 30,
                                                height: 52,
                                                alignItems: 'center',
                                                backgroundColor:
                                                    COLORS.greyscale500,
                                            },
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Position *</Text>
                            <Input
                                id="position"
                                onInputChanged={inputChangedHandler}
                                errorText={error.position}
                                placeholder="Position"
                                icon={icons.veterinarian}
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>License Number *</Text>
                            <Input
                                id="license_number"
                                onInputChanged={inputChangedHandler}
                                errorText={error.license_number}
                                placeholder="License Number"
                                icon={icons.shield}
                                placeholderTextColor={COLORS.gray}
                            />
                        </View>
                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Phone Number *</Text>
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
                </ScrollView>
                <View style={styles.bottomContainer}>
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
                </View>
            </View>
            <FlashMessage position="top" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 4,
        marginLeft: 8,
    },
    buttonWrapper: {
        marginTop: 10,
    },
    verificationContainer: {
        flexDirection: 'row',
        // marginVertical: 10,
    },
    inputWrapper: {
        flex: 1, // Input takes up remaining space
        marginRight: 10, // Add space between input and button
    },
    inputWrapperZone: {
        width: '30%',
        // flex: 1, // Input takes up remaining space
        marginRight: 10, // Add space between input and button
    },
    resendButton: {
        width: 100, // Fixed width for the button
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendButtonDisabled: {
        backgroundColor: COLORS.gray,
    },
    resendText: {
        color: COLORS.white,
        textAlign: 'center',
    },
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

    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: COLORS.white,
        position: 'absolute',
        right: 16,
        top: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
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
        color: COLORS.black2,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
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

export default VetSignup
