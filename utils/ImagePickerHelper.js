import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export const launchImagePicker = async () => {
    await checkMediaPermissions()

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
    })

    if (!result.canceled) {
        return result.assets[0].uri
    }
    return null
}

export const launchMultipleImagePicker = async () => {
    await checkMediaPermissions()

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        aspect: [4, 4],
        quality: 0.8,
    })

    if (!result.canceled) {
        return result.assets.map((asset) => asset.uri)
    }
    return null
}

export const getFileType = (uri) => {
    const match = /\.(\w+)$/.exec(uri)
    return match ? `image/${match[1].toLowerCase()}` : `image/jpeg`
}

const checkMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (permissionResult === false) {
            return Promise.reject('We need permission to access your photos')
        }
        if (permissionResult.status !== 'granted') {
            return Promise.reject('We need permission to access your photos')
        }
    }
    return Promise.resolve()
}
