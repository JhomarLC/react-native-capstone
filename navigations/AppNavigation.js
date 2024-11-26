import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect } from 'react'
import {
    VaccineList,
    PetDetails,
    AddNewAddress,
    AddNewCard,
    Address,
    ArticlesDetails,
    ArticlesSeeAll,
    BookAppointment,
    CancelAppointment,
    CancelAppointmentPaymentMethods,
    Categories,
    ChangeEmail,
    ChangePIN,
    ChangePassword,
    Chat,
    CreateNewPIN,
    CreateNewPassword,
    CustomerService,
    DoctorDetails,
    DoctorReviews,
    EReceipt,
    EditProfile,
    EnterYourPIN,
    Favourite,
    FillYourProfile,
    Fingerprint,
    ForgotPasswordEmail,
    ForgotPasswordMethods,
    ForgotPasswordPhoneNumber,
    HelpCenter,
    InviteFriends,
    Login,
    Messaging,
    MyAppointmentMessaging,
    MyAppointmentVideoCall,
    MyAppointmentVoiceCall,
    MyBookmarkedArticles,
    Notifications as Notification,
    OTPVerification,
    Onboarding1,
    Onboarding2,
    Onboarding3,
    Onboarding4,
    PatientDetails,
    PaymentMethods,
    RescheduleAppointment,
    ReviewSummary,
    Search,
    SelectPackage,
    SelectRescheduleAppointmentDate,
    SessionEnded,
    SettingsLanguage,
    SettingsNotifications,
    SettingsPayment,
    SettingsPrivacyPolicy,
    SettingsSecurity,
    Signup,
    TopDoctors,
    TrendingArticles,
    VideoCall,
    VideoCallHistoryDetails,
    VideoCallHistoryDetailsPlayRecordings,
    VoiceCall,
    VoiceCallHistoryDetails,
    VoiceCallHistoryDetailsPlayRecordings,
    Welcome,
    CreatePetProfile,
    CreateNewPet,
    LeaveReview,
    SelectPetType,
    SelectPetBreed,
    SetPetProfile,
    SelectDOB,
    VeterinarianDetails,
    VetPetOwnerLists,
    VetScanQR,
    VetPetOwnerDetails,
    VetPetDetails,
    VetVaccineList,
    VetAddVaccination,
    VetEditProfile,
    VetPetownerProfileSeeAll,
} from '../screens'
import BottomTabNavigation from './BottomTabNavigation'
import { loadUser, loadVetUser } from '../services/AuthService'
import AuthContext from '../contexts/AuthContext.js'
import FlashMessage from 'react-native-flash-message'
import VetLogin from '../screens/Veterinarians/VetLogin.js'
import VetSignup from '../screens/Veterinarians/VetSignup.js'
import VetBottomTabNavigation from './VetBottomTabNavigation.js'
import * as Notifications from 'expo-notifications'
import {
    addNotificationToken,
    addVetNotificationToken,
} from '../services/NotificationService.js'
import { Alert } from 'react-native'

const Stack = createNativeStackNavigator()

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
})

