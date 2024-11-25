import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
} from 'react-native'
import React, { useState, useRef, useContext, useEffect } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import { MaterialIcons } from '@expo/vector-icons'
import { launchImagePicker } from '../utils/ImagePickerHelper'
import SettingsItem from '../components/SettingsItem'
import RBSheet from 'react-native-raw-bottom-sheet'
import Button from '../components/Button'
import AuthContext from '../contexts/AuthContext'
import { STORAGE_URL } from '@env'
import { logout } from '../services/AuthService'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = ({ navigation }) => {
    const { user, setUser } = useContext(AuthContext)
    const { pet_owner } = user
    const refRBSheet = useRef()

    const handleLogout = async () => {
        await logout()
        await AsyncStorage.removeItem('role')
        setUser(null)
    }

    /**
     * Render header
     */
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
                        Profile
                    </Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Image
                            source={icons.notificationBell2}
                            resizeMode="contain"
                            style={[
                                styles.headerIcon,
                                { tintColor: COLORS.greyscale900 },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
    /**
     * Render User Profile
     */
    const renderProfile = () => {
        return (
            <View style={styles.profileContainer}>
                <View>
                    <Image
                        source={{
                            uri: `${STORAGE_URL}/petowners_profile/${pet_owner.image}`,
                        }}
                        resizeMode="cover"
                        style={styles.avatar}
                    />
                </View>
                <Text style={[styles.title, { color: COLORS.greyscale900 }]}>
                    {pet_owner.name}
                </Text>
                <Text style={[styles.subtitle, { color: COLORS.greyscale900 }]}>
                    {pet_owner.email}
                </Text>
            </View>
        )
    }
    /**
     * Render Settings
     */
    const renderSettings = () => {
        const [isDarkMode, setIsDarkMode] = useState(false)

        const toggleDarkMode = () => {
            setIsDarkMode((prev) => !prev)
        }

        return (
            <View style={styles.settingsContainer}>
                <SettingsItem
                    icon={icons.userOutline}
                    name="Edit Profile"
                    onPress={() => navigation.navigate('EditProfile')}
                />
                {/* <SettingsItem
                    icon={icons.bell2}
                    name="Notification"
                    onPress={() => navigation.navigate('SettingsNotifications')}
                /> */}

                {/* <SettingsItem
                    icon={icons.shieldOutline}
                    name="Security"
                    onPress={() => navigation.navigate('SettingsSecurity')}
                /> */}

                <SettingsItem
                    icon={icons.lockedComputerOutline}
                    name="Privacy Policy"
                    onPress={() => navigation.navigate('SettingsPrivacyPolicy')}
                />

                <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={styles.logoutContainer}
                >
                    <View style={styles.logoutLeftContainer}>
                        <Image
                            source={icons.logout}
                            resizeMode="contain"
                            style={[
                                styles.logoutIcon,
                                {
                                    tintColor: 'red',
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.logoutName,
                                {
                                    color: 'red',
                                },
                            ]}
                        >
                            Logout
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderProfile()}
                    {renderSettings()}
                </ScrollView>
            </View>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={SIZES.height * 0.8}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.grayscale200,
                        height: 4,
                    },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        height: 260,
                        backgroundColor: COLORS.white,
                    },
                }}
            >
                <Text style={styles.bottomTitle}>Logout</Text>
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
                        styles.bottomSubtitle,
                        {
                            color: COLORS.black,
                        },
                    ]}
                >
                    Are you sure you want to log out?
                </Text>
                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: COLORS.tansparentPrimary,
                            borderRadius: 32,
                            borderColor: COLORS.tansparentPrimary,
                        }}
                        textColor={COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    viewRight: {
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
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

export default Profile
