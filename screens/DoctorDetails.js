import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import { doctorReviews } from '../data';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';
import { CancelledBooking, CompletedBooking, UpcomingBooking } from '../tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// const renderScene = SceneMap({
//     first: UpcomingBooking,
//     second: CompletedBooking,
//     third: CancelledBooking
//   });

const DoctorDetails = ({ navigation }) => {
    /**
     * Render header
     */
    // const layout = useWindowDimensions();


    // const [index, setIndex] = React.useState(0);
    // const [routes] = React.useState([
    //   { key: 'first', title: 'Veterinarian' },
    //   { key: 'second', title: 'Completed' },
    //   { key: 'third', title: 'Cancelled' }
    // ]);
  
    // const renderTabBar = (props) => (
    //   <TabBar
    //     {...props}
    //     indicatorStyle={{
    //       backgroundColor: COLORS.primary,
    //     }}
    //     style={{
    //       backgroundColor: COLORS.white,
    //     }}
    //     renderLabel={({ route, focused }) => (
    //       <Text style={[{
    //         color: focused ? COLORS.primary : "gray",
    //         fontSize: 16,
    //         fontFamily: "semiBold"
    //       }]}>
    //         {route.title}
    //       </Text>
    //     )}
    //   />
    // )
    const renderHeader = () => {
        const [isFavourite, setIsFavourite] = useState(false);

        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode='contain'
                            style={[styles.backIcon, {
                                tintColor: COLORS.black
                            }]} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, {
                        color: COLORS.black
                    }]}>Cody</Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}>
                        <Image
                            source={isFavourite ? icons.heart2 : icons.heart2Outline}
                            resizeMode='contain'
                            style={[styles.heartIcon, {
                                tintColor: isFavourite ? COLORS.primary : COLORS.greyscale900
                            }]}
                        />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Image
                            source={icons.moreCircle}
                            resizeMode='contain'
                            style={[styles.moreIcon, {
                                tintColor: COLORS.black
                            }]}
                        />
                    </TouchableOpacity> */}
                </View>
            </View>
        )
    }
    /**
     * render content
     */
    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);

        const description = `Dr. Jenny Watson is the top most Immunologists specialist in Christ Hospital at London. She achived several awards for her wonderful contribution in medical field. She is available for private consultation.`

        const toggleExpanded = () => {
            setExpanded(!expanded);
        };
        
        return (
            <View>
                <View style={{ backgroundColor: COLORS.tertiaryWhite }}>
                    <View style={[styles.doctorCard, {
                        backgroundColor: COLORS.white,
                    }]}>
                        <Image
                            source={images.cody}
                            resizeMode='contain'
                            style={styles.doctorImage}
                        />
                        <View>
                            <Text style={[styles.doctorName, {
                                color: COLORS.greyscale900
                            }]}>Cody</Text>
                            <View style={[styles.separateLine, {
                                backgroundColor: COLORS.grayscale200,
                            }]} />
                            <Text style={[styles.doctorSpeciality, {
                                color: COLORS.greyScale800
                            }]}>Dog</Text>
                            <Text style={[styles.doctorHospital, {
                                color: COLORS.greyScale800
                            }]}>Shih Tzu</Text>
                        </View>
                    </View>
                </View>
                {/* <View style={styles.featureContainer}>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.friends}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>5,000+</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>patients</Text>
                    </View>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.activity}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>10+</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>years exper..</Text>
                    </View>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.starHalf}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>4.8</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>rating</Text>
                    </View>
                    <View style={styles.featureItemContainer}>
                        <View style={styles.featureIconContainer}>
                            <Image
                                source={icons.chatBubble2}
                                resizeMode='contain'
                                style={styles.featureIcon}
                            />
                        </View>
                        <Text style={styles.featureItemNum}>4,942</Text>
                        <Text style={[styles.featureItemName, {
                            color: COLORS.greyScale800
                        }]}>reviews</Text>
                    </View>
                </View> */}
                <Text style={[styles.contentTitle, {
                    color: COLORS.greyscale900,
                }]}>Appearance</Text>
                <Text style={[styles.description, {
                    color: COLORS.grayscale700,
                }]} numberOfLines={expanded ? undefined : 2}>{description}</Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={styles.viewBtn}>
                        {expanded ? 'View Less' : 'View More'}
                    </Text>
                </TouchableOpacity>
                <Text style={[styles.contentTitle, {
                    color: COLORS.greyscale900,
                }]}>Working Time</Text>
                <Text style={[styles.description, {
                    color: COLORS.grayscale700,
                }]}>Monday - Friday, 08.00 AM - 20.00 PM</Text>
                {/* <View style={styles.reviewTitleContainer}>
                    <Text style={[styles.contentTitle, {
                        color: COLORS.greyscale900
                    }]}>Reviews</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("DoctorReviews")}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View> */}
                {/* <FlatList
                    data={doctorReviews.slice(0, 2)}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (
                        <ReviewCard
                            avatar={item.avatar}
                            name={item.name}
                            description={item.description}
                            avgRating={item.avgRating}
                            date={item.date}
                            numLikes={item.numLikes}
                        />
                    )}
                /> */}
            </View>
        )
    }
    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                {/* <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                    /> */}
                <ScrollView
                    style={[styles.scrollView, { backgroundColor: COLORS.tertiaryWhite }]}
                    showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: COLORS.white,
            }]}>
                <Button
                    title="Book Appointment"
                    filled
                    style={styles.btn}
                    onPress={() => navigation.navigate("BookAppointment")}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 16
    },
    scrollView: {
        backgroundColor: COLORS.tertiaryWhite
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 16
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: "bold",
        color: COLORS.black
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black
    },
    heartIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900,
        marginRight: 16
    },
    viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    doctorCard: {
        height: 142,
        width: SIZES.width - 32,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        flexDirection: "row",
        alignItems: "center",
    },
    doctorImage: {
        height: 110,
        width: 110,
        borderRadius: 16,
        marginHorizontal: 16
    },
    doctorName: {
        fontSize: 18,
        color: COLORS.greyscale900,
        fontFamily: "bold"
    },
    separateLine: {
        height: 1,
        width: SIZES.width - 32,
        backgroundColor: COLORS.grayscale200,
        marginVertical: 12
    },
    doctorSpeciality: {
        fontSize: 12,
        color: COLORS.greyScale800,
        fontFamily: "medium",
        marginBottom: 8
    },
    doctorHospital: {
        fontSize: 12,
        color: COLORS.greyScale800,
        fontFamily: "medium"
    },
    featureContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 16
    },
    featureItemContainer: {
        alignItems: "center",
    },
    featureIconContainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999
    },
    featureIcon: {
        height: 28,
        width: 28,
        tintColor: COLORS.primary
    },
    featureItemNum: {
        fontSize: 16,
        fontFamily: "bold",
        color: COLORS.primary,
        marginVertical: 6
    },
    featureItemName: {
        fontSize: 12,
        fontFamily: "medium",
        color: COLORS.greyScale800
    },
    contentTitle: {
        fontSize: 20,
        fontFamily: "bold",
        color: COLORS.greyscale900,
        marginVertical: 16
    },
    description: {
        fontSize: 14,
        color: COLORS.grayscale700,
        fontFamily: "regular",
    },
    viewBtn: {
        color: COLORS.primary,
        marginTop: 5,
        fontSize: 14,
        fontFamily: "semiBold",
    },
    reviewTitleContainer: {
        width: SIZES.width - 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 16,
        fontFamily: "bold",
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        width: SIZES.width - 32
    }
})

export default DoctorDetails