const AppNavigation = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState()
    const [role, setRole] = useState()

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('role')
                setRole(storedRole) // Update role state for usage elsewhere

                let loadedUser
                if (storedRole === 'veterinarian') {
                    loadedUser = await loadVetUser()
                } else if (storedRole === 'petowner') {
                    loadedUser = await loadUser()
                }
                setUser(loadedUser)
            } catch (error) {
                console.log('Initialization error:', error)
            } finally {
                setIsLoading(false)
            }
        }

        initializeApp()
    }, [])

    useEffect(() => {
        if (user && role) {
            configurePushNotifications()
        }
    }, [user, role])

    async function configurePushNotifications() {
        const { status } = await Notifications.getPermissionsAsync()
        if (status !== 'granted') {
            const { status: newStatus } =
                await Notifications.requestPermissionsAsync()
            if (newStatus === 'granted') {
                const pushTokenData =
                    await Notifications.getExpoPushTokenAsync()

                try {
                    Alert.alert(
                        'Push Token',
                        `Token Received: ${pushTokenData.data}`
                    )
                    if (role === 'veterinarian') {
                        const res = await addVetNotificationToken({
                            veterinarians_id: user.user.id,
                            token: pushTokenData.data,
                        })
                        console.log(res)
                    } else if (role === 'petowner') {
                        const res = await addNotificationToken({
                            pet_owner_id: user.pet_owner.id,
                            token: pushTokenData.data,
                        })
                        console.log(res)
                    }
                } catch (e) {
                    console.log(e)
                    if (e.response?.status === 422) {
                        console.log(e.response.data)
                    } else if (e.response?.status == 401) {
                        console.log(e.response)
                    } else {
                        console.log(e)
                    }
                }
            } else {
                Alert.alert(
                    'Permission Required',
                    'Please enable notifications in settings to receive updates.'
                )
            }
        }

        // if (Platform.OS === 'android') {
        //     Notifications.setNotificationChannelAsync('default', {
        //         name: 'default',
        //         importance: Notifications.AndroidImportance.DEFAULT,
        //     })
        // }
    }

    // Show a loading screen or splash screen while initializing
    if (isLoading) {
        return null // Replace with a loading component if desired
    }

    return (
        <AuthContext.Provider value={{ user, setUser, role, setRole }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        // If user is logged in, go directly to the main app screens
                        <>
                            {role === 'veterinarian' && (
                                <Stack.Screen
                                    name="VetMain"
                                    component={VetBottomTabNavigation}
                                />
                            )}
                            {role === 'petowner' && (
                                <Stack.Screen
                                    name="Main"
                                    component={BottomTabNavigation}
                                />
                            )}

                            {/* VETERINARIANS */}

                            <Stack.Screen
                                name="VetPetOwnerLists"
                                component={VetPetOwnerLists}
                            />
                            <Stack.Screen
                                name="VetScanQR"
                                component={VetScanQR}
                            />
                            <Stack.Screen
                                name="VetPetOwnerDetails"
                                component={VetPetOwnerDetails}
                            />
                            <Stack.Screen
                                name="VetPetDetails"
                                component={VetPetDetails}
                            />
                            <Stack.Screen
                                name="VetVaccineList"
                                component={VetVaccineList}
                            />
                            <Stack.Screen
                                name="VetAddVaccination"
                                component={VetAddVaccination}
                            />
                            <Stack.Screen
                                name="VetEditProfile"
                                component={VetEditProfile}
                            />
                            <Stack.Screen
                                name="VetPetownerProfileSeeAll"
                                component={VetPetownerProfileSeeAll}
                            />
                            {/* PETOWNER */}
                            {/* <Stack.Screen
                                name="Main"
                                component={BottomTabNavigation}
                            /> */}
                            <Stack.Screen
                                name="VeterinarianDetails"
                                component={VeterinarianDetails}
                            />
                            <Stack.Screen
                                name="CreatePetProfile"
                                component={CreatePetProfile}
                            />
                            <Stack.Screen
                                name="CreateNewPet"
                                component={CreateNewPet}
                            />
                            <Stack.Screen
                                name="SelectPetType"
                                component={SelectPetType}
                            />
                            <Stack.Screen
                                name="SelectPetBreed"
                                component={SelectPetBreed}
                            />
                            <Stack.Screen
                                name="SelectDOB"
                                component={SelectDOB}
                            />
                            <Stack.Screen
                                name="SetPetProfile"
                                component={SetPetProfile}
                            />
                            <Stack.Screen
                                name="CreateNewPassword"
                                component={CreateNewPassword}
                            />
                            <Stack.Screen
                                name="CreateNewPIN"
                                component={CreateNewPIN}
                            />
                            <Stack.Screen
                                name="Fingerprint"
                                component={Fingerprint}
                            />
                            <Stack.Screen
                                name="EditProfile"
                                component={EditProfile}
                            />
                            <Stack.Screen
                                name="SettingsNotifications"
                                component={SettingsNotifications}
                            />
                            <Stack.Screen
                                name="SettingsPayment"
                                component={SettingsPayment}
                            />
                            <Stack.Screen
                                name="AddNewCard"
                                component={AddNewCard}
                            />
                            <Stack.Screen
                                name="SettingsSecurity"
                                component={SettingsSecurity}
                            />
                            <Stack.Screen
                                name="ChangePIN"
                                component={ChangePIN}
                            />
                            <Stack.Screen
                                name="ChangePassword"
                                component={ChangePassword}
                            />
                            <Stack.Screen
                                name="ChangeEmail"
                                component={ChangeEmail}
                            />
                            <Stack.Screen
                                name="SettingsLanguage"
                                component={SettingsLanguage}
                            />
                            <Stack.Screen
                                name="SettingsPrivacyPolicy"
                                component={SettingsPrivacyPolicy}
                            />
                            <Stack.Screen
                                name="InviteFriends"
                                component={InviteFriends}
                            />
                            <Stack.Screen
                                name="HelpCenter"
                                component={HelpCenter}
                            />
                            <Stack.Screen
                                name="CustomerService"
                                component={CustomerService}
                            />
                            <Stack.Screen
                                name="EReceipt"
                                component={EReceipt}
                            />
                            <Stack.Screen name="Chat" component={Chat} />
                            <Stack.Screen
                                name="Notifications"
                                component={Notification}
                            />
                            <Stack.Screen name="Search" component={Search} />
                            <Stack.Screen
                                name="PaymentMethods"
                                component={PaymentMethods}
                            />
                            <Stack.Screen
                                name="ReviewSummary"
                                component={ReviewSummary}
                            />
                            <Stack.Screen
                                name="EnterYourPIN"
                                component={EnterYourPIN}
                            />
                            <Stack.Screen
                                name="TopDoctors"
                                component={TopDoctors}
                            />
                            <Stack.Screen
                                name="Categories"
                                component={Categories}
                            />
                            <Stack.Screen
                                name="Favourite"
                                component={Favourite}
                            />
                            <Stack.Screen
                                name="DoctorDetails"
                                component={DoctorDetails}
                            />
                            <Stack.Screen
                                name="PetDetails"
                                component={PetDetails}
                            />
                            <Stack.Screen
                                name="VaccineList"
                                component={VaccineList}
                            />
                            <Stack.Screen
                                name="DoctorReviews"
                                component={DoctorReviews}
                            />
                            <Stack.Screen
                                name="BookAppointment"
                                component={BookAppointment}
                            />
                            <Stack.Screen
                                name="SelectPackage"
                                component={SelectPackage}
                            />
                            <Stack.Screen
                                name="PatientDetails"
                                component={PatientDetails}
                            />
                            <Stack.Screen
                                name="CancelAppointment"
                                component={CancelAppointment}
                            />
                            <Stack.Screen
                                name="CancelAppointmentPaymentMethods"
                                component={CancelAppointmentPaymentMethods}
                            />
                            <Stack.Screen
                                name="RescheduleAppointment"
                                component={RescheduleAppointment}
                            />
                            <Stack.Screen
                                name="SelectRescheduleAppointmentDate"
                                component={SelectRescheduleAppointmentDate}
                            />
                            <Stack.Screen
                                name="MyAppointmentMessaging"
                                component={MyAppointmentMessaging}
                            />
                            <Stack.Screen
                                name="MyAppointmentVoiceCall"
                                component={MyAppointmentVoiceCall}
                            />
                            <Stack.Screen
                                name="MyAppointmentVideoCall"
                                component={MyAppointmentVideoCall}
                            />
                            <Stack.Screen
                                name="VideoCall"
                                component={VideoCall}
                            />
                            <Stack.Screen
                                name="VoiceCall"
                                component={VoiceCall}
                            />
                            <Stack.Screen
                                name="SessionEnded"
                                component={SessionEnded}
                            />
                            <Stack.Screen
                                name="LeaveReview"
                                component={LeaveReview}
                            />
                            <Stack.Screen
                                name="VoiceCallHistoryDetails"
                                component={VoiceCallHistoryDetails}
                            />
                            <Stack.Screen
                                name="VideoCallHistoryDetails"
                                component={VideoCallHistoryDetails}
                            />
                            <Stack.Screen
                                name="VoiceCallHistoryDetailsPlayRecordings"
                                component={
                                    VoiceCallHistoryDetailsPlayRecordings
                                }
                            />
                            <Stack.Screen
                                name="VideoCallHistoryDetailsPlayRecordings"
                                component={
                                    VideoCallHistoryDetailsPlayRecordings
                                }
                            />
                            <Stack.Screen
                                name="MyBookmarkedArticles"
                                component={MyBookmarkedArticles}
                            />
                            <Stack.Screen
                                name="ArticlesDetails"
                                component={ArticlesDetails}
                            />
                            <Stack.Screen
                                name="ArticlesSeeAll"
                                component={ArticlesSeeAll}
                            />
                            <Stack.Screen
                                name="TrendingArticles"
                                component={TrendingArticles}
                            />
                            <Stack.Screen name="Address" component={Address} />
                            <Stack.Screen
                                name="AddNewAddress"
                                component={AddNewAddress}
                            />
                            <Stack.Screen
                                name="Messaging"
                                component={Messaging}
                            />
                            <Stack.Screen
                                name="ForgotPasswordMethods"
                                component={ForgotPasswordMethods}
                            />
                            <Stack.Screen
                                name="ForgotPasswordEmail"
                                component={ForgotPasswordEmail}
                            />
                            <Stack.Screen
                                name="ForgotPasswordPhoneNumber"
                                component={ForgotPasswordPhoneNumber}
                            />
                            <Stack.Screen
                                name="OTPVerification"
                                component={OTPVerification}
                            />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Welcome" component={Welcome} />
                            {/* VETERINARIANS */}
                            <Stack.Screen
                                name="VetLogin"
                                component={VetLogin}
                            />
                            <Stack.Screen
                                name="VetSignup"
                                component={VetSignup}
                            />
                            {/* PETOWNER */}

                            <Stack.Screen name="Login" component={Login} />
                            <Stack.Screen name="Signup" component={Signup} />
                            <Stack.Screen
                                name="FillYourProfile"
                                component={FillYourProfile}
                            />
                            <Stack.Screen
                                name="ForgotPasswordMethods"
                                component={ForgotPasswordMethods}
                            />
                            <Stack.Screen
                                name="ForgotPasswordEmail"
                                component={ForgotPasswordEmail}
                            />
                            <Stack.Screen
                                name="ForgotPasswordPhoneNumber"
                                component={ForgotPasswordPhoneNumber}
                            />
                            <Stack.Screen
                                name="OTPVerification"
                                component={OTPVerification}
                            />
                            <Stack.Screen
                                name="CreateNewPassword"
                                component={CreateNewPassword}
                            />
                        </>
                    )}
                </Stack.Navigator>
                <FlashMessage position="bottom" />
            </NavigationContainer>
        </AuthContext.Provider>
    )
}

export default AppNavigation
