import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    useWindowDimensions,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons } from '../../constants'
import {
    PetHealthCard,
    PetPictures,
    PetVaccination,
    VetPetHealthCard,
    VetPetPictures,
    VetPetVaccination,
} from '../../tabs'
import { TabView, TabBar } from 'react-native-tab-view'

const VetPetDetails = ({ route, navigation }) => {
    const layout = useWindowDimensions()
    const { pet, petowner, initialTabIndex = 0 } = route.params // set default to 0 for "About" tab

    const [index, setIndex] = React.useState(initialTabIndex)
    const [routes] = React.useState([
        { key: 'first', title: 'About' },
        { key: 'second', title: 'Pictures' },
        { key: 'third', title: 'Vaccination' },
    ])

    // Custom render scene to pass pet_id to each tab
    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'first':
                return <VetPetHealthCard pet={pet} petowner={petowner} />
            case 'second':
                return <VetPetPictures pet={pet} petowner={petowner} />
            case 'third':
                return <VetPetVaccination pet={pet} petowner={petowner} />
            default:
                return null
        }
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: COLORS.white,
            }}
            renderLabel={({ route, focused }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 16,
                            fontFamily: 'semiBold',
                        },
                    ]}
                >
                    {route.title}
                </Text>
            )}
        />
    )

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
                        Health Card
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
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
    viewRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})

export default VetPetDetails
