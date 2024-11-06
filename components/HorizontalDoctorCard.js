import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { FontAwesome } from '@expo/vector-icons'

const HorizontalDoctorCard = ({
    name,
    image,
    color_description,
    petBreed,
    status,
    onPress,
    pet_type,
    date_of_birth,
    age,
}) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return styles.statusPendingContainer
            case 'approved':
                return styles.statusActiveContainer
            case 'deceased':
                return styles.statusDeceasedContainer
            default:
                return styles.statusPendingContainer // Fallback to pending style if unknown
        }
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                {
                    backgroundColor: COLORS.white,
                },
            ]}
        >
            <Image source={image} resizeMode="cover" style={styles.image} />
            <View style={getStatusStyle(status)}>
                <Text style={styles.status}>{status}</Text>
            </View>
            <View style={styles.columnContainer}>
                <View style={styles.topViewContainer}>
                    <Text
                        style={[
                            styles.name,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        {name}
                    </Text>
                </View>
                <View style={styles.viewContainer}>
                    {/* <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" /> */}
                    <Text
                        style={[
                            styles.location,
                            {
                                color: COLORS.grayscale700,
                            },
                        ]}
                    >
                        {' '}
                        {pet_type.toUpperCase()}
                    </Text>
                    {/* }]}>{" "}{rating}  ({numReviews})</Text> */}
                    <Text
                        style={[
                            styles.location,
                            {
                                color: COLORS.grayscale700,
                            },
                        ]}
                    >
                        {'  '}| {petBreed}
                    </Text>
                </View>
                <Text
                    style={[
                        styles.location,
                        {
                            color: COLORS.grayscale700,
                        },
                    ]}
                >
                    {' '}
                    {/* {formatDate(date_of_birth)} */}
                    {age}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: SIZES.width - 32,
        backgroundColor: COLORS.white,
        padding: 6,
        borderRadius: 16,
        marginBottom: 12,
        height: 132,
        alignItems: 'center',
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    columnContainer: {
        flexDirection: 'column',
        marginLeft: 12,
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontFamily: 'bold',
        color: COLORS.greyscale900,
        marginVertical: 4,
        marginRight: 40,
    },
    location: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    priceContainer: {
        flexDirection: 'column',
        marginVertical: 4,
    },
    duration: {
        fontSize: 12,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginRight: 8,
    },
    heartIcon: {
        width: 16,
        height: 16,
        tintColor: COLORS.primary,
        marginLeft: 6,
    },
    statusPendingContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusActiveContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 50,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.success,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusDeceasedContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 50,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.dark3,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rating: {
        fontSize: 8,
        fontFamily: 'semiBold',
        color: COLORS.white,
        marginLeft: 4,
    },
    status: {
        fontSize: 8,
        fontFamily: 'semiBold',
        color: COLORS.white,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    topViewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: SIZES.width - 164,
    },
    bottomViewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.primary,
        marginRight: 8,
    },
    motoIcon: {
        height: 18,
        width: 18,
        tintColor: COLORS.primary,
        marginRight: 4,
    },
})

export default HorizontalDoctorCard
