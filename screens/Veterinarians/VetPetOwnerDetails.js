import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
} from 'react-native'
import React, { useState, useRef, userEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../../constants'
import { ScrollView } from 'react-native-virtualized-view'
import {
    banners,
    categories,
    recommendedDoctors,
    doctors,
    ratings,
} from '../../data'
import SubHeaderItem from '../../components/SubHeaderItem'
import HorizontalDoctorCard from '../../components/HorizontalDoctorCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../../components/Button'
import { FontAwesome } from '@expo/vector-icons'
import { STORAGE_URL } from '@env'
import { loadPets } from '../../services/PetsService'
import { useFocusEffect } from '@react-navigation/native'
import NotFoundCardPet from '../../components/NotFoundCardPet'

const VetPetOwnerDetails = ({ route, navigation }) => {
    const { petowner } = route.params
    const [pets, setPets] = useState([])

    const fetchPets = async () => {
        try {
            const { data } = await loadPets(petowner.id)
            setPets(data)
        } catch (e) {
            console.log('Failed to load Pets', e)
        }
    }
    useFocusEffect(
        React.useCallback(() => {
            fetchPets()
            console.log(pets)
        }, [])
    )

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
                                    tintColor: COLORS.black,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: COLORS.black,
                            },
                        ]}
                    >
                        Pet Owner
                    </Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity>
                        <Image
                            source={icons.moreCircle}
                            resizeMode="contain"
                            style={[
                                styles.moreIcon,
                                {
                                    tintColor: COLORS.black,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * render content
     */
    const renderContent = () => {
        return (
            <View>
                <View style={{ backgroundColor: COLORS.tertiaryWhite }}>
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
                                uri: `${STORAGE_URL}/petowners_profile/${petowner.image}`,
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
                                {petowner.name}
                            </Text>
                            <View
                                style={[
                                    styles.separateLine,
                                    {
                                        backgroundColor: COLORS.grayscale200,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.doctorHospital,
                                    {
                                        color: COLORS.greyScale800,
                                    },
                                ]}
                            >
                                Zone {petowner.addr_zone}, Brgy.
                                {petowner.addr_brgy}, San Jose City
                            </Text>
                        </View>
                    </View>
                </View>

                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    Pet Owner Information
                </Text>
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
                            Full Name
                        </Text>
                    </View>
                    <View style={{ display: 'flex' }}>
                        <Text
                            style={[
                                styles.description,
                                {
                                    color: COLORS.greyScale800,
                                },
                            ]}
                        >
                            : {petowner.name}
                        </Text>
                    </View>
                </View>
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
                            Address
                        </Text>
                    </View>
                    <View style={{ display: 'flex' }}>
                        <Text
                            style={[
                                styles.description,
                                {
                                    color: COLORS.greyScale800,
                                },
                            ]}
                        >
                            : Zone {petowner.addr_zone}, Brgy.
                            {petowner.addr_brgy}, San Jose City
                        </Text>
                    </View>
                </View>
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
                            Email
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
                            : {petowner.email}
                        </Text>
                    </View>
                </View>
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
                            Phone Number
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
                            : {petowner.phone_number}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderTopDoctors = () => {
        const [selectedCategories, setSelectedCategories] = useState(['0'])

        const filteredDoctors = recommendedDoctors.filter(
            (doctor) =>
                selectedCategories.includes('0') ||
                selectedCategories.includes(doctor.categoryId)
        )

        // Category item
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: selectedCategories.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => toggleCategory(item.id)}
            >
                <Text
                    style={{
                        color: selectedCategories.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        // Toggle category selection
        const toggleCategory = (categoryId) => {
            const updatedCategories = [...selectedCategories]
            const index = updatedCategories.indexOf(categoryId)

            if (index === -1) {
                updatedCategories.push(categoryId)
            } else {
                updatedCategories.splice(index, 1)
            }

            setSelectedCategories(updatedCategories)
        }

        return (
            <View style={{ paddingHorizontal: 20 }}>
                <View
                    style={[
                        styles.separateLine,
                        {
                            backgroundColor: COLORS.grayscale200,
                        },
                    ]}
                />
                <SubHeaderItem
                    title="Pet Profiles"
                    // navTitle="See All"
                    onPress={() => navigation.navigate('Search')}
                />
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderCategoryItem}
                />
                <View
                    style={{
                        backgroundColor: COLORS.secondaryWhite,
                        marginVertical: 16,
                    }}
                >
                    <FlatList
                        data={filteredDoctors}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <HorizontalDoctorCard
                                    name={item.name}
                                    image={item.image}
                                    type={item.type}
                                    petBreed={item.petBreed}
                                    isAvailable={item.isAvailable}
                                    onPress={() =>
                                        navigation.navigate(
                                            'VetSide_PetDetails'
                                        )
                                    }
                                />
                            )
                        }}
                    />
                </View>
            </View>
        )
    }
    const renderPets = () => {
        const [selectedPetTypes, setSelectedPetTypes] = useState(['0'])

        const filteredPets = pets.filter(
            (pet) =>
                selectedPetTypes.includes('0') || // Include all pets if '0' is selected
                selectedPetTypes.includes(pet.pet_type === 'dog' ? '1' : '2') // Otherwise, filter by pet_type
        )

        // Category item
        const renderCategoryItem = ({ item }) => (
            <TouchableOpacity
                style={{
                    backgroundColor: selectedPetTypes.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                    padding: 10,
                    marginVertical: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1.3,
                    borderRadius: 24,
                    marginRight: 12,
                }}
                onPress={() => selectCategory(item.id)}
            >
                <Text
                    style={{
                        color: selectedPetTypes.includes(item.id)
                            ? COLORS.white
                            : COLORS.primary,
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )

        const selectCategory = (categoryId) => {
            setSelectedPetTypes([categoryId])
        }

        return (
            <View style={{ paddingHorizontal: 20 }}>
                <SubHeaderItem
                    title="Pet Profiles"
                    // navTitle="Add New Pet"
                    onPress={() => navigation.navigate('CreatePetProfile')}
                />
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderCategoryItem}
                />

                {pets.length === 0 ? (
                    <View style={styles.noPetsContainer}>
                        <NotFoundCardPet message="Sorry no pets found for this Pet Owner." />
                    </View>
                ) : (
                    <View
                        style={{
                            backgroundColor: COLORS.secondaryWhite,
                            marginVertical: 16,
                        }}
                    >
                        <FlatList
                            data={filteredPets}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => {
                                return (
                                    <HorizontalDoctorCard
                                        name={item.name}
                                        image={{
                                            uri: `${STORAGE_URL}/pet_profile/${item.image}`,
                                        }}
                                        color_description={
                                            item.color_description
                                        }
                                        petBreed={item.breed}
                                        pet_type={item.pet_type}
                                        status={item.status}
                                        age={item.age}
                                        onPress={() =>
                                            navigation.navigate(
                                                'VetPetDetails',
                                                {
                                                    pet: item,
                                                    petowner: petowner,
                                                }
                                            )
                                        }
                                    />
                                )
                            }}
                        />
                    </View>
                )}
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                    {renderPets()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    statusContainer: {
        width: 62,
        height: 30,
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
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 16,
    },
    scrollView: {
        backgroundColor: COLORS.tertiaryWhite,
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
        fontSize: 22,
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
        borderRadius: 16,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
        display: 'flex',
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
        marginVertical: 8,
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
    subtitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 8,
        marginTop: 10,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.greyScale800,
        marginVertical: 6,
        display: 'flex',
    },

    viewContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 30,
        display: 'flex',
    },
    viewLeft: {
        width: 100,
    },
    pkgContainer: {
        height: 100,
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    pkgLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pkgIconContainer: {
        height: 60,
        width: 60,
        borderRadius: 999,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
        marginRight: 12,
    },
    pkgIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary,
    },
    pkgTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 8,
    },
    pkgDescription: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.greyScale800,
    },
    pkgRightContainer: {
        alignItems: 'center',
        marginRight: 12,
    },
    pkgPrice: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    pkgPriceTag: {
        fontSize: 10,
        fontFamily: 'medium',
        color: COLORS.greyScale800,
    },
    // bottomContainer: {
    //   position: "absolute",
    //   bottom: 0,
    //   width: "100%",
    //   height: 99,
    //   borderRadius: 32,
    //   backgroundColor: COLORS.white,
    //   alignItems: "center",
    //   justifyContent: "center"
    // },
    btn: {
        height: 58,
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.primary,
        marginRight: 16,
    },
    btnText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
})

export default VetPetOwnerDetails
