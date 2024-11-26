import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    Modal,
    TouchableWithoutFeedbackBase,
} from 'react-native'

import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, illustrations, images } from '../../constants'
import Button from '../../components/Button'
import { getFileType, launchImagePicker } from '../../utils/ImagePickerHelper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import PassingInput from '../../components/PassingInput'
import DateTimePicker from 'react-native-ui-datepicker'
import dayjs from 'dayjs'
import { addPet } from '../../services/PetsService'
import AuthContext from '../../contexts/AuthContext'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const { width } = Dimensions.get('window')
const ITEM_SIZE = width / 2 - 24 // Adjusting size to fit 2 items per row

const SelectDOB = ({ navigation, formData, setFormData }) => {
    const [date, setDate] = useState(formData.dob)
    const { user } = useContext(AuthContext)
    const { pet_owner } = user
    const [modalVisible, setModalVisible] = useState(false)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAddPet = async () => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        // Ensure type is correctly set using a type map
        const typeMap = { 1: 'Dog', 2: 'Cat' }
        const selectedType = typeMap[formData.type]
        console.log(date)

        const updatedFormData = {
            ...formData,
            type: selectedType,
        }
        const fileType = getFileType(updatedFormData.image)

        const fData = new FormData()
        fData.append('pet_type', updatedFormData.type)
        fData.append('gender', updatedFormData.gender)
        fData.append('breed', updatedFormData.breed)
        fData.append('name', updatedFormData.name)
        fData.append('color_description', updatedFormData.color_description)
        fData.append('weight', updatedFormData.weight)
        fData.append('size', updatedFormData.size)
        fData.append('date_of_birth', updatedFormData.dob)

        if (updatedFormData.image) {
            fData.append('image', {
                uri: updatedFormData.image.startsWith('file://')
                    ? updatedFormData.image
                    : `file://${updatedFormData.image}`,
                name: `photo.${fileType.split('/')[1]}`,
                type: fileType,
            })
        }
        console.log('Pet Data:', fData)

        // Show confirmation alert
        try {
            await addPet(pet_owner.id, fData)
            setMessage(
                `${updatedFormData.name} has been added as a ${updatedFormData.type}.`
            )
            setModalVisible(true)
            setIsLoading(false)
        } catch (e) {
            setIsLoading(false)
            console.log('Error Message:', e.message)
            console.log('Error Response Data:', e.response?.data)
            console.log('Error Status:', e.response?.status)

            Alert.alert(
                'Error',
                e.response?.status === 500
                    ? 'A server error occurred. Please try again later.'
                    : e.response?.data?.message ||
                          'An error occurred. Please try again.'
            )
        }
    }

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
                            <Text style={styles.modalTitle}>
                                Congratulations!
                            </Text>
                            <Text
                                style={[
                                    styles.modalSubtitle,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {message}
                            </Text>
                            <Button
                                title="Continue"
                                filled
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate('Home')
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
    return (
        <SafeAreaView style={styles.container}>
            {/* Header with title, step, and progress bar */}
            <View style={styles.header}>
                <Text style={styles.stepText}>Step 4/4</Text>
                <View style={styles.progressBar}>
                    <View style={styles.progress} />
                </View>
            </View>

            {renderModal()}

            <ScrollView showsHorizontalScrollIndicator={false}>
                <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 12,
                    }}
                >
                    <DateTimePicker
                        mode="single"
                        date={date}
                        maxDate={new Date()}
                        onChange={(params) => {
                            const formattedDate = dayjs(params.date).format(
                                'YYYY-MM-DD'
                            )
                            setDate(formattedDate)

                            setFormData({
                                ...formData,
                                dob: formattedDate,
                            })
                        }}
                    />
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
                    onPress={() => navigation.navigate('SetPetProfile')}
                />
                <Button
                    title={isLoading ? 'Loading...' : 'Add Pet'}
                    filled
                    style={styles.btnSubmit}
                    // onPress={() => navigation.navigate('FinalScreen')}
                    onPress={handleAddPet}
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
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
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
export default SelectDOB
