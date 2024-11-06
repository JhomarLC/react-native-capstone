import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES, images } from '../../constants'
import Button from '../../components/Button'

const { width } = Dimensions.get('window')
const ITEM_SIZE = width / 2 - 24 // Adjusting size to fit 2 items per row
const breeds = {
    Dog: [
        { id: '1', name: 'Aspin (Philippine Native)', image: images.aspin },
        { id: '2', name: 'Labrador Retriever', image: images.labrador },
        { id: '3', name: 'German Shepherd', image: images.german_shepherd },
        { id: '4', name: 'Golden Retriever', image: images.golden_retriever },
        { id: '5', name: 'Bulldog', image: images.bulldog },
        { id: '6', name: 'Beagle', image: images.beagle },
        { id: '7', name: 'Poodle', image: images.poodle },
        { id: '8', name: 'Rottweiler', image: images.rottweiler },
        { id: '9', name: 'Yorkshire Terrier', image: images.yorkshire_terrier },
        { id: '10', name: 'Boxer', image: images.boxer },
        { id: '11', name: 'Dachshund', image: images.dachshund },
        { id: '12', name: 'Siberian Husky', image: images.husky },
        { id: '13', name: 'Great Dane', image: images.great_dane },
        { id: '14', name: 'Shih Tzu', image: images.shih_tzu },
        { id: '15', name: 'Doberman Pinscher', image: images.doberman },
        {
            id: '16',
            name: 'Australian Shepherd',
            image: images.australian_shepherd,
        },
        { id: '17', name: 'Pembroke Welsh Corgi', image: images.corgi },
    ],
    Cat: [
        { id: '18', name: 'Puspin (Philippine Native)', image: images.puspin },
        { id: '19', name: 'Persian', image: images.persian },
        { id: '20', name: 'Maine Coon', image: images.maine_coon },
        { id: '21', name: 'Siamese', image: images.siamese },
        { id: '22', name: 'Ragdoll', image: images.ragdoll },
        {
            id: '23',
            name: 'British Shorthair',
            image: images.british_shorthair,
        },
        { id: '24', name: 'Sphynx', image: images.sphynx },
        { id: '25', name: 'Bengal', image: images.bengal },
        { id: '26', name: 'Russian Blue', image: images.russian_blue },
        { id: '27', name: 'Scottish Fold', image: images.scottish_fold },
        { id: '28', name: 'Savannah', image: images.savannah },
        {
            id: '29',
            name: 'American Shorthair',
            image: images.american_shorthair,
        },
        { id: '30', name: 'Oriental', image: images.oriental },
        { id: '31', name: 'Birman', image: images.birman },
        { id: '32', name: 'Abyssinian', image: images.abyssinian },
        { id: '33', name: 'Himalayan', image: images.himalayan },
        { id: '34', name: 'Burmese', image: images.burmese },
    ],
}

const SelectPetBreed = ({ navigation, formData, setFormData }) => {
    const [selection, setSelection] = useState(null)
    const [filteredBreeds, setFilteredBreeds] = useState([])

    useEffect(() => {
        setFilteredBreeds(formData.type == '1' ? breeds.Dog : breeds.Cat)
    }, [formData.type])

    useEffect(() => {
        if (!selection && filteredBreeds.length > 0) {
            setSelection(filteredBreeds[0].id)
            setFormData({
                ...formData,
                breed: filteredBreeds[0].name,
            })
        }
    }, [filteredBreeds])

    const renderBreed = ({ item }) => {
        const isSelected = selection === item.id
        return (
            <TouchableOpacity
                style={[
                    styles.breedContainer,
                    isSelected && styles.breedSelected,
                ]}
                onPress={() => {
                    setSelection(item.id)
                    setFormData({
                        ...formData,
                        breed: item.name,
                    })
                }}
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
                <Text style={styles.stepText}>Step 2/4</Text>
                <View style={styles.progressBar}>
                    <View style={styles.progress} />
                </View>
            </View>

            {/* Breed Grid */}
            <FlatList
                data={filteredBreeds} // Use filteredBreeds here
                renderItem={renderBreed}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.breedGrid}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.bottomContainer}>
                <Button
                    title="Previous"
                    style={styles.btnCancel}
                    onPress={() => navigation.navigate('SelectPetType')}
                />
                <Button
                    title="Next"
                    filled
                    style={styles.btnSubmit}
                    onPress={() => navigation.navigate('SetPetProfile')}
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
        width: '50%', // Adjust according to progress
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
        borderColor: COLORS.tansparentPrimary,
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
        height: '70%',
        marginBottom: 8,
    },
    breedLabel: {
        fontSize: 14,
        color: COLORS.black,
    },
    breedLabelSelected: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
})

export default SelectPetBreed
