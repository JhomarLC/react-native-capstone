import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator,
    TextInput,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { loadVeterinarians } from '../services/VeterinarianService'
import { STORAGE_URL } from '@env'

const Veterinarians = ({ navigation }) => {
    const [veterinarians, setVeterinarians] = useState([])
    const [filteredVeterinarians, setFilteredVeterinarians] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const loadVets = async () => {
        try {
            const result = await loadVeterinarians()
            setVeterinarians(result.data)
            setFilteredVeterinarians(result.data) // Initial filtered data
        } catch (e) {
            console.log('Failed to load Veterinarians', e)
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

    useEffect(() => {
        handleSearch()
    }, [searchQuery])

    const handleSearch = () => {
        const filtered = veterinarians.filter((vet) =>
            vet.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredVeterinarians(filtered)
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        style={styles.logoIcon}
                    />
                </TouchableOpacity>
                <Text
                    style={[styles.headerTitle, { color: COLORS.greyscale900 }]}
                >
                    Veterinarians
                </Text>
            </View>
            <TouchableOpacity>
                <Image
                    source={icons.moreCircle}
                    resizeMode="contain"
                    style={[
                        styles.moreIcon,
                        { tintColor: COLORS.greyscale900 },
                    ]}
                />
            </TouchableOpacity>
        </View>
    )

    const renderSearchBar = () => (
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
                style={[styles.searchInput, { color: COLORS.greyscale900 }]}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />
        </View>
    )

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {renderSearchBar()}
                <FlatList
                    data={filteredVeterinarians}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.cardContainer,
                                { backgroundColor: COLORS.white },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        'MyAppointmentMessaging',
                                        {
                                            vet_id: item.id,
                                        }
                                    )
                                }
                                style={styles.detailsViewContainer}
                            >
                                <View style={styles.detailsContainer}>
                                    <Image
                                        source={{
                                            uri: `${STORAGE_URL}/vet_profiles/${item.image}`,
                                        }}
                                        resizeMode="cover"
                                        style={styles.serviceImage}
                                    />
                                    <View style={styles.detailsRightContainer}>
                                        <Text
                                            style={[
                                                styles.name,
                                                { color: COLORS.greyscale900 },
                                            ]}
                                        >
                                            {item.name}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.positionEmail,
                                                { color: COLORS.grayscale700 },
                                            ]}
                                        >
                                            {item.position}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.positionEmail,
                                                { color: COLORS.grayscale700 },
                                            ]}
                                        >
                                            {item.email}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
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
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        height: 50,
        width: 50,
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
    cardContainer: {
        width: SIZES.width - 32,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
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
    },
    positionEmail: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 6,
    },
    listContent: {
        paddingBottom: 20,
    },
    detailsViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
})

export default Veterinarians
