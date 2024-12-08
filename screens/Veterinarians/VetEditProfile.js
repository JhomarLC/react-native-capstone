import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { COLORS, SIZES, icons, illustrations } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'
import AuthContext from '../../contexts/AuthContext'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import { getFileType, launchImagePicker } from '../../utils/ImagePickerHelper'
import {
    loadUser,
    loadVetUser,
    updateprofile,
    updateVetprofile,
} from '../../services/AuthService'
import { STORAGE_URL } from '@env'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import CustomModal from '../../components/CustomModal'
import RNPickerSelect from 'react-native-picker-select'

const VetEditProfile = ({ route, navigation }) => {
    const { setUser } = useContext(AuthContext)
    const { veterinarian } = route.params
    const [modalVisible, setModalVisible] = useState(false)
    const [modal, setModal] = useState({
        title: '',
        message: '',
        icon: '',
        action: '',
    })

    useEffect(() => {
        setImage({
            uri: `${STORAGE_URL}/vet_profile/${veterinarian.image}`,
        })
    }, [])
    const initialState = {
        inputValues: {
            fullName: veterinarian.name || '',
            phoneNumber: veterinarian.phone_number || '',
            position: veterinarian.position || '',
            zone: veterinarian.addr_zone || '',
            barangay: veterinarian.addr_brgy || '',
            licenseNumber: veterinarian.license_number || '',
        },
        formIsValid: false,
    }

    const [image, setImage] = useState(null)
    const [isImageFromLibrary, setIsImageFromLibrary] = useState(false)
    const [inputValues, setInputValues] = useState(initialState.inputValues)
    const [loading, setLoading] = useState(false)

    const [selectedBarangay, setSelectedBarangay] = useState(
        veterinarian.addr_brgy
    )
    useEffect(() => {
        if (selectedBarangay) {
            setSelectedBarangay(selectedBarangay)
        }
    }, [selectedBarangay])

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
    // Handle text input changes
    const inputChangedHandler = (inputId, inputValue) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [inputId]: inputValue,
        }))
    }

    // // Pick image from the library
    // const pickImage = async () => {
    //     try {
    //         const imageData = await launchImagePicker()
    //         if (!imageData) return
    //         setImage(imageData)
    //         setIsImageFromLibrary(true)
    //         console.log(imageData)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // Handle profile update with loading indication
    const handleEditProfile = async () => {
        if (!image) {
            showMessage({
                message: 'No image selected. Please pick an image to upload.',
                type: 'danger',
            })
            return
        }

        setLoading(true)
        const { fullName, phoneNumber, zone, position, licenseNumber } =
            inputValues
        const fileType = getFileType(image)
        const formData = new FormData()
        console.log(zone, selectedBarangay)

        formData.append('name', fullName)
        formData.append('addr_zone', zone)
        formData.append('addr_brgy', selectedBarangay)
        formData.append('phone_number', phoneNumber)
        formData.append('position', position)
        formData.append('license_number', licenseNumber)

        if (isImageFromLibrary && image) {
            formData.append('image', {
                uri: image.startsWith('file://') ? image : `file://${image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
        }
        console.log(formData)

        try {
            await updateVetprofile(veterinarian.id, formData)
            const updatedUser = await loadVetUser()
            setUser(updatedUser)
            setModalVisible(true)
            setModal({
                title: 'Success!',
                message: 'Profile updated successfully!',
                icon: illustrations.star,
                action: () => {
                    setModalVisible(false)
                    navigation.navigate('VetProfile')
                },
            })
        } catch (e) {
            console.log(e)

            if (e.response?.status === 422) {
                console.log(e.response.data.errors)
                setError(e.response.data.errors)
            } else if (e.response?.status === 401) {
                showMessage({
                    message: e.response.data.message[0],
                    type: 'danger',
                })
            } else {
                console.log('An error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Edit Profile" />
                <CustomModal
                    visible={modalVisible}
                    onClose={modal.action}
                    title={modal.title}
                    message={modal.message}
                    icon={modal.icon}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View style={styles.avatarContainer}>
                            {/* <Image
                                source={
                                    image
                                        ? { uri: image }
                                        : {
                                              uri: `${STORAGE_URL}/vet_profiles/${veterinarian.image}`,
                                          }
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
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Full Name</Text>
                        <Input
                            id="fullName"
                            value={inputValues.fullName}
                            onInputChanged={inputChangedHandler}
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
                                    value={inputValues.zone}
                                    onInputChanged={inputChangedHandler}
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
                        <Text style={styles.label}>Phone Number</Text>
                        <Input
                            id="phoneNumber"
                            value={inputValues.phoneNumber}
                            onInputChanged={inputChangedHandler}
                            placeholder="Phone Number"
                            icon={icons.telephone}
                            placeholderTextColor={COLORS.gray}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Position</Text>
                        <Input
                            id="position"
                            value={inputValues.position}
                            onInputChanged={inputChangedHandler}
                            placeholder="Zone"
                            icon={icons.apple}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>License Number</Text>
                        <Input
                            id="licenseNumber"
                            value={inputValues.licenseNumber}
                            onInputChanged={inputChangedHandler}
                            placeholder="License Number"
                            icon={icons.creditCard}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.bottomContainer}>
                <Button
                    title={
                        loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            'Update'
                        )
                    }
                    filled
                    style={styles.continueButton}
                    onPress={handleEditProfile}
                    disabled={loading}
                />
            </View>
            <FlashMessage position="top" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    avatarContainer: {
        marginVertical: 12,
        alignItems: 'center',
        width: 130,
        height: 10,
        borderRadius: 65,
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
    bottomContainer: {
        position: 'absolute',
        bottom: 32,
        right: 16,
        left: 16,
        alignItems: 'center',
    },
    continueButton: {
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    inputSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: COLORS.gray,
        marginBottom: 4,
        marginLeft: 8,
    },
})

export default VetEditProfile
