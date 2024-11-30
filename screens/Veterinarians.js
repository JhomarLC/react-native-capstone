import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialIcons } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import SettingsItem from '../components/SettingsItem'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import { categories, doctors, ratings, veterinarianList } from '../data'
import NotFoundCard from '../components/NotFoundCard'
import HorizontalVeterinarianCard from '../components/HorizontalVeterinarianCard'
import { loadVeterinarians } from '../services/VeterinarianService'
import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'

const Veterinarians = ({ navigation }) => {
    const refRBSheet = useRef()
    const [veterinarians, setVeterinarians] = useState([])
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [resultsCount, setResultsCount] = useState(0)
    const [loading, setLoading] = useState(true) // New loading state
    /**
     * Render header
     */
    // Load veterinarians function
    const loadVets = async () => {
        setLoading(true) // Show loading indicator
        try {
            const result = await loadVeterinarians()
            setVeterinarians(result.data)
            setFilteredVeterinarians(result.data)
            setResultsCount(result.data.length)
        } catch (e) {
            console.log('Failed to load Veterinarians', e)
        } finally {
            setLoading(false) // Hide loading indicator
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadVets()
        setRefreshing(false)
    }

    useEffect(() => {
        loadVets()
    }, [])

    const renderHeader = () => {
        return (
            <TouchableOpacity style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        Veterinarian
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**
     * Render content
     */
    const renderContent = () => {
        const [searchQuery, setSearchQuery] = useState('')

        useEffect(() => {
            handleSearch()
        }, [searchQuery])

        const handleSearch = () => {
            const allVeterinarians = veterinarians.filter((vet) =>
                vet.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredVeterinarians(allVeterinarians)
            setResultsCount(allVeterinarians.length)
        }

        if (loading) {
            return (
                <>
                    <View
                        onPress={() => console.log('Search')}
                        style={[
                            styles.searchBarContainer,
                            {
                                backgroundColor: COLORS.secondaryWhite,
                            },
                        ]}
                    >
                        <TouchableOpacity onPress={handleSearch}>
                            <Image
                                source={icons.search2}
                                resizeMode="contain"
                                style={styles.searchIcon}
                            />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Search Veterinarian Name"
                            placeholderTextColor={COLORS.gray}
                            style={[
                                styles.searchInput,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                            value={searchQuery}
                            onChangeText={(text) => setSearchQuery(text)}
                        />
                    </View>
                    <ActivityIndicator
                        size="large"
                        color={COLORS.primary}
                        style={{ marginTop: 20 }}
                    />
                </>
            )
        }

        return (
            <View>
                {/* Search bar */}
                <View
                    onPress={() => console.log('Search')}
                    style={[
                        styles.searchBarContainer,
                        {
                            backgroundColor: COLORS.secondaryWhite,
                        },
                    ]}
                >
                    <TouchableOpacity onPress={handleSearch}>
                        <Image
                            source={icons.search2}
                            resizeMode="contain"
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                    <TextInput
                        placeholder="Search Veterinarian Name"
                        placeholderTextColor={COLORS.gray}
                        style={[
                            styles.searchInput,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>

                {/* Results container  */}
                <View style={{ marginBottom: 235 }}>
                    {/* Events result list */}
                    <View
                        style={{
                            backgroundColor: COLORS.secondaryWhite,
                            marginVertical: 16,
                        }}
                    >
                        {resultsCount && resultsCount > 0 ? (
                            <>
                                {
                                    <FlatList
                                        data={filteredVeterinarians}
                                        keyExtractor={(item) => item.id}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => {
                                            return (
                                                <HorizontalVeterinarianCard
                                                    vetName={item.name}
                                                    image={item.image}
                                                    position={item.position}
                                                    email={item.email}
                                                    isAvailable={
                                                        item.isAvailable
                                                    }
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            'VeterinarianDetails',
                                                            {
                                                                vet_id: item.id,
                                                            }
                                                        )
                                                    }
                                                />
                                            )
                                        }}
                                        refreshing={refreshing}
                                        onRefresh={onRefresh} // Enables pull-to-refresh
                                    />
                                }
                            </>
                        ) : (
                            <NotFoundCard />
                        )}
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {renderContent()}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        width: SIZES.width - 32,
        backgroundColor: COLORS.secondaryWhite,
        padding: 16,
        borderRadius: 12,
        height: 52,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
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
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        marginBottom: 32,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        height: 50,
        width: 50,
        // tintColor: COLORS.primary
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    headerIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    profileContainer: {
        alignItems: 'center',
        borderBottomColor: COLORS.grayscale400,
        borderBottomWidth: 0.4,
        paddingVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 999,
    },
    picContainer: {
        width: 20,
        height: 20,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    title: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginTop: 12,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.greyscale900,
        fontFamily: 'medium',
        marginTop: 4,
    },
    settingsContainer: {
        marginVertical: 12,
    },
    settingsItemContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    settingsName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    settingsArrowRight: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale900,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightLanguage: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginRight: 8,
    },
    switch: {
        marginLeft: 8,
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Adjust the size of the switch
    },
    logoutContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    logoutLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
    },
    logoutName: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        marginLeft: 12,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
    },
    cancelButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        backgroundColor: COLORS.primary,
        borderRadius: 32,
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: 'semiBold',
        color: 'red',
        textAlign: 'center',
        marginTop: 12,
    },
    bottomSubtitle: {
        fontSize: 20,
        fontFamily: 'semiBold',
        color: COLORS.greyscale900,
        textAlign: 'center',
        marginVertical: 28,
    },
    separateLine: {
        width: SIZES.width,
        height: 1,
        backgroundColor: COLORS.grayscale200,
        marginTop: 12,
    },
})

export default Veterinarians
