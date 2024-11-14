import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Alert,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SIZES, COLORS, icons, images, illustrations } from '../constants'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { FontAwesome } from '@expo/vector-icons'
import { ScrollView } from 'react-native-virtualized-view'
import { loadPetProfile } from '../services/PetsService'
import AuthContext from '../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import QRCode from 'react-native-qrcode-svg'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'

const PetHealthCard = ({ pet_id }) => {
    const [pet, setPet] = useState(null)
    const { user } = useContext(AuthContext)
    const pet_owner = user?.pet_owner
    const refRBSheet = useRef()
    const qrCodeRef = useRef()
    const [modalVisible, setModalVisible] = useState(false)

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

    const downloadQRCode = async () => {
        try {
            const base64Data = await new Promise((resolve, reject) => {
                qrCodeRef.current.toDataURL((data) => {
                    resolve(data)
                })
            })

            const uri = `${FileSystem.cacheDirectory}${pet.id}_qrcode.png`
            await FileSystem.writeAsStringAsync(uri, base64Data, {
                encoding: FileSystem.EncodingType.Base64,
            })

            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'Permission to access media library is required to save QR code.'
                )
                return
            }

            const asset = await MediaLibrary.createAssetAsync(uri)
            await MediaLibrary.createAlbumAsync('Download', asset, false)
            setModalVisible(true)
            // Alert.alert('Success', 'QR Code saved to your gallery!')
        } catch (error) {
            console.log('Error saving QR Code:', error)
            Alert.alert('Error', 'Failed to save QR Code. Please try again.')
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
                            <Text style={styles.modalTitle}>Success!</Text>
                            <Text
                                style={[
                                    styles.modalSubtitle,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                QR Code saved to your gallery!
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
    return (
        <View style={[styles.wrapper]}>
            {renderModal()}
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
                                    <Text
                                        style={{
                                            color: COLORS.grayscale700,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {' '}
                                        {pet.color_description}
                                    </Text>
                                    <Text
                                        style={{
                                            color: COLORS.grayscale700,
                                        }}
                                    >
                                        {'  '}| {pet.breed}
                                    </Text>
                                </View>
                                {pet.status === 'pending' ? (
                                    <View style={styles.statusPendingContainer}>
                                        <Text
                                            style={[styles.statusPendingText]}
                                        >
                                            Pending
                                        </Text>
                                    </View>
                                ) : pet.status === 'approved' ? (
                                    <View style={styles.statusContainer}>
                                        <Text style={[styles.statusText]}>
                                            Approved
                                        </Text>
                                    </View>
                                ) : pet.status === 'declined' ? (
                                    <View
                                        style={styles.statusDeceasedContainer}
                                    >
                                        <Text
                                            style={[styles.statusDeceasedText]}
                                        >
                                            Declined
                                        </Text>
                                    </View>
                                ) : (
                                    <></>
                                )}
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
                                    : {pet.gender}
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
                                    : {pet.weight} kg
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
                                    Size
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
                                    : {pet.size}
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
                    {/* <View>
                        <QRCode value={pet.id} />
                    </View> */}
                </View>
            </ScrollView>
            <View style={styles.bottomContainerQR}>
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                    <View style={styles.btn}>
                        <Text
                            style={{
                                color: COLORS.white,
                                fontFamily: 'bold',
                                fontSize: 16,
                            }}
                        >
                            Generate QR Code
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* Pet profile status */}
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={384}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                        draggableIcon: {
                            backgroundColor: '#000',
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 'auto',
                            backgroundColor: COLORS.white,
                            alignItems: 'center',
                        },
                    }}
                >
                    <Text
                        style={[
                            styles.bottomTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        QR Code
                    </Text>

                    <View style={styles.separateLine} />

                    <View style={styles.bottomContainerQR}>
                        <View>
                            <QRCode
                                size={250}
                                logo={{
                                    uri: `${STORAGE_URL}/pet_profile/${pet.image}`,
                                }}
                                value={pet.id}
                                logoBorderRadius={50}
                                quietZone={20}
                                getRef={(ref) => (qrCodeRef.current = ref)}
                            />
                        </View>
                        <TouchableOpacity onPress={downloadQRCode}>
                            <View
                                style={[
                                    styles.btn,
                                    { marginBottom: 20, marginTop: 20 },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: COLORS.white,
                                        fontFamily: 'bold',
                                        fontSize: 16,
                                    }}
                                >
                                    Save QR Code
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    qrImage: {
        height: 250,
        width: 250,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    bottomContainerQR: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    statusContainer: {
        width: 62,
        height: 24,
        borderRadius: 6,
        backgroundColor: COLORS.greeen,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.greeen,
        borderWidth: 1,
        marginVertical: 10,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.white,
        fontFamily: 'medium',
    },
    statusPendingContainer: {
        width: 62,
        height: 24,
        borderRadius: 6,
        backgroundColor: COLORS.red,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.red,
        borderWidth: 1,
        marginVertical: 10,
    },
    statusPendingText: {
        fontSize: 10,
        color: COLORS.white,
        fontFamily: 'medium',
    },
    statusDeceasedContainer: {
        width: 62,
        height: 24,
        borderRadius: 6,
        backgroundColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.black,
        borderWidth: 1,
        marginVertical: 10,
    },
    statusDeceasedText: {
        fontSize: 10,
        color: COLORS.white,
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
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        backgroundColor: COLORS.primary,
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

export default PetHealthCard
