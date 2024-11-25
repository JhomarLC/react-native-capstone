import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS, icons, SIZES } from '../constants'
import { getTimeAgo } from '../utils/date'

const NotificationCard = ({ icon, title, description, date, onPress }) => {
    const [svgIcon, setSvgIcon] = useState('')

    useEffect(() => {
        if (icon === 'add') {
            setSvgIcon(icons.addFile)
        } else if (icon === 'edit') {
            setSvgIcon(icons.editPencil)
        } else if (icon === 'reminder') {
            setSvgIcon(icons.notificationBell2)
        } else if (icon === 'delete') {
            setSvgIcon(icons.trash)
        }
    }, [])
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftContainer}>
                <TouchableOpacity style={styles.iconContainer}>
                    <Image
                        source={svgIcon}
                        resizeMode="cover"
                        style={styles.icon}
                    />
                </TouchableOpacity>
                <View>
                    <Text
                        style={[
                            styles.title,
                            {
                                color: COLORS.greyscale900,
                            },
                        ]}
                    >
                        {title}
                    </Text>
                    <Text style={styles.description}>{description}</Text>
                </View>
            </View>
            <Text style={styles.date}>{getTimeAgo(date)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
        width: SIZES.width - 32,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        height: 44,
        width: 44,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        marginRight: 12,
    },
    icon: {
        width: 22,
        height: 22,
        tintColor: COLORS.white,
    },
    title: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.black,
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        fontFamily: 'regular',
        color: 'gray',
    },
    date: {
        fontSize: 12,
        fontFamily: 'regular',
        color: 'gray',
    },
})

export default NotificationCard
