import { useContext } from 'react'
import axios from '../utils/axios'

export async function loadEvents() {
    const { data: events } = await axios.get(`/events`)
    return events
}

// export async function loadVetProfile(vet_id) {
//     const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
//     return vet_profile
// }
