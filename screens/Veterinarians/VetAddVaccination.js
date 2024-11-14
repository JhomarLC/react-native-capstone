import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    Alert,
} from 'react-native'
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useReducer,
} from 'react'
import {
    COLORS,
    SIZES,
    icons,
    images,
    FONTS,
    illustrations,
} from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    categories,
    doctors,
    ratings,
    vaccineDetails,
    vaccineData,
} from '../../data'
import NotFoundCard from '../../components/NotFoundCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../../components/Button'
import { FontAwesome } from '@expo/vector-icons'
import HorizontalVaccineListInfo from '../../components/HorizontalVaccineListInfo'
import { ScrollView } from 'react-native-virtualized-view'
import SubHeaderItem from '../../components/SubHeaderItem'
import Input from '../../components/Input'
import { reducer } from '../../utils/reducers/formReducers'
import { validateInput } from '../../utils/actions/formActions'
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import DatePickerModal from '../../components/DatePickerModal'
import { getFormatedDate } from 'react-native-modern-datepicker'
import RNPickerSelect from 'react-native-picker-select'

import {
    addMedication,
    loadMedicationNames,
} from '../../services/MedicationService'
import CustomModal from '../../components/CustomModal'

const isTestMode = true

const initialState = {
    inputValues: {
        batch_number: '',
        registration_fee: '',
    },
    inputValidities: {
        batch_number: false,
        registration_fee: false,
    },
    formIsValid: false,
}

