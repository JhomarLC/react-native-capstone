import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons } from '../../constants'
import { FontAwesome } from '@expo/vector-icons'
import { Skeleton } from 'moti/skeleton'
const SkeletonCommonProps = {
    colorMode: 'light',
    transition: {
        type: 'timing',
        duration: '2000',
    },
    backgroundColor: '#D4D4D4',
}

const HorizontalPetOwnerCard = ({
    name,
    image,
    // address,
    addr_zone,
    addr_brgy,
    email,
    // type,
    // petBreed,
    // distance,
    // hospital,
    // consultationFee,
    // rating,
    // numReviews,
    isAvailable,
    onPress,
}) => {
    const [isLoading, setIsLoading] = useState(true)

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
            <Skeleton.Group show={isLoading}>
                <Skeleton
                    width={100}
                    radius={16}
                    height={100}
                    {...SkeletonCommonProps}
                >
                    <Image
                        source={image}
                        resizeMode="cover"
                        onLoad={() => setIsLoading(false)}
                        style={styles.image}
                    />
                </Skeleton>
                {isAvailable && isAvailable === true && (
                    <View style={styles.reviewContainer}>
                        <Text style={styles.rating}>ACTIVE</Text>
                    </View>
                )}
                <View style={styles.columnContainer}>
                    <View style={styles.topViewContainer}>
                        <Skeleton width={'95%'} {...SkeletonCommonProps}>
                            {!isLoading && (
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
                            )}
                        </Skeleton>
                    </View>
                    <View style={styles.viewContainer}>
                        {/* <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" /> */}
                        <Skeleton width={'80%'} {...SkeletonCommonProps}>
                            {!isLoading && (
                                <Text
                                    style={[
                                        styles.location,
                                        {
                                            color: COLORS.grayscale700,
                                        },
                                    ]}
                                >
                                    Zone {addr_zone}, Brgy.{addr_brgy}, San Jose
                                    City
                                </Text>
                            )}
                        </Skeleton>
                        {/* }]}>{" "}{rating}  ({numReviews})</Text> */}
                    </View>
                    <Skeleton width={'100%'} {...SkeletonCommonProps}>
                        {!isLoading && (
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
                        )}
                    </Skeleton>
                    {/* <Text style={[styles.location, {
                    color: COLORS.grayscale700,
                }]}></Text> */}
                    {/* <View style={styles.bottomViewContainer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{}</Text>
                        <Text style={styles.price}>{type}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                        <Image
                            source={isFavourite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={styles.heartIcon}
                        />
                    </TouchableOpacity>
                </View> */}
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

export default HorizontalPetOwnerCard
