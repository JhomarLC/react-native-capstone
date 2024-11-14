import React from 'react'
import {
    Modal,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
} from 'react-native'
import { COLORS, SIZES } from '../constants'
import Button from './Button'

const CustomModal = ({ visible, onClose, title, message, icon }) => {
    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[mstyles.modalContainer]}>
                    <View
                        style={[
                            mstyles.modalSubContainer,
                            { backgroundColor: COLORS.secondaryWhite },
                        ]}
                    >
                        {icon && (
                            <Image
                                source={icon}
                                resizeMode="contain"
                                style={mstyles.modalIllustration}
                            />
                        )}
                        <Text style={mstyles.modalTitle}>{title}</Text>
                        <Text
                            style={[
                                mstyles.modalSubtitle,
                                { color: COLORS.greyscale900 },
                            ]}
                        >
                            {message}
                        </Text>
                        <Button
                            title="Okay"
                            filled
                            onPress={onClose}
                            style={{
                                width: '100%',
                                marginTop: 12,
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const mstyles = StyleSheet.create({
    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 999,
        backgroundColor: COLORS.white,
        position: 'absolute',
        right: 16,
        top: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalSubtitle: {
        fontSize: 16,
        fontFamily: 'regular',
        color: COLORS.black2,
        textAlign: 'center',
        marginVertical: 12,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalSubContainer: {
        height: 494,
        width: SIZES.width * 0.9,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalIllustration: {
        height: 180,
        width: 180,
        marginVertical: 22,
    },
})
export default CustomModal
