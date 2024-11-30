import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons } from '../constants'
import { FontAwesome } from '@expo/vector-icons'
import { STORAGE_URL } from '@env'
import { Skeleton } from 'moti/skeleton'
const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
        type: 'timing',
        duration: '2000',
    },
    backgroundColor: '#D4D4D4',
}
const HorizontalVeterinarianCard = ({
    vetName,
    address,
    position,
    email,
    image,
    onPress,
}) => {
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
            <Skeleton.Group show={image == null}>
                <Skeleton
                    width={100}
                    height={100}
                    radius={16}
                    {...SkeletonCommonProps}
                >
                    <Image
                        source={{
                            uri: `${STORAGE_URL}/vet_profiles/${image}`,
                        }}
                        resizeMode="cover"
                        style={styles.image}
                    />
                </Skeleton>

                <View style={styles.columnContainer}>
                    <View style={styles.topViewContainer}>
                        <Skeleton width={'95%'} {...SkeletonCommonProps}>
                            <Text
                                style={[
                                    styles.name,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                {vetName}
                            </Text>
                        </Skeleton>
                    </View>
                    <View style={styles.viewContainer}>
                        <Skeleton width={'80%'} {...SkeletonCommonProps}>
                            <Text
                                style={[
                                    styles.location,
                                    {
                                        color: COLORS.grayscale700,
                                    },
                                ]}
                            >
                                {position}
                            </Text>
                        </Skeleton>
                    </View>
                    <Skeleton width={'100%'} {...SkeletonCommonProps}>
                        <Text
                            style={[
                                styles.location,
                                {
                                    color: COLORS.grayscale700,
                                },
                            ]}
                        >
                            {email}
                        </Text>
                    </Skeleton>
                </View>
            </Skeleton.Group>
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
        width: 100,
        height: 100,
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
        display: 'flex',
    },
    location: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        display: 'flex',
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
    reviewContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        width: 40,
        height: 20,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        zIndex: 999,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 7,
    },
    rating: {
        fontSize: 8,
        fontFamily: 'semiBold',
        color: COLORS.white,
        marginLeft: 4,
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

export default HorizontalVeterinarianCard
