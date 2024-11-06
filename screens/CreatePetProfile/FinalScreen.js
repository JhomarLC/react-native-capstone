// screens/FinalScreen.js
import React from 'react'
import { View, Text, Button } from 'react-native'

export default function FinalScreen({ formData }) {
    const handleSubmit = () => {
        console.log('Form Data Submitted:', formData)
    }

    return (
        <View>
            <Text>Final Review</Text>
            <Text>Name: {formData.name}</Text>
            <Text>Email: {formData.email}</Text>
            <Text>Password: {formData.password ? '******' : ''}</Text>
            <Text>Address: {formData.address}</Text>
            <Text>Phone: {formData.phone}</Text>
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    )
}
