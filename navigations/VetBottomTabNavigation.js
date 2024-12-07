import { View, Platform, Image, Text, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, icons } from '../constants'
import {
    VetPetOwnerLists,
    Veterinarians,
    VetScanQR,
    Events,
    VetProfile,
} from '../screens'
import { loadEvents } from '../services/PetsService'

const Tab = createBottomTabNavigator()

const VetBottomTabNavigation = () => {
    const [eventCount, setEventCount] = useState(0)

    const fetchEvents = async () => {
        try {
            const response = await loadEvents()
            const now = new Date()
            const upcomingEvents = response.data.filter(
                (event) => new Date(event.date_time) > now
            )

            // Only update eventCount if there's a change in the length of upcoming events
            if (upcomingEvents.length !== eventCount) {
                setEventCount(upcomingEvents.length)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }

    useEffect(() => {
        // Initial fetch
        fetchEvents()

        // Set up polling interval to fetch events every 5 seconds
        const intervalId = setInterval(fetchEvents, 5000)

        // Clean up interval on unmount
        return () => clearInterval(intervalId)
    }, [eventCount]) // Dependency on eventCount ensures it updates when length changes

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    justifyContent: 'center',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 10,
                    height: Platform.OS === 'ios' ? 100 : 80,
                    backgroundColor: COLORS.white,
                    borderTopColor: 'transparent',
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 12 },
                    shadowRadius: 25,
                },
            }}
        >
            {/** Pet Owners Tab **/}
            <Tab.Screen
                name="VetPetOwnerLists"
                component={VetPetOwnerLists}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animated.View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={focused ? icons.users3 : icons.people4}
                                resizeMode="contain"
                                style={{
                                    height: 30,
                                    width: 30,
                                    tintColor: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            />
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                    fontWeight: '700',
                                }}
                            >
                                Pet Owners
                            </Text>
                        </Animated.View>
                    ),
                }}
            />

            {/** Veterinarians Tab **/}
            <Tab.Screen
                name="Veterinarian"
                component={Veterinarians}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animated.View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={
                                    focused ? icons.vetfill : icons.vet_unfill
                                }
                                resizeMode="contain"
                                style={{
                                    height: 30,
                                    width: 30,
                                    tintColor: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            />
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            >
                                Vets
                            </Text>
                        </Animated.View>
                    ),
                }}
            />

            {/** Center Scan QR Tab with Bold Floating Style **/}
            <Tab.Screen
                name="VetScanQR"
                component={VetScanQR}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: focused
                                    ? COLORS.primary
                                    : COLORS.gray,
                                height: 65,
                                width: 65,
                                borderRadius: 32.5,
                                shadowColor: '#000',
                                shadowOpacity: 0.3,
                                shadowOffset: { width: 0, height: 15 },
                                shadowRadius: 25,
                            }}
                        >
                            <Image
                                source={
                                    focused ? icons.qr_unfill : icons.qrfill
                                }
                                resizeMode="contain"
                                style={{
                                    height: 34,
                                    width: 34,
                                    tintColor: COLORS.white,
                                }}
                            />
                        </View>
                    ),
                }}
            />

            {/** Calendar Tab with Notification Badge **/}
            <Tab.Screen
                name="Calendar"
                component={Events}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={
                                    focused ? icons.calendar5 : icons.calendar4
                                }
                                resizeMode="contain"
                                style={{
                                    height: 30,
                                    width: 30,
                                    tintColor: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            />
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            >
                                Events
                            </Text>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -10,
                                    backgroundColor: 'red',
                                    borderRadius: 12,
                                    width: 18,
                                    height: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: 12,
                                    }}
                                >
                                    {eventCount}
                                </Text>
                            </View>
                        </View>
                    ),
                }}
            />

            {/** Profile Tab **/}
            <Tab.Screen
                name="VetProfile"
                component={VetProfile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Animated.View
                            style={{
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={
                                    focused ? icons.user : icons.userOutline
                                }
                                resizeMode="contain"
                                style={{
                                    height: 30,
                                    width: 30,
                                    tintColor: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            />
                            <Text
                                style={{
                                    ...FONTS.h4,
                                    color: focused
                                        ? COLORS.primary
                                        : COLORS.gray3,
                                }}
                            >
                                Profile
                            </Text>
                        </Animated.View>
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default VetBottomTabNavigation
