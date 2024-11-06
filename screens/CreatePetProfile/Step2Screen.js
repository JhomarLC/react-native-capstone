// screens/Step2Screen.js
import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

export default function Step2Screen({ navigation, formData, setFormData }) {
    return (
        <View>
            <Text>Step 2: Security Information</Text>
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                }
            />
            <Button title="Next" onPress={() => navigation.navigate('Step3')} />
        </View>
    )
}
