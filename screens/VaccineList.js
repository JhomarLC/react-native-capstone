import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { vaccineDetails } from '../data'
import NotFoundCard from '../components/NotFoundCard'
import HorizontalVaccineListInfo from '../components/HorizontalVaccineListInfo'
import { ScrollView } from 'react-native-virtualized-view'

const VaccineList = ({ navigation }) => {
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
                                    tintColor: COLORS.greyscale900,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={[
                                styles.name,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            Pet Profile
                        </Text>
                        <Text
                            style={[
                                styles.headerTitle,
                                {
                                    color: COLORS.greyscale900,
                                },
                            ]}
                        >
                            Vaccine
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * Render content
     */
    const renderContent = () => {
        const [searchQuery, setSearchQuery] = useState('')
        const [filteredVaccine, setFilteredVaccine] = useState(vaccineDetails)
        const [resultsCount, setResultsCount] = useState(0)

        useEffect(() => {
            handleSearch()
        }, [searchQuery])

        const handleSearch = () => {
            const allVaccines = vaccineDetails.filter((vaccine) =>
                vaccine.vaccineTypeName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            setFilteredVaccine(allVaccines)
            setResultsCount(allVaccines.length)
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
                        placeholder="Search"
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <View
                            style={{
                                marginVertical: 16,
                            }}
                        >
                            {resultsCount && resultsCount > 0 ? (
                                <>
                                    {
                                        <FlatList
                                            data={filteredVaccine}
                                            keyExtractor={(item) => item.id}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={({ item }) => {
                                                return (
                                                    <HorizontalVaccineListInfo
                                                        vaccineTypeName={
                                                            item.vaccineTypeName
                                                        }
                                                        vaccineDate={
                                                            item.vaccineDate
                                                        }
                                                        Vaccinedoctor={
                                                            item.Vaccinedoctor
                                                        }
                                                    />
                                                )
                                            }}
                                        />
                                    }
                                </>
                            ) : (
                                <NotFoundCard />
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    // filter yung tumataas from bottom
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}

                {renderContent()}
                {/* </ScrollView> */}
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
    tabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    tabBtn: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    selectedTab: {
        width: (SIZES.width - 32) / 2 - 6,
        height: 42,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.4,
        borderColor: COLORS.primary,
        borderRadius: 32,
    },
    tabBtnText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        textAlign: 'center',
    },
    selectedTabText: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.white,
        textAlign: 'center',
    },
    resultContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: SIZES.width - 32,
        marginVertical: 16,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    subResult: {
        fontSize: 14,
        fontFamily: 'semiBold',
        color: COLORS.primary,
    },
    resultLeftView: {
        flexDirection: 'row',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        paddingHorizontal: 16,
        width: SIZES.width,
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
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    sheetTitle: {
        fontSize: 18,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginVertical: 12,
    },
    reusltTabContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: SIZES.width - 32,
        justifyContent: 'space-between',
    },
    viewDashboard: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 36,
        justifyContent: 'space-between',
    },
    dashboardIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
    },
    tabText: {
        fontSize: 20,
        fontFamily: 'semiBold',
        color: COLORS.black,
    },
})

export default VaccineList
