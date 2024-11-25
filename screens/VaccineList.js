import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import NotFoundCard from '../components/NotFoundCard'
import HorizontalVaccineListInfo from '../components/HorizontalVaccineListInfo'
import { ScrollView } from 'react-native-virtualized-view'
import { loadPetMedication } from '../services/PetsService'
import { formatDate } from '../services/FormatDate'

const VaccineList = ({ route, navigation }) => {
    const { pet_id, medication } = route.params

    // State for medications, search query, filtered results, and loading
    const [medications, setMedications] = useState([]) // Original list of medications
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredMedication, setFilteredMedication] = useState([]) // Filtered list based on search
    const [isLoading, setIsLoading] = useState(true)

    // Load medications data on component mount
    useEffect(() => {
        async function fetchMedications() {
            try {
                setIsLoading(true) // Start loading
                const result = await loadPetMedication(pet_id, medication.id)
                const filteredData = result.data.filter(
                    (medicationItem) =>
                        medicationItem.medicationname.medication_type_id ===
                        medication.id
                )
                setMedications(filteredData) // Set original data here
                setFilteredMedication(filteredData) // Initialize filtered data with all medications
            } catch (e) {
                console.log('Failed to load medications', e)
            } finally {
                setIsLoading(false) // Stop loading
            }
        }
        fetchMedications()
    }, [pet_id, medication])

    // Search and filter function
    useEffect(() => {
        handleSearch()
    }, [searchQuery])

    const handleSearch = () => {
        if (!searchQuery) {
            setFilteredMedication(medications) // Reset to full list if search is cleared
        } else {
            const filtered = medications.filter((med) =>
                med?.medicationname?.name
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            setFilteredMedication(filtered)
        }
    }

    // Render header
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
                <View style={{ flexDirection: 'column' }}>
                    <Text style={[styles.name, { color: COLORS.greyscale900 }]}>
                        Pet Health Records
                    </Text>
                    <Text
                        style={[
                            styles.headerTitle,
                            { color: COLORS.greyscale900 },
                        ]}
                    >
                        {medication.name}
                    </Text>
                </View>
            </View>
        </View>
    )

    // Render main content with search results
    const renderContent = () => (
        <View>
            <View
                style={[
                    styles.searchBarContainer,
                    { backgroundColor: COLORS.secondaryWhite },
                ]}
            >
                <Image
                    source={icons.search2}
                    resizeMode="contain"
                    style={styles.searchIcon}
                />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: 16 }}>
                    {isLoading ? (
                        <ActivityIndicator
                            size="large"
                            color={COLORS.primary}
                        />
                    ) : filteredMedication.length > 0 ? (
                        <FlatList
                            data={filteredMedication}
                            keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <HorizontalVaccineListInfo
                                    vaccineTypeName={
                                        item.medicationname?.name ||
                                        'Unknown Medication'
                                    }
                                    vaccineDate={formatDate(item.created_at)}
                                    Vaccinedoctor={
                                        item.veterinarian?.name ||
                                        'Unknown Doctor'
                                    }
                                    medications={[item]}
                                />
                            )}
                        />
                    ) : (
                        <NotFoundCard message="Sorry, no record found for this medication." />
                    )}
                </View>
            </ScrollView>
        </View>
    )

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
    name: {
        color: COLORS.greyscale900,
        marginLeft: 20,
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
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
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
})

export default VaccineList
