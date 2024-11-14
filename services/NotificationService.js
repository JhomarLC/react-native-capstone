import axios from '../utils/axios'
import { setToken } from './TokenService'

export async function addNotificationToken(token) {
    const { data: notification_token } = await axios.post(
        '/notification-tokens',
        token
    )
    return notification_token
}

export async function loadVetProfile(vet_id) {
    const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
    return vet_profile
}
