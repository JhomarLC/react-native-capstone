import axios from '../utils/axios'
import { setToken } from './TokenService'

export async function loadVeterinarians() {
    const { data: veterinarians } = await axios.get('/veterinarians')
    return veterinarians
}

export async function loadVetProfile(vet_id) {
    const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
    return vet_profile
}
