import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, icons, images } from '../constants'
import { ScrollView } from 'react-native-virtualized-view'
import { STORAGE_URL } from '@env'
import {
    loadVeterinarians,
    loadVetProfile,
} from '../services/VeterinarianService'

const VeterinarianDetails = ({ route, navigation }) => {
    const { vet_id } = route.params
    const [profile, setProfile] = useState(null)
    /**
     * Render header
     */

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
                        Veterinarian
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
        if (!profile) {
            return <Text>Loading...</Text>
        }

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
                                uri: `${STORAGE_URL}/vet_profiles/${profile.image}`,
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
                                {profile.name}
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
                                    styles.doctorSpeciality,
                                    {
                                        color: COLORS.greyScale800,
                                    },
                                ]}
                            >
                                {profile.position}
                            </Text>
                            <Text
                                style={[
                                    styles.doctorHospital,
                                    {
                                        color: COLORS.greyScale800,
                                    },
                                ]}
                            >
                                San Jose City, Nueva Ecija
                            </Text>
                        </View>
                    </View>
                </View>
                {/* <Text style={[styles.subtitle, {
          color: COLORS.greyscale900
        }]}>Scheduled Appointment</Text> */}
                {/* <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>Today, December 22, 2022</Text>
        <Text style={[styles.description, {
          color: COLORS.greyScale800,
        }]}>16:00 - 16:30 PM (30 minutes)</Text> */}
                <Text
                    style={[
                        styles.subtitle,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    Veterinarian Information
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
                    <View>
                        <Text
                            style={[
                                styles.description,
                                {
                                    color: COLORS.greyScale800,
                                },
                            ]}
                        >
                            : {profile.name}
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
                            : {profile.email}
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
                            : {profile.phone_number}
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
                            License Number
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
                            : {profile.license_number}
                        </Text>
                    </View>
                </View>
                {/* <View style={{ backgroundColor: COLORS.tertiaryWhite }}>
          <View style={[styles.pkgContainer, {
            backgroundColor: COLORS.white
          }]}>
            <View style={styles.pkgLeftContainer}>
              <View style={styles.pkgIconContainer}>
                <Image
                  source={icons.chatBubble2}
                  resizeMode='contain'
                  style={styles.pkgIcon}
                />
              </View>
              <View>
                <Text style={[styles.pkgTitle, {
                  color: COLORS.greyscale900
                }]}>Messaging</Text>
                <Text style={[styles.pkgDescription, {
                  color: COLORS.greyScale800
                }]}>Chat messages with doctor</Text>
              </View>
            </View>
            <View style={styles.pkgRightContainer}>
              <Text style={styles.pkgPrice}>$20</Text>
              <Text style={[styles.pkgPriceTag, {
                color: COLORS.greyScale800
              }]}>(paid)</Text>
            </View>
          </View>
        </View> */}
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
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
    },
    doctorImage: {
        height: 110,
        width: 110,
        borderRadius: 16,
        marginHorizontal: 16,
        resizeMode: 'cover',
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
        marginTop: 10,
        paddingTop: 20,
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
    btnIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.white,
        marginRight: 16,
    },
    btnText: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.white,
    },
})

export default VeterinarianDetails
