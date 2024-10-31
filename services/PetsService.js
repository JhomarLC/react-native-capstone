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
    console.log(pet_photos)

    return pet_photos
}

// export async function loadVetProfile(vet_id) {
//     const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
//     return vet_profile
// }
