import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, illustrations, images } from '../../constants'
import Button from '../../components/Button'
import { launchImagePicker } from '../../utils/ImagePickerHelper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import PassingInput from '../../components/PassingInput'
import RNPickerSelect from 'react-native-picker-select'

const { width } = Dimensions.get('window')
const ITEM_SIZE = width / 2 - 24 // Adjusting size to fit 2 items per row

const SetPetProfile = ({ navigation, formData, setFormData }) => {
    const [image, setImage] = useState(formData.image)
    const [modalVisible, setModalVisible] = useState(false)

    const genders = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ]
    // Render modal
    const renderModal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContainer]}>
                        <View
                            style={[
                                styles.modalSubContainer,
                                {
                                    backgroundColor: COLORS.secondaryWhite,
                                },
                            ]}
                        >
                            <Image
                                source={illustrations.star}
                                resizeMode="contain"
                                style={styles.modalIllustration}
                            />
                            <Text style={styles.modalTitle}>Oops!</Text>
                            <Text
                                style={[
                                    styles.modalSubtitle,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                Please complete all fields before proceeding to
                                the next step.
                            </Text>
                            <Button
                                title="Okay"
                                filled
                                onPress={() => {
                                    setModalVisible(false)
                                }}
                                style={{
                                    width: '100%',
                                    marginTop: 12,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    const pickImage = async () => {
        try {
            const imageData = await launchImagePicker() // Get the image data (uri, fileName, mimeType)

            if (!imageData) return

            setImage(imageData)
            setFormData({ ...formData, image: imageData })
        } catch (error) {
            console.error(error) // Log error for debugging
        }
    }
    const determineSize = (weight) => {
        if (weight < 7) return 'Small'
        if (weight >= 7 && weight <= 14) return 'Medium'
        if (weight > 14) return 'Large'
        return '' // Default empty if input is cleared
    }

    const handleWeightChange = (text) => {
        const weight = parseFloat(text) || 0 // Parse input to a number, default to 0 if invalid
        const size = determineSize(weight) // Get size based on weight

        // Update formData with new weight and size values
        setFormData({
            ...formData,
            weight: text,
            size: size,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with title, step, and progress bar */}
            <View style={styles.header}>
                <Text style={styles.stepText}>Step 3/4</Text>
                <View style={styles.progressBar}>
                    <View style={styles.progress} />
                </View>
            </View>
            {renderModal()}
            <ScrollView showsHorizontalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginVertical: 12 }}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={
                                image
                                    ? { uri: image }
                                    : formData.image || icons.userDefault2 // Fallback image
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
                        <Text style={styles.label}>Pet Name *</Text>
                        <PassingInput
                            id="PetName"
                            value={formData.name}
                            onChangeText={(text) =>
                                setFormData({ ...formData, name: text })
                            }
                            placeholder="Pet Name"
                            icon={icons.pets}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <Text style={styles.label}>Color Description * </Text>
                        <PassingInput
                            id="ColorDescription"
                            value={formData.color_description}
                            onChangeText={(text) =>
                                setFormData({
                                    ...formData,
                                    color_description: text,
                                })
                            }
                            placeholder="Color Description"
                            icon={icons.pets}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        {/* Make this 2 PassingInput flex like they are in the same row. */}
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Weight (kg) *</Text>
                                <PassingInput
                                    id="Weight"
                                    value={formData.weight}
                                    onChangeText={handleWeightChange}
                                    keyboardType="numeric"
                                    placeholder="Weight (kg)"
                                    icon={icons.weight}
                                    placeholderTextColor={COLORS.gray}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Gender *</Text>
                                <View style={{ marginTop: 5 }}>
                                    <RNPickerSelect
                                        placeholder={{
                                            label: 'Select Gender',
                                            value: '',
                                        }}
                                        items={genders}
                                        onValueChange={
                                            (value) =>
                                                setFormData({
                                                    ...formData,
                                                    gender: value,
                                                })
                                            // setGender(value)
                                        }
                                        value={formData.gender}
                                        style={{
                                            inputIOS: {
                                                fontSize: 14,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                color: COLORS.black,
                                                paddingRight: 30,
                                                height: 52,
                                                alignItems: 'center',
                                                backgroundColor:
                                                    COLORS.greyscale500,
                                                borderRadius: 16,
                                            },
                                            inputAndroid: {
                                                fontFamily: 'regular',

                                                fontSize: 14,
                                                paddingHorizontal: 10,
                                                borderRadius: 8,
                                                color: COLORS.black,
                                                paddingRight: 30,
                                                height: 52,
                                                alignItems: 'center',
                                                backgroundColor:
                                                    COLORS.greyscale500,
                                                borderRadius: 16,
                                            },
                                        }}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputContainerHidden}>
                                <Text style={styles.label}>Size</Text>
                                <PassingInput
                                    id="Size"
                                    value={formData.size}
                                    placeholder="Size"
                                    icon={icons.dumbell2}
                                    placeholderTextColor={COLORS.gray}
                                    editable={false}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View
                style={[
                    styles.bottomContainer,
                    {
                        backgroundColor: COLORS.white,
                    },
                ]}
            >
                <Button
                    title="Previous"
                    style={styles.btnCancel}
                    onPress={() => navigation.navigate('SelectPetBreed')}
                />
                <Button
                    title="Next"
                    filled
                    style={styles.btnSubmit}
                    onPress={() => {
                        console.log('Current formData:', formData) // Log formData to verify
                        // Optional: Add validation checks
                        if (
                            !formData.image ||
                            !formData.name ||
                            !formData.color_description ||
                            !formData.weight ||
                            !formData.gender
                        ) {
                            setModalVisible(true)
                        } else {
                            navigation.navigate('SelectDOB')
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    avatar: {
        height: 130,
        width: 130,
        borderRadius: 65,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
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
    btnCancel: {
        width: (SIZES.width - 32) / 2 - 18,
        backgroundColor: COLORS.tansparentPrimary,
        borderWidth: 0,
    },
    btnSubmit: {
        width: (SIZES.width - 32) / 2 - 18,
    },
    bottomContainer: {
        bottom: 0,
        width: 'auto',
        height: 112,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    stepText: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    progressBar: {
        height: 4,
        width: '80%',
        backgroundColor: COLORS.lightGray,
        borderRadius: 2,
        marginTop: 8,
    },
    progress: {
        height: 4,
        width: '75%',
        backgroundColor: COLORS.primary,
        borderRadius: 2,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    inputContainer: {
        flex: 1,
    },
    inputContainerHidden: {
        display: 'none',
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

export default SetPetProfile
