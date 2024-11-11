import { useContext } from 'react'
import axios from '../utils/axios'

export async function loadMedicationNames(medication_id) {
    const { data: medications_name } = await axios.get(
        `/medtype/${medication_id}/medname/`
    )
    return medications_name
}

export async function addMedication(pet_id, medications) {
    console.log(pet_id, medications)

    const { data: added_medication } = await axios.post(
        `/pets/${pet_id}/medications`,
        medications
    )
    console.log(added_medication)

    return added_medication
}
// export async function loadPetProfile(pet_owner_id, pet_id) {
//     const { data: pet_profile } = await axios.get(
//         `/petowners/${pet_owner_id}/pets/${pet_id}`
//     )
//     return pet_profile
// }
// export async function loadPetPictures(pet_owner_id, pet_id) {
//     const { data: pet_pictures } = await axios.get(
//         `/petowners/${pet_owner_id}/pets/${pet_id}/getphotos`
//     )
//     return pet_pictures
// }

// export async function addPetPhotos(pet_owner_id, pet_id, photos) {
//     const { data: pet_photos } = await axios.post(
//         `/petowners/${pet_owner_id}/pets/${pet_id}/addphotos`,
//         photos,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         }
//     )
//     console.log(pet_photos)

//     return pet_photos
// }

// export async function addPet(pet_owner_id, pet_profile) {
//     const { data: created_pet } = await axios.post(
//         `/petowners/${pet_owner_id}/pets`,
//         pet_profile,
//         {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         }
//     )
//     console.log(created_pet)

//     return created_pet
// }
// export async function loadPetMedication(pet_id, medication) {
//     const { data: pet_medications } = await axios.get(
//         // `/pets/${pet_id}/medications/${medication}`
//         `/pets/${pet_id}/medications`
//     )
//     return pet_medications
// }

// export async function loadMedications() {
//     const { data: medications } = await axios.get(`/medtype`)
//     return medications
// }

// export async function loadEvents() {
//     const { data: events } = await axios.get(`/events`)
//     return events
// }

// export async function loadVetProfile(vet_id) {
//     const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
//     return vet_profile
// }
