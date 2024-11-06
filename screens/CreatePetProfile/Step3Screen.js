// screens/Step3Screen.js
import React from 'react'
import { View, Text, TextInput, Button } from 'react-native'

export default function Step3Screen({ navigation, formData, setFormData }) {
    return (
        <View>
            <Text>Step 3: Contact Information</Text>
            <TextInput
                placeholder="Address"
                value={formData.address}
                onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                }
            />
            <TextInput
                placeholder="Phone Number"
                value={formData.phone}
                onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                }
            />
            <Button title="Next" onPress={() => navigation.navigate('Final')} />
        </View>
    )
}
