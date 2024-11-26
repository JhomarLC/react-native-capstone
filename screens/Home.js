import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { banners, categories, recommendedDoctors } from '../data'
import SubHeaderItem from '../components/SubHeaderItem'
import Category from '../components/Category'
import HorizontalDoctorCard from '../components/HorizontalDoctorCard'
import AuthContext from '../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import { loadPets } from '../services/PetsService'
import { useFocusEffect } from '@react-navigation/native'
import { loadEvents } from '../services/EventService'
import NotFoundCard from '../components/NotFoundCard'
import NotFoundCardPet from '../components/NotFoundCardPet'
import { formatUpcommingEventsDate } from '../services/FormatDate'

const Home = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const pet_owner = user.pet_owner
    const image = {
        uri: `${STORAGE_URL}/petowners_profile/${pet_owner.image}`,
    }
    const [currentIndex, setCurrentIndex] = useState(0)
    const [pets, setPets] = useState([])
    const [announcement, setAnnouncement] = useState([])
    const [eventCount, setEventCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedPetTypes, setSelectedPetTypes] = useState(['0'])

    const fetchEvents = async () => {
        try {
            const response = await loadEvents()
            const now = new Date()

            // Filter for upcoming events and sort by date_time in ascending order
            const upcomingEvents = response.data
                .filter((event) => new Date(event.date_time) > now)
                .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
                .slice(0, 3)

            if (upcomingEvents.length !== eventCount) {
                setAnnouncement(upcomingEvents)
                setEventCount(upcomingEvents.length)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }

    useEffect(() => {
        fetchEvents()
        const intervalId = setInterval(fetchEvents, 5000)
        return () => clearInterval(intervalId)
    }, [])

    const fetchPets = async () => {
        console.log('Fetching pets...')
        setLoading(true)
        try {
            const { data } = await loadPets(pet_owner.id)
            setPets(data)
            console.log('Pets loaded:', data)
        } catch (e) {
            console.log('Failed to load pets:', e)
        } finally {
            setLoading(false)
            console.log('Loading set to false')
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchPets()
        await fetchEvents()
        setRefreshing(false)
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchPets()
        }, [])
    )
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

    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={image}
                        resizeMode="contain"
                        style={styles.userIcon}
                    />
                    <View style={styles.viewNameContainer}>
                        <Text style={styles.greeeting}>Good Day👋</Text>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            {pet_owner.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Image
                            source={icons.notificationBell2}
                            resizeMode="contain"
                            style={[
                                styles.bellIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    /**
     * Render search bar
     */
    const renderSearchBar = () => {
        const handleInputFocus = () => {
            // Redirect to another screen
            navigation.navigate('Search')
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Search')}
                style={[
                    styles.searchBarContainer,
                    {
                        backgroundColor: COLORS.secondaryWhite,
                    },
                ]}
            >
                <TouchableOpacity>
                    <Image
                        source={icons.search2}
                        resizeMode="contain"
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={styles.searchInput}
                    onFocus={handleInputFocus}
                />
            </TouchableOpacity>
        )
    }

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerTopContainer}>
                <View>
                    <Text style={styles.bannerDicount}>Upcoming Events</Text>
                    {/* <Text style={styles.bannerDicount}>{item.discount} Announcement</Text> */}
                    <Text style={styles.bannerDiscountName}>{item.name}</Text>
                </View>
                {/* <Text style={styles.bannerDiscountNum}>{item.discount}</Text> */}
            </View>
            <View style={styles.bannerBottomContainer}>
                <Text style={styles.bannerBottomTitle}>{item.place}</Text>
                <Text style={styles.bannerBottomSubtitle}>
                    {formatUpcommingEventsDate(item.date_time)}
                </Text>
            </View>
        </View>
    )

    /**
     * Render banner
     */
    const renderBanner = () => {
        return (
            <View style={styles.bannerItemContainer}>
                <FlatList
                    data={announcement}
                    renderItem={renderBannerItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / SIZES.width
                        )
                        setCurrentIndex(newIndex)
                    }}
                />
                <View style={styles.dotContainer}>
                    {announcement.map((_, index) => (
                        <View
                            style={[
                                styles.dot,
                                index === currentIndex
                                    ? styles.activeDot
                                    : null,
                            ]}
                            key={index}
                        />
                    ))}
                </View>
            </View>
        )
    }

    const renderPets = () => {
        return (
            <View style={{ marginBottom: 450 }}>
                {pets.length === 0 ? (
                    <View style={styles.noPetsContainer}>
                        <NotFoundCardPet message="Sorry no pets found, please add your pet by clicking the plus button bellow." />
                    </View>
                ) : (
                    <>
                        {filteredPets.length > 0 ? (
                            <View
                                style={{
                                    backgroundColor: COLORS.secondaryWhite,
                                    marginVertical: 16,
                                }}
                            >
                                <FlatList
                                    data={filteredPets}
                                    keyExtractor={(item) => item.id}
                                    showsVerticalScrollIndicator={false}
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
                                                        'PetDetails',
                                                        {
                                                            pet_id: item.id,
                                                        }
                                                    )
                                                }
                                            />
                                        )
                                    }}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh} // Enables pull-to-refresh
                                />
                            </View>
                        ) : (
                            <NotFoundCard message="No Pet to display" />
                        )}
                    </>
                )}
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {/* <ScrollView showsVerticalScrollIndicator={false}> */}
                {renderSearchBar()}
                {announcement.length > 0 && renderBanner()}
                <SubHeaderItem title="Pet Profiles" />
                <View>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        renderItem={renderCategoryItem}
                    />
                </View>
                {loading ? (
                    <>
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                            style={{ marginTop: 20 }}
                        />
                    </>
                ) : (
                    renderPets()
                )}
                {/* {renderCategories()} */}
                {/* </ScrollView> */}
            </View>
            {/** Floating "Add New Pet" Button **/}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreatePetProfile')}
            >
                <Image source={icons.plus_pet} style={styles.addIcon} />
            </TouchableOpacity>
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
        backgroundColor: COLORS.white,
        padding: 16,
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: COLORS.primary,
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    headerContainer: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32,
    },
    viewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeeting: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray',
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    viewNameContainer: {
        marginLeft: 12,
    },
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8,
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
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
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
    },
    bannerTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: 'medium',
        color: COLORS.white,
        marginBottom: 4,
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    bannerBottomContainer: {
        marginTop: 8,
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.white,
        marginTop: 4,
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999,
    },
    firstName: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.dark2,
        marginTop: 6,
    },
    bannerItemContainer: {
        width: '100%',
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    noPetsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    noPetsText: {
        fontSize: 18,
        color: COLORS.gray,
        marginBottom: 10,
    },
    createPetButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    createPetButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontFamily: 'semiBold',
    },
})

export default Home
