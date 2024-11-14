import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    useWindowDimensions,
    RefreshControl,
    ScrollView,
} from 'react-native'

import React, { useCallback, useEffect, useState } from 'react'
import { COLORS, SIZES, icons, images } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import axios from 'axios'
import moment from 'moment'
import { Agenda } from 'react-native-calendars'
import { calendarTheme } from 'react-native-calendars'
import { loadEvents } from '../services/EventService'

const Events = ({ navigation }) => {
    const [items, setItems] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [eventCount, setEventCount] = useState(0)

    const fetchEvents = async () => {
        try {
            const response = await loadEvents()
            // const events = response
            const events = response.data

            const formattedItems = {}
            events.forEach((event) => {
                const date = event.date_time.split(' ')[0]
                const time = moment(
                    event.date_time.split(' ')[1],
                    'HH:mm:ss'
                ).format('hh:mm A') // Format the time

                if (!formattedItems[date]) {
                    formattedItems[date] = []
                }
                formattedItems[date].push({
                    name: event.name,
                    time,
                    place: event.place,
                    description: event.description,
                })
            })
            setItems(formattedItems)
        } catch (error) {
            console.error('Error fetching events:', error)
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
        fetchEvents().finally(() => setRefreshing(false))
    }

    useEffect(() => {
        // Initial fetch
        fetchEvents()

        // Set up polling interval to fetch events every 5 seconds
        const intervalId = setInterval(fetchEvents, 5000)

        // Clean up interval on unmount
        return () => clearInterval(intervalId)
    }, [eventCount])

    /**
     * render header
     */
    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={images.logo}
                            resizeMode="contain"
                            style={styles.logoIcon}
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
                        Calendar of Events
                    </Text>
                </View>
            </View>
        )
    }
    const customTheme = {
        ...calendarTheme,
        agendaDayTextColor: '#4A90E2',
        agendaDayNumColor: '#4A90E2',
        agendaTodayColor: '#FF6347',
        agendaKnobColor: '#4A90E2',
        backgroundColor: '#F2F3F5',
    }

    const renderItem = useCallback((item) => <AgendaItem item={item} />, [])

    const getUpcomingEvents = () => {
        const today = moment().format('YYYY-MM-DD')
        //
        const futureEvents = []

        Object.keys(items)
            .filter((date) => date >= today)
            .sort()
            .forEach((date) => {
                items[date].forEach((event) => {
                    futureEvents.push({
                        date,
                        ...event,
                        date: moment(date).format('MMMM DD, YYYY'),
                    })
                })
            })

        return futureEvents
    }
    const renderEmptyData = () => {
        const upcomingEvents = getUpcomingEvents()

        return (
            <ScrollView
                contentContainerStyle={[styles.emptyContainer, { flexGrow: 1 }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.emptyText}>No events for today</Text>

                {upcomingEvents.length > 0 && (
                    <View style={styles.upcomingContainer}>
                        <Text style={styles.upcomingTitle}>
                            Upcoming Events
                        </Text>
                        {upcomingEvents.slice(0, 5).map((event, index) => (
                            <View key={index} style={styles.upcomingItem}>
                                <Text style={styles.upcomingDate}>
                                    {event.date}
                                </Text>
                                <Text style={styles.upcomingName}>
                                    {event.name}
                                </Text>
                                <Text style={styles.upcomingTime}>
                                    {event.time}
                                </Text>
                                <Text style={styles.upcomingPlace}>
                                    {event.place}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        )
    }

    const renderContent = () => {}
    const AgendaItem = React.memo(({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemTime}>{item.time}</Text>
            <Text style={styles.itemPlace}>{item.place}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
        </View>
    ))

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: COLORS.white }]}>
            <View style={[styles.container, { backgroundColor: COLORS.white }]}>
                {renderHeader()}
                <Agenda
                    items={items}
                    // showOnlySelectedDayItems={true}
                    renderEmptyData={renderEmptyData}
                    theme={customTheme}
                    renderItem={renderItem}
                    hideKnob={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
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
        width: SIZES.width - 32,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoIcon: {
        height: 50,
        width: 50,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'bold',
        color: COLORS.black,
        marginLeft: 16,
    },
    moreIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.black,
    },
    item: {
        backgroundColor: 'white',
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    itemTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
    },
    itemTime: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
    itemPlace: {
        fontSize: 14,
        color: '#4A90E2',
        marginTop: 4,
    },
    itemDescription: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    emptyContainer: {
        minHeight: '100%', // Ensures the container takes up the full screen height
        alignItems: 'center',
        paddingBottom: 100,
        paddingHorizontal: 10,
    },
    emptyText: {
        fontSize: 18,
        color: '#AAA',
        marginBottom: 20,
        marginTop: 20,
        fontWeight: '500',
    },
    upcomingContainer: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    upcomingTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#4A90E2',
        marginBottom: 15,
        textAlign: 'center',
    },
    upcomingItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    upcomingDate: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '600',
    },
    upcomingName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    upcomingTime: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    upcomingPlace: {
        fontSize: 14,
        color: '#4A90E2',
        marginTop: 2,
    },
})

export default Events
