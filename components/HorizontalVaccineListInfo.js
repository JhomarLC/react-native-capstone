import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native'
import React, { useState, useRef } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { FontAwesome } from '@expo/vector-icons'
import RBSheet from 'react-native-raw-bottom-sheet'
import { categories, doctors, ratings, vaccineData } from '../data'
import Button from '../components/Button'
import { formatDate } from '../services/FormatDate'
import { STORAGE_URL } from '@env'

const HorizontalVaccineListInfo = ({
    onPress,
    vaccineTypeName,
    vaccineDate,
    Vaccinedoctor,
    medications,
}) => {
    const refRBSheet = useRef()

    return (
        <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={[
                styles.cardContainer,
                {
                    backgroundColor: COLORS.white,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 4,
                },
            ]}
        >
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
                        {vaccineTypeName}
                    </Text>
                </View>
                <View style={styles.viewContainer}>
                    {/* <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" /> */}
                    <Text
                        style={[
                            styles.VaccineDetails,
                            {
                                color: COLORS.grayscale700,
                            },
                        ]}
                    >
                        {' '}
                        {vaccineDate}
                    </Text>
                    {/* }]}>{" "}{rating}  ({numReviews})</Text> */}
                    <Text
                        style={[
                            styles.VaccineDetails,
                            {
                                color: COLORS.grayscale700,
                            },
                        ]}
                    >
                        {'  '}| {Vaccinedoctor}
                    </Text>
                </View>

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={384}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        },
                        draggableIcon: {
                            backgroundColor: '#000',
                        },
                        container: {
                            borderTopRightRadius: 32,
                            borderTopLeftRadius: 32,
                            height: 'auto',
                            backgroundColor: COLORS.white,
                            alignItems: 'center',
                        },
                    }}
                >
                    <FlatList
                        data={medications}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Text
                                        style={[
                                            styles.bottomTitle,
                                            {
                                                color: COLORS.greyscale900,
                                            },
                                        ]}
                                    >
                                        {item.medicationname.name}
                                    </Text>

                                    <View style={styles.separateLine} />

                                    {/* details */}
                                    <View style={{ width: SIZES.width - 32 }}>
                                        <Text
                                            style={[
                                                styles.sheetTitle,
                                                {
                                                    color: COLORS.greyscale900,
                                                },
                                            ]}
                                        >
                                            Details
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 40,
                                        }}
                                    >
                                        <View style={{ width: '55%' }}>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                Batch No
                                            </Text>
                                            <Text>{item.batch_number}</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                Expiry Date
                                            </Text>
                                            <Text>{item.expiry_date}</Text>
                                        </View>
                                    </View>

                                    {/* registration fee */}
                                    <View style={{ width: SIZES.width - 32 }}>
                                        <Text
                                            style={[
                                                styles.sheetTitle,
                                                {
                                                    color: COLORS.greyscale900,
                                                },
                                            ]}
                                        >
                                            Registration Fee
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 40,
                                        }}
                                    >
                                        <View style={{ width: '55%' }}>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                Fee
                                            </Text>
                                            <Text>PHP {item.fee}</Text>
                                        </View>
                                        <View>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                OR No
                                            </Text>
                                            <Text>{item.or_number}</Text>
                                        </View>
                                    </View>

                                    {/* date */}
                                    <View style={{ width: SIZES.width - 32 }}>
                                        <Text
                                            style={[
                                                styles.sheetTitle,
                                                {
                                                    color: COLORS.greyscale900,
                                                },
                                            ]}
                                        >
                                            Date
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 40,
                                        }}
                                    >
                                        <View>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                Vaccination Date
                                            </Text>
                                            <Text>{item.medication_date}</Text>
                                        </View>
                                        <View style={{ marginLeft: 60 }}>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                Next Vaccination Date
                                            </Text>

                                            {item.next_vaccination ? (
                                                <>
                                                    <Text>
                                                        {item.next_vaccination}
                                                    </Text>
                                                </>
                                            ) : (
                                                <Text>None</Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Veterinarian */}
                                    <View style={{ width: SIZES.width - 32 }}>
                                        <Text
                                            style={[
                                                styles.sheetTitle,
                                                {
                                                    color: COLORS.greyscale900,
                                                },
                                            ]}
                                        >
                                            Veterinarian
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            width: SIZES.width - 32,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 40,
                                        }}
                                    >
                                        <View>
                                            <Image
                                                source={{
                                                    uri: `${STORAGE_URL}/vet_profiles/${item.veterinarian.image}`,
                                                }}
                                                resizeMode="contain"
                                                style={[styles.backIcon, {}]}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                {item.veterinarian.name}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                {item.veterinarian.position}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.VaccineDetails,
                                                    {
                                                        color: COLORS.greyscale900,
                                                    },
                                                ]}
                                            >
                                                {
                                                    item.veterinarian
                                                        .license_number
                                                }
                                            </Text>
                                        </View>
                                        <View>
                                            <Image
                                                source={{
                                                    uri: `${STORAGE_URL}/electronic_signatures/${item.veterinarian.electronic_signature}`,
                                                }}
                                                resizeMode="contain"
                                                style={[
                                                    styles.imageSignature,
                                                    {},
                                                ]}
                                            />
                                        </View>
                                    </View>

                                    {/* remarks */}
                                    <View style={{ width: SIZES.width - 32 }}>
                                        <Text
                                            style={[
                                                styles.sheetTitle,
                                                {
                                                    color: COLORS.greyscale900,
                                                },
                                            ]}
                                        >
                                            Remarks
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            style={[
                                                styles.VaccineDetails,
                                                {
                                                    color: COLORS.greyscale900,
                                                    paddingHorizontal: 40,
                                                },
                                            ]}
                                        >
                                            {item.remarks}
                                        </Text>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    <View style={styles.separateLine} />
                </RBSheet>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backIcon: {
        height: 70,
        width: 70,
        borderRadius: 50,
    },
    imageSignature: {
        height: 70,
        width: 70,
    },
    bottomTitle: {
        fontSize: 18,
        fontFamily: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: 12,
    },
    separateLine: {
        height: 0.4,
        width: SIZES.width - 32,
        backgroundColor: COLORS.greyscale300,
        marginVertical: 12,
    },
    sheetTitle: {
        fontSize: 16,
        fontFamily: 'semiBold',
        color: COLORS.black,
        marginVertical: 12,
        paddingLeft: 10,
    },
    cardContainer: {
        width: SIZES.width - 38,
        borderRadius: 18,
        backgroundColor: 'transparent',
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 16,
        marginLeft: 3,
        marginTop: 4,
    },
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
    VaccineDetails: {
        fontSize: 14,
        fontFamily: 'regular',
        color: COLORS.grayscale700,
        marginVertical: 4,
    },
    // priceContainer: {
    //     flexDirection: "column",
    //     marginVertical: 4,
    // },
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
    // priceContainer: {
    //     flexDirection: "row",
    //     alignItems: "center"
    // },
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

export default HorizontalVaccineListInfo
