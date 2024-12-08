import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Modal,
    Text,
    ActivityIndicator,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../components/Button'
import { addPetPhotos, loadPetPictures } from '../services/PetsService'
import AuthContext from '../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import ImageView from 'react-native-image-viewing'
import {
    getFileType,
    launchMultipleImagePicker,
} from '../utils/ImagePickerHelper'
import { COLORS, illustrations, SIZES } from '../constants'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import NotFoundCard from '../components/NotFoundCard'

const PetPictures = ({ pet_id }) => {
    const [petPhotos, setPetPhotos] = useState([])
    const [previewImages, setPreviewImages] = useState([])
    const { user } = useContext(AuthContext)
    const pet_owner = user?.pet_owner
    const [visible, setIsVisible] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [refreshing, setRefreshing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true) // Add loading state

    const loadPetPicturesData = async () => {
        if (pet_owner?.id && pet_id) {
            setLoading(true) // Start loading
            try {
                const pet_pictures = await loadPetPictures(pet_owner.id, pet_id)
                setPetPhotos(pet_pictures.data)
            } catch (e) {
                console.log('Failed to load pet pictures', e)
            } finally {
                setLoading(false) // End loading
            }
        }
    }

    useEffect(() => {
        loadPetPicturesData()
    }, [pet_owner?.id, pet_id])

    const onRefresh = async () => {
        setRefreshing(true)
        await loadPetPicturesData()
        setRefreshing(false)
    }

    const combinedPhotos = [...petPhotos, ...previewImages]

    const handleImagePress = (index) => {
        setCurrentIndex(index) // Set the current index based on the combined array
        setIsVisible(true) // Open ImageView
    }

    const handleSelectImages = async () => {
        const imageUris = await launchMultipleImagePicker()
        if (imageUris?.length > 0) {
            const newPreviewImages = imageUris.map((uri) => ({
                uri,
                name: uri.split('/').pop(),
                type: getFileType(uri),
            }))
            setPreviewImages([...previewImages, ...newPreviewImages])
        }
    }

    const handleRemovePreviewImage = (index) => {
        setPreviewImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        )
    }

    const handleSaveImages = async () => {
        if (loading) {
            return
        }
        setLoading(true)
        if (previewImages.length > 0) {
            const formData = new FormData()
            previewImages.forEach((image, index) => {
                formData.append(`image[${index}]`, {
                    uri: image.uri,
                    name: image.name,
                    type: image.type,
                })
            })

            try {
                await addPetPhotos(pet_owner.id, pet_id, formData)
                setPetPhotos((prevPhotos) => [
                    ...prevPhotos,
                    ...previewImages.map(({ name, uri }) => ({
                        image: name,
                        uri,
                    })),
                ])
                setPreviewImages([])
                setModalVisible(true)
                setLoading(false)
            } catch (error) {
                setLoading(false)
                console.error('Failed to save images:', error)
                Alert.alert(
                    'Upload Error',
                    'There was a problem saving your photos.'
                )
            }
        }
    }

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
                                Pet Image successfully uploaded.
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
        <View style={styles.wrapper}>
            {renderModal()}
            {loading ? (
                // Show a loading spinner while images are being fetched
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : combinedPhotos.length > 0 ? (
                <FlatList
                    data={combinedPhotos}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.imageContainer}>
                            <TouchableOpacity
                                onPress={() => handleImagePress(index)} // Use index based on combined array
                            >
                                <Image
                                    source={{
                                        uri:
                                            item.uri ||
                                            `${STORAGE_URL}/pet_photos/${item.image}`,
                                    }}
                                    resizeMode="cover"
                                    style={styles.petImage}
                                />
                            </TouchableOpacity>
                            {/* Remove option only for preview images */}
                            {index >= petPhotos.length && (
                                <TouchableOpacity
                                    style={styles.removeIcon}
                                    onPress={() =>
                                        handleRemovePreviewImage(
                                            index - petPhotos.length
                                        )
                                    }
                                >
                                    <MaterialCommunityIcons
                                        name="close"
                                        size={24}
                                        color={COLORS.white}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <Image
                            source={{
                                uri: `${STORAGE_URL}/default_pet_image.jpg`,
                            }}
                            resizeMode="cover"
                            style={styles.petImage}
                        />
                    }
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: 'space-between' }} // Ensures equal spacing
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View>
                    <NotFoundCard message="No photos found for your pet. Please add image." />
                </View>
            )}

            <View style={styles.bottomContainer}>
                <Button
                    title={
                        loading
                            ? 'Loading...' // Show a loading message when loading is true
                            : previewImages.length > 0
                              ? 'Save Images'
                              : 'Add Image'
                    }
                    filled
                    style={styles.btn}
                    onPress={
                        previewImages.length > 0
                            ? handleSaveImages
                            : handleSelectImages
                    }
                />
                <ImageView
                    images={combinedPhotos.map((photo) => ({
                        uri:
                            photo.uri ||
                            `${STORAGE_URL}/pet_photos/${photo.image}`,
                    }))}
                    imageIndex={currentIndex}
                    visible={visible}
                    onRequestClose={() => setIsVisible(false)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    btn: {
        width: '100%',
    },
    contentContainer: {
        paddingVertical: 20,
    },
    petImage: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        borderRadius: 8,
    },
    imageContainer: {
        flex: 1, // Ensures equal spacing and size in each column
        // position: 'relative',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    removeIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 15,
        padding: 3,
    },
    removeIconImage: {
        width: 16,
        height: 16,
    },
    bottomContainer: {
        position: 'absolute', // Fixes the position to the bottom
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
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

export default PetPictures
