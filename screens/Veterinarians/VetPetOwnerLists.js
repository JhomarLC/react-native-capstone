import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
} from 'react-native'
import React, { useContext, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import {
    banners,
    categories,
    petOwnerList,
    recommendedDoctors,
} from '../../data'
import SubHeaderItem from '../../components/SubHeaderItem'
import Category from '../../components/Category'
import HorizontalPetOwnerCard from '../../components/veterinarians/HorizontalPetOwnerCard'
import AuthContext from '../../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import { loadPetOwners } from '../../services/PetsOwnerService'
import { useFocusEffect } from '@react-navigation/native'

const VetPetOwnerLists = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { user } = useContext(AuthContext)
    const veterinarian = user.user
    const [petowners, setPetowners] = useState([])

    const fetchPetOwners = async () => {
        try {
            const { data } = await loadPetOwners()
            setPetowners(data)
            console.log(petowners)
        } catch (e) {
            console.log('Failed to load Pet Owners', e)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchPetOwners()
        }, [])
    )
    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.viewLeft}>
                    <Image
                        source={{
                            uri: `${STORAGE_URL}/vet_profiles/${veterinarian?.image}`,
                        }}
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
                            {veterinarian?.name}
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
            navigation.navigate('PetProfileSeeAll')
        }

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('PetProfileSeeAll')}
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
                <TouchableOpacity>
                    <Image
                        source={icons.filter}
                        resizeMode="contain"
                        style={styles.filterIcon}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    const renderBannerItem = ({ item }) => (
        <View style={styles.bannerContainer}>
            <View style={styles.bannerTopContainer}>
                <View>
                    <Text style={styles.bannerDicount}>Announcement</Text>
                    {/* <Text style={styles.bannerDicount}>{item.discount} Announcement</Text> */}
                    <Text style={styles.bannerDiscountName}>
                        {item.discountName}
                    </Text>
                </View>
                {/* <Text style={styles.bannerDiscountNum}>{item.discount}</Text> */}
            </View>
            <View style={styles.bannerBottomContainer}>
                <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
                <Text style={styles.bannerBottomSubtitle}>
                    {item.bottomSubtitle}
                </Text>
            </View>
        </View>
    )

    const keyExtractor = (item) => item.id.toString()

    const handleEndReached = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }

    const renderDot = (index) => {
        return (
            <View
                style={[
                    styles.dot,
                    index === currentIndex ? styles.activeDot : null,
                ]}
                key={index}
            />
        )
    }

    /**
     * Render banner
     */
    const renderBanner = () => {
        return (
            <View style={styles.bannerItemContainer}>
                <FlatList
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={keyExtractor}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(
                            event.nativeEvent.contentOffset.x / SIZES.width
                        )
                        setCurrentIndex(newIndex)
                    }}
                />
                <View style={styles.dotContainer}>
                    {banners.map((_, index) => renderDot(index))}
                </View>
            </View>
        )
    }

    const renderPetOwners = () => {
        const [selectedCategories, setSelectedCategories] = useState(['1'])

        const filteredDoctors = petOwnerList.filter(
            (doctor) =>
                selectedCategories.includes('0') ||
                selectedCategories.includes(doctor.categoryId)
        )

        return (
            <View>
                <SubHeaderItem title="Pet Owners" />

                <View
                    style={{
                        backgroundColor: COLORS.secondaryWhite,
                    }}
                >
                    <FlatList
                        data={petowners}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            return (
                                <HorizontalPetOwnerCard
                                    name={item.name}
                                    image={{
                                        uri: `${STORAGE_URL}/petowners_profile/${item.image}`,
                                    }}
                                    // distance={item.distance}
                                    // price={item.price}
                                    // consultationFee={item.consultationFee}
                                    addr_zone={item.addr_zone}
                                    addr_brgy={item.addr_brgy}
                                    email={item.email}
                                    // rating={item.rating}
                                    // numReviews={item.numReviews}
                                    // isAvailable={item.isAvailable}
                                    onPress={() =>
                                        navigation.navigate(
                                            'VetPetOwnerDetails',
                                            {
                                                petowner: item,
                                            }
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
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {renderSearchBar()}
                <ScrollView
                    style={{ marginBottom: '10%' }}
                    showsVerticalScrollIndicator={false}
                >
                    {renderBanner()}
                    {/* {renderCategories()} */}
                    {renderPetOwners()}
                </ScrollView>
            </View>
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
})

export default VetPetOwnerLists
