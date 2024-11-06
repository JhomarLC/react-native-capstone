// screens/Step1Screen.js
import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

export default function Step1Screen({ navigation, formData, setFormData }) {
    return (
        <View>
            <Text>Step 1: Basic Information</Text>
            <TextInput
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                }
            />
            <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                }
            />
            <Button title="Next" onPress={() => navigation.navigate('Step2')} />
        </View>
    )
}
