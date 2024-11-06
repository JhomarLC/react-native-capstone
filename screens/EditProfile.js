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
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import Input from '../components/Input'
import Button from '../components/Button'
import AuthContext from '../contexts/AuthContext'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import { getFileType, launchImagePicker } from '../utils/ImagePickerHelper'
import { loadUser, updateprofile } from '../services/AuthService'
import { STORAGE_URL } from '@env'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

const EditProfile = ({ navigation }) => {
    const { user, setUser } = useContext(AuthContext)
    const pet_owner = user?.pet_owner || {}

    const initialState = {
        inputValues: {
            fullName: pet_owner.name || '',
            phoneNumber: pet_owner.phone_number || '',
            zone: pet_owner.addr_zone || '',
            barangay: pet_owner.addr_brgy || '',
        },
        formIsValid: false,
    }

    const [image, setImage] = useState(null)
    const [isImageFromLibrary, setIsImageFromLibrary] = useState(false)
    const [inputValues, setInputValues] = useState(initialState.inputValues)
    const [loading, setLoading] = useState(false)
    const barangays = [
        'A. Pascual',
        'Abar Ist',
        'Abar 2nd',
        'Bagong Sikat',
        'Caanawan',
        'Calaocan',
        'Camanacsacan',
        'Culaylay',
        'Dizol',
        'Kaliwanagan',
        'Kita-Kita',
        'Malasin',
        'Manicla',
        'Palestina',
        'Parang Mangga',
        'Villa Joson',
        'Pinili',
        'Rafael Rueda, Sr. Pob.',
        'Ferdinand E. Marcos Pob.',
        'Canuto Ramos Pob.',
        'Raymundo Eugenio Pob.',
        'Crisanto Sanchez Pob.',
        'Porais',
        'San Agustin',
        'San Juan',
        'San Mauricio',
        'Santo Niño 1st',
        'Santo Niño 2nd',
        'Santo Tomas',
        'Sibut',
        'Sinipit Bubon',
        'Santo Niño 3rd',
        'Tabulac',
        'Tayabo',
        'Tondod',
        'Tulat',
        'Villa Floresca',
        'Villa Marina',
    ]
    // Load initial image from pet_owner profile
    useEffect(() => {
        if (pet_owner?.image) {
            setImage({
                uri: `${STORAGE_URL}/petowners_profile/${pet_owner.image}`,
            })
            setIsImageFromLibrary(false)
        }
    }, [pet_owner])

    // Handle text input changes
    const inputChangedHandler = (inputId, inputValue) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [inputId]: inputValue,
        }))
    }

    // Pick image from the library
    const pickImage = async () => {
        try {
            const imageData = await launchImagePicker()
            if (!imageData) return
            setImage(imageData)
            setIsImageFromLibrary(true)
            console.log(imageData)
        } catch (error) {
            console.error(error)
        }
    }

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
        const { fullName, zone, barangay, phoneNumber } = inputValues
        const fileType = getFileType(image)
        const formData = new FormData()

        formData.append('name', fullName)
        formData.append('addr_zone', zone)
        formData.append('addr_brgy', barangay)
        formData.append('phone_number', phoneNumber)

        if (isImageFromLibrary && image) {
            formData.append('image', {
                uri: image.startsWith('file://') ? image : `file://${image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
        }

        try {
            await updateprofile(pet_owner.id, formData)

            const updatedUser = await loadUser()
            setUser(updatedUser)
            showMessage({
                message: 'Profile updated successfully!',
                type: 'success',
            })
            navigation.navigate('Profile')
        } catch (e) {
            console.log(e)
            showMessage({
                message: 'An error occurred. Please try again.',
                type: 'danger',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                <Header title="Edit Profile" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginVertical: 12 }}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={
                                    image
                                        ? { uri: image }
                                        : {
                                              uri: `${STORAGE_URL}/petowners_profile/${pet_owner.image}`,
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
                            </TouchableOpacity>
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
                        <Text style={styles.label}>Zone</Text>
                        <Input
                            id="zone"
                            value={inputValues.zone}
                            onInputChanged={inputChangedHandler}
                            placeholder="Zone"
                            icon={icons.location}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Barangay</Text>
                        <Input
                            id="barangay"
                            value={inputValues.barangay}
                            onInputChanged={inputChangedHandler}
                            placeholder="Barangay"
                            icon={icons.location}
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
        height: 130,
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

export default EditProfile
