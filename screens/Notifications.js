import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, icons } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-virtualized-view'
import NotificationCard from '../components/NotificationCard'
import { loadNotifications } from '../services/NotificationService'

const Notifications = ({ navigation }) => {
    const [notifications, setNotifications] = useState([])
    const [refreshing, setRefreshing] = useState(false)

    // Fetch notifications from the API
    const fetchNotifications = async () => {
        try {
            const response = await loadNotifications()
            setNotifications(response.data || [])
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }

    // Pull-to-refresh handler
    const onRefresh = async () => {
        setRefreshing(true)
        await fetchNotifications()
        setRefreshing(false)
    }

    // Interval to fetch notifications every 30 seconds
    useEffect(() => {
        fetchNotifications() // Initial fetch
        const interval = setInterval(() => {
            fetchNotifications()
        }, 5000) // 30 seconds

        return () => clearInterval(interval) // Clear interval on unmount
    }, [])

    /**
     * Render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[
                        styles.headerIconContainer,
                        {
                            borderColor: COLORS.grayscale200,
                        },
                    ]}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={[
                            styles.arrowBackIcon,
                            {
                                tintColor: COLORS.greyscale900,
                            },
                        ]}
                    />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.headerTitle,
                        {
                            color: COLORS.greyscale900,
                        },
                    ]}
                >
                    Notifications
                </Text>
                <Text> </Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <View style={styles.headerNoti}>
                        <View style={styles.headerNotiLeft}>
                            <Text
                                style={[
                                    styles.notiTitle,
                                    {
                                        color: COLORS.greyscale900,
                                    },
                                ]}
                            >
                                All
                            </Text>
                            <View style={styles.headerNotiView}>
                                <Text style={styles.headerNotiTitle}>
                                    {notifications.length}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            {/* <Text style={styles.clearAll}>Clear All</Text> */}
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <NotificationCard
                                title={item.title}
                                description={item.description}
                                icon={item.action}
                                date={item.created_at}
                                onPress={() => {
                                    navigation.navigate('Calendar')
                                }}
                            />
                        )}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerIconContainer: {
        height: 46,
        width: 46,
        borderWidth: 1,
        borderColor: COLORS.grayscale200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    arrowBackIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    headerNoti: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    headerNotiLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notiTitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
    },
    headerNotiView: {
        height: 16,
        width: 16,
        backgroundColor: COLORS.primary,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    headerNotiTitle: {
        fontSize: 10,
        fontFamily: 'bold',
        color: COLORS.white,
    },
    clearAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontFamily: 'medium',
    },
})

export default Notifications
