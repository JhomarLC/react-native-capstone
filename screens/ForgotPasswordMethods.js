import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { COLORS, SIZES, icons, illustrations } from '../constants'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import Button from '../components/Button'

const ForgotPasswordMethods = ({ navigation }) => {
    const [selectedMethod, setSelectedMethod] = useState('email')

    return (
        <SafeAreaView style={styles.area}>
            <View style={styles.container}>
                <Header title="Forgot Password" />
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.passwordContainer}>
                        <Image
                            source={illustrations.password}
                            resizeMode="contain"
                            style={styles.password}
                        />
                    </View>
                    <Text style={styles.title}>
                        Use your email to reset your password
                    </Text>
                    <TouchableOpacity
                        style={[styles.methodContainer, styles.selectedMethod]}
                        onPress={() => handleMethodPress('email')}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={icons.email}
                                resizeMode="contain"
                                style={styles.icon}
                            />
                        </View>
                        <View>
                            <Text style={styles.methodTitle}>via Email:</Text>
                            <Text style={styles.methodSubtitle}>
                                example@gmail.com
                            </Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Continue"
                        filled
                        style={styles.button}
                        onPress={() =>
                            navigation.navigate(
                                selectedMethod === 'sms'
                                    ? 'ForgotPasswordPhoneNumber'
                                    : 'ForgotPasswordEmail'
                            )
                        }
                    />
                </View>
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
    scrollViewContent: {
        paddingBottom: 100, // Ensure there's space above the button
    },
    password: {
        width: 276,
        height: 250,
    },
    passwordContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 32,
    },
    title: {
        fontSize: 18,
        fontFamily: 'medium',
        textAlign: 'center',
        color: COLORS.greyscale900,
    },
    methodContainer: {
        width: SIZES.width - 32,
        height: 112,
        borderRadius: 32,
        borderColor: 'gray',
        borderWidth: 0.3,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
    },
    selectedMethod: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.tansparentPrimary,
        marginHorizontal: 16,
    },
    icon: {
        width: 32,
        height: 32,
        tintColor: COLORS.primary,
    },
    methodTitle: {
        fontSize: 14,
        fontFamily: 'medium',
        color: COLORS.greyscale600,
    },
    methodSubtitle: {
        fontSize: 16,
        fontFamily: 'bold',
        color: COLORS.black,
        marginTop: 12,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    button: {
        borderRadius: 32,
    },
})

export default ForgotPasswordMethods
