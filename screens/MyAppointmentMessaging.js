import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import { ScrollView } from 'react-native-virtualized-view'
import { loadVetProfile } from '../services/VeterinarianService'
import { STORAGE_URL } from '@env'

const MyAppointmentMessaging = ({ route, navigation }) => {
    const { vet_id } = route.params
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        async function runEffect() {
            try {
                const vet_profile = await loadVetProfile(vet_id)
                setProfile(vet_profile.data)
            } catch (e) {
                console.log('Failed to load vet profile', e)
            }
        }
        runEffect()
    }, [])

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
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Veterinarian Profile</Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity>
                        <Image
                            source={icons.moreCircle}
                            resizeMode="contain"
                            style={styles.moreIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    /**
     * Render content
     */
    const renderContent = () => {
        if (!profile) {
            return <Text>Loading...</Text>
        }

        return (
            <View>
                <View style={styles.doctorCard}>
                    <Image
                        source={{
                            uri: `${STORAGE_URL}/vet_profiles/${profile.image}`,
                        }}
                        resizeMode="contain"
                        style={styles.doctorImage}
                    />
                    <View>
                        <Text style={styles.doctorName}>{profile.name}</Text>
                        <View style={styles.separateLine} />
                        <Text style={styles.doctorSpeciality}>
                            Veterinarian
                        </Text>
                        <Text style={styles.doctorHospital}>
                            San Jose City, Nueva Ecija
                        </Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>Veterinarian Information</Text>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Text style={styles.description}>Full Name</Text>
                    </View>
                    <View>
                        <Text style={styles.description}>: {profile.name}</Text>
                    </View>
                </View>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Text style={styles.description}>Email</Text>
                    </View>
                    <View>
                        <Text style={styles.description}>
                            : {profile.email}
                        </Text>
                    </View>
                </View>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Text style={styles.description}>Phone Number</Text>
                    </View>
                    <View>
                        <Text style={styles.description}>
                            : {profile.phone_number}
                        </Text>
                    </View>
                </View>
                <View style={styles.viewContainer}>
                    <View style={styles.viewLeft}>
                        <Text style={styles.description}>License Number</Text>
                    </View>
                    <View>
                        <Text style={styles.description}>
                            : {profile.license_number}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.btn}
                >
                    <Text style={styles.btnText}>Back</Text>
                </TouchableOpacity>
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
    doctorCard: {
        height: 142,
        width: SIZES.width - 32,
        borderRadius: 16,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
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
        marginVertical: 12,
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
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.greyScale800,
        marginVertical: 6,
    },
    viewContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 35,
    },
    viewLeft: {
        width: 120,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        height: 58,
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    btnText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
})

export default MyAppointmentMessaging
