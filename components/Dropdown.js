import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { COLORS, SIZES } from '../constants'

const Dropdown = (props) => {
    const [isFocused, setIsFocused] = useState(false)
    const [selected, setSelected] = useState('')

    const handleFocus = () => {
        setIsFocused(true)
    }

    const handleBlur = () => {
        setIsFocused(false)
    }

    return (
        <View style={[styles.container]}>
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor: isFocused
                            ? COLORS.primary
                            : COLORS.greyscale500,
                        backgroundColor: isFocused
                            ? COLORS.transparentPrimary
                            : COLORS.greyscale500,
                    },
                ]}
            >
                {props.icon && (
                    <Image
                        source={props.icon}
                        style={[
                            styles.icon,
                            {
                                tintColor: isFocused
                                    ? COLORS.primary
                                    : '#BCBCBC',
                            },
                        ]}
                    />
                )}
                <SelectList
                    setSelected={(val) => {
                        setSelected(val)
                        props.onInputChanged(props.id, val)
                    }}
                    data={props.data || []} // Accepting `data` as props for dropdown options
                    save="value"
                    placeholder={props.placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    boxStyles={[styles.selectBox, { color: COLORS.black }]}
                />
            </View>
            {props.errorText && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText[0]}</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding2,
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 5,
        flexDirection: 'row',
        height: 52,
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
        height: 20,
        width: 20,
        tintColor: '#BCBCBC',
    },
    selectBox: {
        flex: 1,
        color: COLORS.black,
        fontFamily: 'regular',
        fontSize: 14,
    },
    errorContainer: {
        marginVertical: 4,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
})

export default Dropdown
