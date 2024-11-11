import { CameraView, useCameraPermissions } from 'expo-camera'
import { useEffect, useState } from 'react'
import {
    View,
    StyleSheet,
    Alert,
    Button,
    Text,
    TouchableOpacity,
} from 'react-native'
import { loadPetProfile } from '../../services/PetsService'
import { loadPetownerProfile } from '../../services/PetsOwnerService'

const VetScanQR = ({ navigation }) => {
    const [scannedData, setScannedData] = useState(null)
    const [permission, requestPermission] = useCameraPermissions()

    useEffect(() => {
        requestPermission()
    }, [])

    const handleCodeScanned = async ({ data }) => {
        if (!scannedData) {
            try {
                setScannedData(data)
                const parsedData = JSON.parse(data)

                // Validate presence of required properties
                if (!parsedData.petowner_id || !parsedData.pet_id) {
                    Alert.alert(
                        'Invalid QR Code',
                        'The scanned QR code does not contain valid petowner_id or pet_id.',
                        [{ text: 'Scan Again', onPress: resetScanner }]
                    )
                    return
                }

                const { data: pet } = await loadPetProfile(
                    parsedData.petowner_id,
                    parsedData.pet_id
                )
                const { data: petowner } = await loadPetownerProfile(
                    parsedData.petowner_id
                )
                navigation.navigate('VetPetDetails', {
                    pet: pet,
                    petowner: petowner,
                })
            } catch (error) {
                Alert.alert(
                    'Scan Error',
                    'Failed to scan the QR code. Please try again.',
                    [{ text: 'Scan Again', onPress: resetScanner }]
                )
            }
        }
    }

    const resetScanner = () => {
        setScannedData(null) // Reset scanned data to allow re-scanning
    }

    if (!permission?.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    Camera permission is required to scan QR codes
                </Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    barcodeScannerSettings={{ barCodeTypes: ['qr'] }}
                    onBarcodeScanned={
                        scannedData ? undefined : handleCodeScanned
                    }
                />
                <View style={styles.boundaryOverlay}>
                    <View style={styles.boundaryBox} />
                </View>
                {scannedData && (
                    <View style={styles.overlay}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetScanner}
                        >
                            <Text style={styles.buttonText}>Scan Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={styles.footer}>
                <Button title="Reset Scanner" onPress={resetScanner} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    cameraContainer: {
        flex: 4,
        width: '100%',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    resetButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 50,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    boundaryOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boundaryBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        borderStyle: 'dashed',
        borderRadius: 10,
    },
})

export default VetScanQR
