import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SIZES, COLORS } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { loadVeterinarians } from '../services/VeterinarianService'
import { STORAGE_URL } from '@env'

const VeterinarianDetails = () => {
    const [veterinarians, setVeterinarians] = useState([])
    const [refreshing, setRefreshing] = useState(false) // State to handle refresh
    const navigation = useNavigation()

    const loadVets = async () => {
        try {
            const result = await loadVeterinarians()
            setVeterinarians(result.data)
        } catch (e) {
            console.log('Failed to load Veterinarians', e)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadVets()
        setRefreshing(false)
    }

    useEffect(() => {
        loadVets()
    }, [])

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: COLORS.tertiaryWhite,
                },
            ]}
        >
            <FlatList
                data={veterinarians}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.cardContainer,
                            {
                                backgroundColor: COLORS.white,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('MyAppointmentMessaging', {
                                    vet_id: item.id,
                                })
                            }
                            style={styles.detailsViewContainer}
                        >
                            <View style={styles.detailsContainer}>
                                <Image
                                    source={{
                                        uri: `${STORAGE_URL}/vet_profiles/${item.image}`,
                                    }}
                                    resizeMode="cover"
                                    style={styles.serviceImage}
                                />
                                <View style={styles.detailsRightContainer}>
                                    <Text
                                        style={[
                                            styles.name,
                                            {
                                                color: COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.positionEmail,
                                            {
                                                color: COLORS.grayscale700,
                                            },
                                        ]}
                                    >
                                        {item.position}{' '}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.positionEmail,
                                            {
                                                color: COLORS.grayscale700,
                                            },
                                        ]}
                                    >
                                        {item.email}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.tertiaryWhite,
    },
    cardContainer: {
        width: SIZES.width - 32,
        borderRadius: 18,
        backgroundColor: COLORS.white,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 88,
        height: 88,
        borderRadius: 16,
        marginHorizontal: 12,
    },
    detailsRightContainer: {
        marginLeft: 12,
    },
    name: {
        fontSize: 17,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
    },
    positionEmail: {
        fontSize: 12,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 6,
    },
    listContent: {
        paddingBottom: 20,
    },
    detailsViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
})

export default VeterinarianDetails
