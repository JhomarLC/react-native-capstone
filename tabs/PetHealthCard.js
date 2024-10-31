import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { upcomingAppointments } from '../data'
import { SIZES, COLORS, icons, images } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { useNavigation } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { loadPetProfile } from '../services/PetsService'
import AuthContext from '../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import QRCode from 'react-native-qrcode-svg'

const PetHealthCard = ({ pet_id }) => {
    const [pet, setPet] = useState(null)
    const { user } = useContext(AuthContext)
    const pet_owner = user?.pet_owner

    useEffect(() => {
        async function runEffect() {
            try {
                const pet_profile = await loadPetProfile(pet_owner.id, pet_id)
                setPet(pet_profile.data)
            } catch (e) {
                console.log('Failed to load pet profile', e)
            }
        }
        runEffect()
    }, [])
    if (!pet) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>
                    Loading pet information...
                </Text>
            </View>
        )
    }
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, options)
    }
    return (
        <View style={[styles.wrapper]}>
            <ScrollView
                style={[styles.scrollView]}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View>
                        {/* <View style={{ backgroundColor: COLORS.tertiaryWhite }}> */}
                        <View
                            style={[
                                styles.doctorCard,
                                {
                                    backgroundColor: COLORS.white,
                                },
                            ]}
                        >
                            <Image
                                source={{
                                    uri: `${STORAGE_URL}/pet_profile/${pet.image}`,
                                }}
                                resizeMode="contain"
                                style={styles.doctorImage}
                            />
                            <View>
                                <Text
                                    style={[
                                        styles.doctorName,
                                        {
                                            color: COLORS.greyscale900,
                                        },
                                    ]}
                                >
                                    {pet.name}
                                </Text>
                                <View
                                    style={[
                                        styles.separateLine,
                                        {
                                            backgroundColor:
                                                COLORS.grayscale200,
                                        },
                                    ]}
                                />

                                <View style={styles.PetBreed}>
                                    {/* <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" /> */}
                                    <Text
                                        style={{
                                            color: COLORS.grayscale700,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {' '}
                                        {pet.color_description}
                                    </Text>
                                    {/* }]}>{" "}{rating}  ({numReviews})</Text> */}
                                    <Text
                                        style={{
                                            color: COLORS.grayscale700,
                                        }}
                                    >
                                        {'  '}| {pet.breed}
                                    </Text>
                                </View>
                                <View style={styles.statusContainer}>
                                    <Text style={styles.statusText}>
                                        Approved
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <Text
                        style={[
                            styles.contentTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Appearance and Distinctive Signs
                    </Text>

                    {/*Pet Information */}
                    <View>
                        <View
                            style={[
                                styles.separateLine,
                                {
                                    backgroundColor: COLORS.grayscale200,
                                },
                            ]}
                        />

                        <View style={styles.viewContainer}>
                            <View style={styles.viewLeft}>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    Gender
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    : Unknown
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View
                            style={[
                                styles.separateLine,
                                {
                                    backgroundColor: COLORS.grayscale200,
                                },
                            ]}
                        />

                        <View style={styles.viewContainer}>
                            <View style={styles.viewLeft}>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    Color
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    : {pet.color_description}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View
                            style={[
                                styles.separateLine,
                                {
                                    backgroundColor: COLORS.grayscale200,
                                },
                            ]}
                        />

                        <View style={styles.viewContainer}>
                            <View style={styles.viewLeft}>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    Weight
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    : {pet.weight}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View
                            style={[
                                styles.separateLine,
                                {
                                    backgroundColor: COLORS.grayscale200,
                                },
                            ]}
                        />

                        <View style={styles.viewContainer}>
                            <View style={styles.viewLeft}>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    Weight
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styles.description,
                                        {
                                            color: COLORS.greyScale800,
                                        },
                                    ]}
                                >
                                    : 4kg
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.separateLine,
                                {
                                    backgroundColor: COLORS.grayscale200,
                                },
                            ]}
                        />
                    </View>

                    <Text
                        style={[
                            styles.contentTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Important Dates
                    </Text>

                    <View style={styles.PetBreed}>
                        <View
                            style={{
                                borderColor: COLORS.black,
                                borderRadius: 32,
                            }}
                        >
                            <FontAwesome
                                name="birthday-cake"
                                size={30}
                                style={{
                                    color: COLORS.primary,
                                    backgroundColor: COLORS.tansparentPrimary,
                                    padding: 15,
                                }}
                            />
                        </View>
                        <View style={[styles.bdayDetails]}>
                            <Text
                                style={{
                                    color: COLORS.grayscale700,
                                }}
                            >
                                Birthday
                            </Text>
                            {/* }]}>{" "}{rating}  ({numReviews})</Text> */}
                            <Text
                                style={[
                                    styles.BirthDate,
                                    {
                                        color: COLORS.grayscale700,
                                    },
                                ]}
                            >
                                {formatDate(pet.date_of_birth)}
                            </Text>
                            <Text
                                style={[
                                    styles.BirthDate,
                                    {
                                        color: COLORS.grayscale700,
                                    },
                                ]}
                            >
                                {pet.age}
                            </Text>
                        </View>
                        {/* <Text
                            style={[
                                styles.BirthCount,
                                {
                                    color: COLORS.grayscale700,
                                },
                            ]}
                        >
                            {pet.age}
                        </Text> */}
                    </View>
                    <View>
                        <QRCode value={pet.id} />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomContainer}>
                <Button title="Generate QR Code" filled style={styles.btn} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    statusContainer: {
        width: 62,
        height: 24,
        borderRadius: 6,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.greeen,
        borderWidth: 1,
        marginVertical: 10,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.greeen,
        fontFamily: 'medium',
    },
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },

    wrapper: {
        flex: 1, // Ensures the whole screen is filled
    },
    scrollView: {
        flex: 1, // Scrollable content
    },
    btn: {
        width: '100%',
    },
    container: {
        flex: 1, // Makes the container take full screen height
        justifyContent: 'space-between', // Ensures that the content and button are spaced apart
        backgroundColor: COLORS.white,
    },

    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    // scrollView: {
    //     backgroundColor: COLORS.tertiaryWhite
    // },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    heartIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
        marginRight: 16,
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorCard: {
        height: 142,
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorImage: {
        height: 110,
        width: 110,
        borderRadius: 16,
        marginHorizontal: 16,
    },
    doctorName: {
        fontSize: 18,
        color: COLORS.greyscale900,
        fontFamily: 'bold',
    },
    separateLine: {
        height: 1,
        width: SIZES.width - 32,
        backgroundColor: COLORS.grayscale200,
        marginVertical: 10,
    },
    doctorSpeciality: {
        fontSize: 12,
        color: COLORS.greyScale800,
        fontFamily: 'medium',
        marginBottom: 8,
    },
    doctorHospital: {
        fontSize: 12,
        color: COLORS.greyScale800,
        fontFamily: 'medium',
    },
    featureContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    featureItemContainer: {
        alignItems: 'center',
    },
    featureIconContainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    featureIcon: {
        height: 28,
        width: 28,
        tintColor: COLORS.primary,
    },
    featureItemNum: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginVertical: 6,
    },
    featureItemName: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.greyScale800,
    },
    contentTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 16,
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: 'regular',
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: 'semiBold',
    },
    reviewTitleContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: 'bold',
    },
    bottomContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    //pet information
    subtitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 8,
        marginTop: 10,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    viewContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 15,
    },
    viewLeft: {
        width: 120,
    },

    PetBreed: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    BirthDate: {
        fontSize: 15,
        fontFamily: 'bold',
        color: COLORS.grayscale700,
    },
    BirthCount: {
        fontSize: 15,
        fontFamily: 'bold',
        color: COLORS.grayscale700,
        marginLeft: 50,
    },
    bdayDetails: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
})

export default PetHealthCard
