import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, images } from '../../constants'
import Button from '../../components/Button'

const { width } = Dimensions.get('window')
const ITEM_SIZE = width / 2 - 24 // Adjusting size to fit 2 items per row

const breeds = [
    { id: '1', name: 'Dog', image: images.dog },
    { id: '2', name: 'Cat', image: images.cat },
]

const CreateNewPet = ({ navigation }) => {
    const [selection, setSelection] = useState('1') // Set default selection to Dog

    const renderBreed = ({ item }) => {
        const isSelected = selection === item.id
        return (
            <TouchableOpacity
                style={[
                    styles.breedContainer,
                    isSelected && styles.breedSelected,
                ]}
                onPress={() => setSelection(item.id)}
            >
                <Image
                    source={item.image}
                    style={styles.breedImage}
                    resizeMode="contain"
                />
                <Text
                    style={[
                        styles.breedLabel,
                        isSelected && styles.breedLabelSelected,
                    ]}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with title, step, and progress bar */}
            <View style={styles.header}>
                <Text style={styles.stepText}>Step 1/4</Text>
                <View style={styles.progressBar}>
                    <View style={styles.progress} />
                </View>
            </View>

            {/* Breed Grid */}
            <FlatList
                data={breeds}
                renderItem={renderBreed}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.breedGrid}
                showsVerticalScrollIndicator={false}
            />

            <View
                style={[
                    styles.bottomContainer,
                    {
                        backgroundColor: COLORS.white,
                    },
                ]}
            >
                <Button
                    title="Cancel"
                    style={styles.btnCancel}
                    onPress={() => navigation.navigate('Home')}
                />
                <Button
                    title="Next"
                    filled
                    style={styles.btnSubmit}
                    onPress={() => navigation.navigate('Step2')}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
    },
    btnCancel: {
        width: (SIZES.width - 32) / 2 - 18,
        backgroundColor: COLORS.tansparentPrimary,
        borderWidth: 0,
    },
    btnSubmit: {
        width: (SIZES.width - 32) / 2 - 18,
    },
    bottomContainer: {
        bottom: 0,
        width: 'auto',
        height: 112,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    subHeaderText: {
        fontSize: 14,
        color: COLORS.gray,
    },
    stepText: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 4,
    },
    progressBar: {
        height: 4,
        width: '80%',
        backgroundColor: COLORS.lightGray,
        borderRadius: 2,
        marginTop: 8,
    },
    progress: {
        height: 4,
        width: '25%', // Adjust according to progress
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    breedGrid: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    breedContainer: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 8,
        padding: 10,
    },
    breedSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    breedImage: {
        width: '100%',
        height: '50%',
        marginBottom: 8,
        tintColor: COLORS.primary,
    },
    breedLabel: {
        fontSize: 14,
        color: COLORS.black,
    },
    breedLabelSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    continueButton: {
        width: '100%',
        marginVertical: 8,
    },
    skipText: {
        color: COLORS.gray,
        textDecorationLine: 'underline',
    },
})

export default CreateNewPet