const VetAddVaccination = ({ route, navigation }) => {
    const [medicationName, setMedicationName] = useState({})
    const { medication, pet_id, pet_status, pet, petowner } = route.params

    const [error, setError] = useState()
    const [formState, dispatchFormState] = useReducer(reducer, initialState)
    const [selectedRemarks, setSelectedRemarks] = useState('')
    const [selectedORNO, setSelectedORNO] = useState('')
    const [selectedMedName, setSelectedMedName] = useState('')

    const [modalVisible, setModalVisible] = useState(false)
    const [modal, setModal] = useState({
        title: '',
        message: '',
        icon: '',
        action: '',
    })
    const remarksOption = [
        { label: 'Walk-in', value: 'Walk-in' },
        { label: 'Mass', value: 'Mass' },
    ]
    const orNo = [
        { label: 'Registered', value: 'Registered' },
        { label: 'Unregistered', value: 'Unregistered' },
    ]

    const today = new Date()
    const startDate = getFormatedDate(
        new Date(today.setDate(today.getDate())),
        'YYYY-MM-DD'
    )
    const defaulVaccinationDate = getFormatedDate(
        new Date(today.setDate(today.getDate())),
        'YYYY-MM-DD'
    )
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false)
    const [openExpiryDatePicker, setOpenExpiryDatePicker] = useState(false)
    const [openVaccinationDatePicker, setOpenVaccinationDatePicker] =
        useState(false)
    const [openNextVaccinationPicker, setOpenNextVaccinationPicker] =
        useState(false)

    const [startedDate, setStartedDate] = useState(startDate)
    const [expiryDate, setExpiryDate] = useState('')
    const [vaccinationDate, setVaccinationDate] = useState(
        defaulVaccinationDate
    )
    const [nextVaccinationDate, setNextVaccinationDate] = useState('')

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker)
    }
    const handleOnPressExpiryDate = () => {
        setOpenExpiryDatePicker(!openExpiryDatePicker)
    }
    const handleOnPressVaccinationDate = () => {
        setOpenVaccinationDatePicker(!openVaccinationDatePicker)
    }
    const handleOnPressNextVaccinationDate = () => {
        setOpenNextVaccinationPicker(!openNextVaccinationPicker)
    }

    const handleRemarksChange = (value) => {
        setSelectedRemarks(value)
    }
    const handleMedName = (value) => {
        setSelectedMedName(value)
    }
    const handleORNO = (value) => {
        setSelectedORNO(value)
    }
    // const expiryDateFormatted = getFormatedDate(
    //     new Date(today.setDate(today.getDate())),
    //     'YYYY-MM-DD'
    // )
    // const vaccinationDateFormatted = getFormatedDate(
    //     new Date(today.setDate(today.getDate())),
    //     'YYYY-MM-DD'

    const inputChangedHandler = useCallback(
        (inputId, inputValue) => {
            const result = validateInput(inputId, inputValue)
            dispatchFormState({ inputId, validationResult: result, inputValue })
        },
        [dispatchFormState]
    )

    const addVaccinationRecord = async () => {
        const vaccinationData = {
            medication_name_id: selectedMedName || '',
            batch_number: formState.inputValues.batch_number || '',
            expiry_date: expiryDate || '',
            medication_date: vaccinationDate || '',
            next_vaccination: nextVaccinationDate || '',
            remarks: selectedRemarks || '',
            or_number: selectedORNO || '',
            fee: formState.inputValues.registration_fee || 0,
        }

        // Check if any required field is missing
        const missingFields = []

        if (!vaccinationData.medication_name_id)
            missingFields.push('Medication Name')
        if (!vaccinationData.batch_number) missingFields.push('Batch Number')
        if (!vaccinationData.expiry_date) missingFields.push('Expiry Date')
        if (!vaccinationData.medication_date)
            missingFields.push('Vaccination Date')
        if (!vaccinationData.remarks) missingFields.push('Remarks')
        if (!vaccinationData.or_number) missingFields.push('OR Number')

        if (missingFields.length > 0) {
            // Log missing fields and prevent submission

            setModalVisible(true)
            setModal({
                title: 'Oops!',
                message:
                    'Please complete all required fields before proceeding. Required Fields: ' +
                    missingFields.join(', '),
                icon: illustrations.notFound,
                action: () => {
                    setModalVisible(false)
                },
            })
            return
        }

        // Proceed with adding vaccination only if all fields are present
        try {
            await addMedication(pet_id, vaccinationData)
            // console.log(data)
            setModalVisible(true)
            setModal({
                title: 'Success!',
                message: 'Medication Successfully Added!',
                icon: illustrations.star,
                action: () => {
                    setModalVisible(false)
                    navigation.replace('VetVaccineList', {
                        pet_id: pet_id,
                        medication: medication,
                        pet_status: pet_status,
                        pet: pet,
                        petowner: petowner,
                    })
                },
            })
        } catch (e) {
            console.log('====================================')
            console.log(e.response.data.message)
            console.log('====================================')

            if (e.response?.status === 422) {
                console.log(e.response)
                setError(e.response.data.errors)
            } else if (e.response?.status == 401) {
                setMessage(e.response.data.message)
            } else {
                showMessage({
                    message: 'Adding vaccination failed. Please try again.',
                    type: 'danger',
                })
            }
        }
    }

    useEffect(() => {
        const fetchMedicationNames = async () => {
            const result = await loadMedicationNames(medication.id)

            const formattedMedication = formatMedications(result.data)
            setMedicationName(formattedMedication)
            console.log(result)
        }

        function formatMedications(data) {
            return data.map((item) => ({
                label: item.name,
                value: item.id,
            }))
        }

        fetchMedicationNames()
    }, [])

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error)
        }
    }, [error])

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
                                source={illustrations.passwordSuccess}
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
                                Your account is ready to use. You will be
                                redirected to the Home page in a few seconds..
                            </Text>
                            <Button
                                title="Continue"
                                filled
                                onPress={() => {
                                    setModalVisible(false)
                                    navigation.navigate('Login')
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
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[
                                styles.backIcon,
                                {
                                    tintColor: COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={[
                                styles.name,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            Add Medication
                        </Text>
                        <Text
                            style={[
                                styles.headerTitle,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            {medication.name}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <CustomModal
                visible={modalVisible}
                onClose={modal.action}
                title={modal.title}
                message={modal.message}
                icon={modal.icon}
            />
            <DatePickerModal
                open={openExpiryDatePicker}
                startDate={startDate}
                selectedDate={expiryDate}
                onClose={() => setOpenExpiryDatePicker(false)}
                onChangeStartDate={(date) => setExpiryDate(date)}
            />
            <DatePickerModal
                open={openVaccinationDatePicker}
                // startDate={expiryDate}
                selectedDate={vaccinationDate}
                onClose={() => setOpenVaccinationDatePicker(false)}
                onChangeStartDate={(date) => setVaccinationDate(date)}
            />
            <DatePickerModal
                open={openNextVaccinationPicker}
                startDate={startDate}
                selectedDate={nextVaccinationDate}
                onClose={() => setOpenNextVaccinationPicker(false)}
                onChangeStartDate={(date) => setNextVaccinationDate(date)}
            />
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {/* {renderContent()} */}
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                <View>
                    <View>
                        <Text style={[styles.bottomTitle]}>
                            Medication Name *
                        </Text>
                        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Medication Name',
                                        value: '',
                                    }}
                                    items={medicationName}
                                    onValueChange={(value) =>
                                        handleMedName(value)
                                    }
                                    value={selectedMedName}
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
                    </View>
                    {/* Details */}
                    <View>
                        <Text style={[styles.bottomTitle]}>Details</Text>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 10,
                            }}
                        >
                            <View style={{ marginTop: 10, width: '45%' }}>
                                <Text style={[styles.VaccineDetails]}>
                                    Batch No * :
                                </Text>
                                <View>
                                    <Input
                                        id="batch_number"
                                        onInputChanged={inputChangedHandler}
                                        errorText={
                                            formState.inputValidities[
                                                'batch_number'
                                            ]
                                        }
                                        placeholder="Batch No."
                                        placeholderTextColor={COLORS.gray}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 10, width: '45%' }}>
                                <Text style={[styles.VaccineDetails]}>
                                    Expiry Date * :
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.inputBtn,
                                        {
                                            backgroundColor:
                                                COLORS.greyscale500,
                                            borderColor: COLORS.greyscale500,
                                            marginTop: 5,
                                        },
                                    ]}
                                    onPress={handleOnPressExpiryDate}
                                >
                                    {expiryDate ? (
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.black,
                                            }}
                                        >
                                            {expiryDate}
                                        </Text>
                                    ) : (
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.gray,
                                            }}
                                        >
                                            Select Expiry
                                        </Text>
                                    )}

                                    <Feather
                                        name="calendar"
                                        size={24}
                                        color={COLORS.grayscale400}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* Date */}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={[styles.bottomTitle, { width: '45%' }]}>
                            Registration
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginHorizontal: 10,
                        }}
                    >
                        <View style={{ marginTop: 10, width: '45%' }}>
                            <Text style={[styles.VaccineDetails]}>Fee :</Text>
                            <View>
                                <Input
                                    id="registration_fee"
                                    onInputChanged={inputChangedHandler}
                                    errorText={
                                        formState.inputValidities[
                                            'registration_fee'
                                        ]
                                    }
                                    placeholder="Registration Fee"
                                    placeholderTextColor={COLORS.gray}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10, width: '45%' }}>
                            <Text style={[styles.VaccineDetails]}>
                                OR No * :
                            </Text>
                            <View style={{ marginTop: 5 }}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Reg / Unreg',
                                        value: '',
                                    }}
                                    items={orNo}
                                    onValueChange={(value) => handleORNO(value)}
                                    value={selectedORNO}
                                    style={{
                                        inputIOS: {
                                            fontSize: 14,
                                            paddingHorizontal: 10,
                                            borderRadius: 4,
                                            color: COLORS.black,
                                            paddingRight: 30,
                                            height: 52,
                                            alignItems: 'center',
                                            backgroundColor: COLORS.gray,
                                            borderRadius: 16,
                                        },
                                        inputAndroid: {
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
                    </View>
                    <View>
                        <Text style={[styles.bottomTitle]}>Date</Text>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 10,
                            }}
                        >
                            <View style={{ marginTop: 10, width: '45%' }}>
                                <Text style={[styles.VaccineDetails]}>
                                    Vaccination Date :
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.inputBtn,
                                        {
                                            backgroundColor:
                                                COLORS.greyscale500,
                                            borderColor: COLORS.greyscale500,
                                            marginTop: 5,
                                        },
                                    ]}
                                    onPress={handleOnPressVaccinationDate}
                                >
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            color: COLORS.black,
                                        }}
                                    >
                                        {vaccinationDate}
                                    </Text>
                                    <Feather
                                        name="calendar"
                                        size={24}
                                        color={COLORS.grayscale400}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10, width: '45%' }}>
                                <Text style={[styles.VaccineDetails]}>
                                    Next Vaccination Date :
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.inputBtn,
                                        {
                                            backgroundColor:
                                                COLORS.greyscale500,
                                            borderColor: COLORS.greyscale500,
                                            marginTop: 5,
                                        },
                                    ]}
                                    onPress={handleOnPressNextVaccinationDate}
                                >
                                    {nextVaccinationDate ? (
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.black,
                                            }}
                                        >
                                            {nextVaccinationDate}
                                        </Text>
                                    ) : (
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.gray,
                                            }}
                                        >
                                            Next vaccination?
                                        </Text>
                                    )}

                                    <Feather
                                        name="calendar"
                                        size={24}
                                        color={COLORS.grayscale400}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    {/* Registration */}

                    <View>
                        <Text style={[styles.bottomTitle]}>Remarks *</Text>
                        <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                            <View>
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'Remarks',
                                        value: '',
                                    }}
                                    items={remarksOption}
                                    onValueChange={(value) =>
                                        handleRemarksChange(value)
                                    }
                                    value={selectedRemarks}
                                    style={{
                                        inputIOS: {
                                            fontSize: 14,
                                            paddingHorizontal: 10,
                                            borderRadius: 4,
                                            color: COLORS.black,
                                            paddingRight: 30,
                                            height: 52,
                                            alignItems: 'center',
                                            backgroundColor: COLORS.gray,
                                            borderRadius: 16,
                                        },
                                        inputAndroid: {
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
                    </View>
                </View>

                <View style={styles.bottomContainer}>
                    <Button
                        title="Add Record"
                        filled
                        style={styles.logoutButton}
                        onPress={addVaccinationRecord}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputBtn: {
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.greyscale500,
        height: 52,
        paddingLeft: 8,
        paddingVertical: 10, // Increase padding if needed
        fontSize: 18,
        justifyContent: 'space-between',
        backgroundColor: COLORS.greyscale500,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },

    VaccineDetails: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },

    scrollView: {
        marginBottom: 'auto',
    },
    bottomContainerQR: {
        marginVertical: 12,
        paddingHorizontal: 5,
        width: SIZES.width,
    },
    btnAddVaccine: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 16,
        marginRight: 10,
        marginTop: 20,
    },
    addIcon: {
        height: 12,
        width: 12,
        tintColor: COLORS.primary,
        marginRight: 5,
    },
    name: {
        color: COLORS.greyscale900,
        marginLeft: 20,
    },

    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    imageVet: {
        height: 70,
        width: 70,
        borderRadius: '50%',
    },
    imageSignature: {
        height: 70,
        width: 70,
    },

    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    tabBtn: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    selectedTab: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    tabBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    selectedTabText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
        textAlign: 'center',
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    subResult: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    resultLeftView: {
        flexDirection: 'row',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        // width: SIZES.width,
        marginTop: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
        textColor: COLORS.primary,
    },
    logoutButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        // textAlign: "center",
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    sheetTitle: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginVertical: 12,
        paddingLeft: 10,
    },
    reusltTabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    viewDashboard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 36,
        justifyContent: 'space-between',
    },
    dashboardIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    tabText: {
        fontSize: 20,
        fontFamily: 'semiBold',
        color: COLORS.black,
    },
})

export default VetAddVaccination
