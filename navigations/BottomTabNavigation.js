import { View, Platform, Image, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS, FONTS, icons } from '../constants'
import { Veterinarians, History, Home, Profile, Events } from '../screens'

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
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
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.petfill
                                            : icons.petunfill
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
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Pet Profiles
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Veterinarians"
                component={Veterinarians}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.vetfill
                                            : icons.vet_unfill
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
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Veterinarian
                                </Text>
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={Events}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    source={
                                        focused
                                            ? icons.calendar5
                                            : icons.calendar4
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
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Calendar
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
                                        3
                                    </Text>
                                </View>
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
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
                                        ...FONTS.body4,
                                        color: focused
                                            ? COLORS.primary
                                            : COLORS.gray3,
                                    }}
                                >
                                    Profile
                                </Text>
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
