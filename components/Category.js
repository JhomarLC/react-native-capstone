import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const Category = ({   name, icon, iconColor, backgroundColor }) => {

  return (
    <View style={styles.container}>
        <TouchableOpacity 
           style={[styles.iconContainer, {
            backgroundColor: backgroundColor
           }]}>
            <Image
                source={icon}
                resizeMode='contain'
                style={[styles.icon, { 
                    tintColor: iconColor
                }]}
            />
        </TouchableOpacity>
        <Text style={[styles.name, { 
            color: COLORS.greyscale900
        }]}>{name}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 12,
        width: (SIZES.width - 32)/4
    },
    iconContainer: {
        width: 54,
        height: 54,
        borderRadius: 999,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8
    },
    icon: {
        height: 24,
        width: 24
    },
    name: {
        fontSize: 14,
        fontFamily: "medium",
        color: COLORS.black
    }
})

export default Category