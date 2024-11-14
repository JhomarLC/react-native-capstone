import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { VaccineName } from '../data'
import { SIZES, COLORS, icons } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import AuthContext from '../contexts/AuthContext'
import { loadMedications, loadPetProfile } from '../services/PetsService'

const VetPetVaccination = ({ petowner, pet }) => {
    const [vaccine, setVaccine] = useState(VaccineName)
    const navigation = useNavigation()

    const loadPetData = async () => {
        try {
            const updatedPet = await loadPetProfile(petowner.id, pet.id) // Fetch latest pet data
            setPetData(updatedPet.data)
        } catch (error) {
            console.error('Failed to load pet data:', error)
        }
    }

    useEffect(() => {
        async function runEffect() {
            try {
                const result = await loadMedications()
                setVaccine(result.data)
            } catch (e) {
                console.log('Failed to load medications', e)
            }
        }
        runEffect()
    }, [])

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: COLORS.white,
                },
            ]}
        >
            <FlatList
                data={vaccine}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.cardContainer,
                            {
                                backgroundColor: COLORS.white,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.05,
                                shadowRadius: 4,
                                // Shadow for Android
                                elevation: 4,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('VetVaccineList', {
                                    pet_id: pet.id,
                                    pet_owner_id: petowner.id,
                                    medication: item,
                                    pet_status: pet.status,
                                    petowner: petowner,
                                    pet: pet,
                                })
                            }
                        >
                            <View style={styles.detailsViewContainer}>
                                <TouchableOpacity style={styles.iconContainer}>
                                    {/* <FontAwesome name="birthday-cake" //> */}
                                    <Image
                                        source={
                                            item.id === 1
                                                ? icons.vaccine
                                                : icons.deworm
                                        }
                                        resizeMode="contain"
                                        style={[
                                            styles.icon,
                                            {
                                                tintColor: COLORS.primary,
                                            },
                                        ]}
                                    />
                                </TouchableOpacity>

                                <Text
                                    style={[
                                        styles.name,
                                        {
                                            color: COLORS.greyscale900,
                                        },
                                    ]}
                                >
                                    {item.name}
                                </Text>
                            </View>
                            {/* <View style={[styles.separateLine, {
                marginVertical: 10,
                backgroundColor: COLORS.grayscale200,
              }]} /> */}
                            {/* <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("EReceipt")}
                  style={styles.receiptBtn}>
                  <Text style={styles.receiptBtnText}>View E-Receipt</Text>
                </TouchableOpacity>
              </View> */}
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.tertiaryWhite,
        marginVertical: 22,
    },
    cardContainer: {
        width: SIZES.width - 38,
        borderRadius: 18,
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
        marginLeft: 3,
        marginTop: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    statusContainer: {
        width: 62,
        height: 24,
        borderRadius: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.greeen,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.greeen,
        fontFamily: 'medium',
    },
    separateLine: {
        width: '100%',
        height: 0.7,
        backgroundColor: COLORS.greyScale800,
        marginVertical: 12,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 88,
        height: 88,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    detailsRightContainer: {
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginLeft: 20,
    },
    address: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 6,
    },
    serviceTitle: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
    },
    serviceText: {
        fontSize: 12,
        color: COLORS.primary,
        fontFamily: 'medium',
        marginTop: 6,
    },
    cancelBtn: {
        width: (SIZES.width - 32) / 2 - 16,
        height: 36,
        borderRadius: 24,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    cancelBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    receiptBtn: {
        width: SIZES.width - 32 - 12,
        height: 36,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        marginBottom: 12,
    },
    receiptBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    remindMeText: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: '100%',
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    removeButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
    },
    bottomSubtitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 12,
    },
    selectedCancelContainer: {
        marginVertical: 24,
        paddingHorizontal: 36,
        width: '100%',
    },
    cancelTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
    },
    cancelSubtitle: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
        marginVertical: 8,
        marginTop: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    totalPrice: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    duration: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        textAlign: 'center',
    },
    priceItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    reviewContainer: {
        position: 'absolute',
        top: 6,
        right: 16,
        width: 46,
        height: 20,
        borderRadius: 16,
        backgroundColor: COLORS.transparentWhite2,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rating: {
        fontSize: 12,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginLeft: 4,
    },
    detailsViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'start',
        width: '100%',
    },
    iconContainer: {
        borderRadius: 12,
        backgroundColor: COLORS.tansparentPrimary,
        padding: 15,
        alignItems: 'center', // Center the icon horizontally
        justifyContent: 'center', // Center the icon vertically
    },

    icon: {
        color: COLORS.primary,
        height: 25,
        width: 25,
    },
    chatIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary,
    },
})

export default VetPetVaccination
