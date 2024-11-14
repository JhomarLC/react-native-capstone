import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { categories, ratings } from '../data'
import NotFoundCard from '../components/NotFoundCard'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { FontAwesome } from '@expo/vector-icons'
import HorizontalDoctorCard from '../components/HorizontalDoctorCard'
import { loadPets } from '../services/PetsService'
import AuthContext from '../contexts/AuthContext'
import { useFocusEffect } from '@react-navigation/native'
import { STORAGE_URL } from '@env'

const Search = ({ navigation }) => {
    const { user } = useContext(AuthContext)
    const pet_owner = user.pet_owner
    const refRBSheet = useRef()
    const [selectedCategories, setSelectedCategories] = useState(['1'])
    const [selectedRating, setSelectedRating] = useState(['1'])
    const [pets, setPets] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredPets, setFilteredPets] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false)
    const fetchPets = async () => {
        setLoading(true)
        try {
            const { data } = await loadPets(pet_owner.id)
            setPets(data)
            setFilteredPets(data) // Set initial filtered list to full pet list
        } catch (e) {
            console.log('Failed to load Pets', e)
        } finally {
            setLoading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await fetchPets() // Fetch pets again to reload data
        setRefreshing(false)
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchPets()
        }, [])
    )

    useEffect(() => {
        handleSearch()
    }, [searchQuery, pets])

    const handleSearch = () => {
        const results = pets.filter((pet) =>
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredPets(results)
    }

    /**
     * Render header
     */
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pets</Text>
            </View>
        </View>
    )

    /**
     * Render content
     */
    const renderContent = () => (
        <View>
            <View style={styles.resultsContainer}>
                {filteredPets.length > 0 ? (
                    <FlatList
                        data={filteredPets}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <HorizontalDoctorCard
                                name={item.name}
                                image={{
                                    uri: `${STORAGE_URL}/pet_profile/${item.image}`,
                                }}
                                type={item.pet_type}
                                petBreed={item.breed}
                                color_description={item.color_description}
                                weight={item.weight}
                                pet_type={item.pet_type}
                                age={item.age}
                                status={item.status}
                                onPress={() =>
                                    navigation.navigate('PetDetails', {
                                        pet_id: item.id,
                                    })
                                }
                            />
                        )}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                ) : (
                    <NotFoundCard />
                )}
            </View>
        </View>
    )

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(categoryId)
                ? prevCategories.filter((id) => id !== categoryId)
                : [...prevCategories, categoryId]
        )
    }

    const toggleRating = (ratingId) => {
        setSelectedRating((prevRatings) =>
            prevRatings.includes(ratingId)
                ? prevRatings.filter((id) => id !== ratingId)
                : [...prevRatings, ratingId]
        )
    }

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.categoryItem,
                {
                    backgroundColor: selectedCategories.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                },
            ]}
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

    const renderRatingItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.ratingItem,
                {
                    backgroundColor: selectedRating.includes(item.id)
                        ? COLORS.primary
                        : 'transparent',
                },
            ]}
            onPress={() => toggleRating(item.id)}
        >
            <FontAwesome
                name="star"
                size={14}
                color={
                    selectedRating.includes(item.id)
                        ? COLORS.white
                        : COLORS.primary
                }
            />
            <Text
                style={{
                    color: selectedRating.includes(item.id)
                        ? COLORS.white
                        : COLORS.primary,
                }}
            >
                {item.title}
            </Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.searchBarContainer}>
                    <TouchableOpacity onPress={handleSearch}>
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
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
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
                    renderContent()
                )}
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown
                    closeOnPressMask
                    height={384}
                    customStyles={{
                        wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
                        draggableIcon: { backgroundColor: '#000' },
                        container: styles.sheetContainer,
                    }}
                >
                    <Text style={styles.bottomTitle}>Filter</Text>
                    <View style={styles.separateLine} />
                    <View style={styles.filterSection}>
                        <Text style={styles.sheetTitle}>Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            horizontal
                            renderItem={renderCategoryItem}
                            showsHorizontalScrollIndicator={false}
                        />

                        <Text style={styles.sheetTitle}>Rating</Text>
                        <FlatList
                            data={ratings}
                            keyExtractor={(item) => item.id}
                            horizontal
                            renderItem={renderRatingItem}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <View style={styles.separateLine} />
                    <View style={styles.bottomContainer}>
                        <Button
                            title="Reset"
                            style={styles.resetButton}
                            textColor={COLORS.primary}
                            onPress={() => refRBSheet.current.close()}
                        />
                        <Button
                            title="Filter"
                            filled
                            style={styles.filterButton}
                            onPress={() => refRBSheet.current.close()}
                        />
                    </View>
                </RBSheet>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: { flex: 1, backgroundColor: COLORS.white },
    container: { flex: 1, backgroundColor: COLORS.white, padding: 16 },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        width: SIZES.width - 32,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backIcon: { height: 24, width: 24, tintColor: COLORS.black },
    headerTitle: { fontSize: 20, fontFamily: 'bold', marginLeft: 16 },
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: { height: 24, width: 24, tintColor: COLORS.gray },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'regular',
        marginHorizontal: 8,
    },
    filterIcon: { width: 24, height: 24, tintColor: COLORS.primary },
    categoryItem: {
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
    },
    ratingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginVertical: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.3,
        borderRadius: 24,
        marginRight: 12,
    },
    sheetContainer: {
        borderTopRightRadius: 32,
        borderTopLeftRadius: 32,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        textAlign: 'center',
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    filterSection: { width: SIZES.width - 32 },
    sheetTitle: { fontSize: 18, fontFamily: 'semiBold', marginVertical: 12 },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    resetButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    filterButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    resultsContainer: {
        backgroundColor: COLORS.secondaryWhite,
        marginVertical: 16,
        marginBottom: 100,
    },
})

export default Search
