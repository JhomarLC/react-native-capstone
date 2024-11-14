import { useContext } from 'react'
import axios from '../utils/axios'

export async function loadPets(pet_owner_id) {
    const { data: pets } = await axios.get(`/petowners/${pet_owner_id}/pets`)
    return pets
}
export async function loadPetProfile(pet_owner_id, pet_id) {
    const { data: pet_profile } = await axios.get(
        `/petowners/${pet_owner_id}/pets/${pet_id}`
    )
    return pet_profile
}
export async function loadPetPictures(pet_owner_id, pet_id) {
    const { data: pet_pictures } = await axios.get(
        `/petowners/${pet_owner_id}/pets/${pet_id}/getphotos`
    )
    return pet_pictures
}

export async function addPetPhotos(pet_owner_id, pet_id, photos) {
    const { data: pet_photos } = await axios.post(
        `/petowners/${pet_owner_id}/pets/${pet_id}/addphotos`,
        photos,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
    return pet_photos
}

export async function addPet(pet_owner_id, pet_profile) {
    const { data: created_pet } = await axios.post(
        `/petowners/${pet_owner_id}/pets`,
        pet_profile,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )

    return created_pet
}

export async function approvePet(pet_id) {
    const { data: pet_approved } = await axios.post(`/pets/${pet_id}/approve`)
    return pet_approved
}

export async function declinePet(pet_id) {
    const { data: declined_pet } = await axios.post(`/pets/${pet_id}/decline`)
    return declined_pet
}

export async function loadPetMedication(pet_id) {
    const { data: pet_medications } = await axios.get(
        `/pets/${pet_id}/medications?status=active`
    )
    return pet_medications
}

export async function loadMedications() {
    const { data: medications } = await axios.get(`/medtype?status=active`)
    return medications
}

export async function loadEvents() {
    const { data: events } = await axios.get(`/events`)
    return events
}
