import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Step1Screen from './CreatePetProfile/Step1Screen'
import Step2Screen from './CreatePetProfile/Step2Screen'
import Step3Screen from './CreatePetProfile/Step3Screen'
import FinalScreen from './CreatePetProfile/FinalScreen'
import CreateNewPet from './CreatePetProfile/CreateNewPet'
import SelectPetType from './CreatePetProfile/SelectPetType'
import SelectPetBreed from './CreatePetProfile/SelectPetBreed'
import SetPetProfile from './CreatePetProfile/SetPetProfile'
import { icons } from '../constants'
import dayjs from 'dayjs'
import SelectDOB from './CreatePetProfile/SelectDOB'

const Stack = createStackNavigator()

export default function App() {
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    const [formData, setFormData] = useState({
        type: '',
        breed: '',
        gender: '',
        image: '',
        name: '',
        color_description: '',
        weight: '',
        size: '',
        dob: formattedDate,
    })

    return (
        <Stack.Navigator
            initialRouteName="SelectPetType"
            screenOptions={{ animationEnabled: true }}
        >
            <Stack.Screen
                name="SelectPetType"
                options={{
                    title: 'Select Pet Type',
                    animationEnabled: true,
                }}
            >
                {(props) => (
                    <SelectPetType
                        {...props}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="SelectPetBreed"
                options={{
                    title: 'Select Pet Breed',
                    animationEnabled: true,
                }}
            >
                {(props) => (
                    <SelectPetBreed
                        {...props}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="SetPetProfile"
                options={{
                    title: 'Set Pet Profile',
                    animationEnabled: true,
                }}
            >
                {(props) => (
                    <SetPetProfile
                        {...props}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="SelectDOB"
                options={{
                    title: 'Select Date of Birth',
                    animationEnabled: true,
                }}
            >
                {(props) => (
                    <SelectDOB
                        {...props}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="Final"
                options={{
                    title: 'Review',
                    animationEnabled: true,
                }}
            >
                {(props) => <FinalScreen {...props} formData={formData} />}
            </Stack.Screen>
        </Stack.Navigator>
    )
}
