import axios from '../utils/axios'
import { setToken } from './TokenService'

export async function login(credentials) {
    const { data } = await axios.post('/petowner/login', credentials)
    await setToken(data.api_token)
}

export async function loginAsVet(credentials) {
    const { data } = await axios.post('/veterinarian/login', credentials)
    await setToken(data.api_token)
    return data
}

export async function register(formData) {
    const { data } = await axios.post('/petowner/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    await setToken(data.api_token)
    return data
}
export async function registerVet(formData) {
    const { data } = await axios.post('/veterinarian/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    await setToken(data.api_token)
    return data
}

export async function loadUser() {
    const { data: user } = await axios.post('/petowner/profile')
    return user
}
export async function loadVetUser() {
    const { data: user } = await axios.post('/veterinarian/profile')
    return user
}

export async function logout() {
    await axios.post('/logout')

    await setToken(null)
}

export async function updateprofile(petowner_id, formData) {
    const { data } = await axios.post(`/petowners/${petowner_id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}
export async function updateprofilepicture(petowner_id, formData) {
    const { data } = await axios.post(
        `/petowners/${petowner_id}/profile`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
    return data
}
export async function updateVetprofile(veterinarian_id, formData) {
    const { data } = await axios.post(
        `/veterinarians/${veterinarian_id}`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
    console.log(data)

    return data
}
export async function updateVetprofilepicture(veterinarian_id, formData) {
    const { data } = await axios.post(
        `/veterinarians/${veterinarian_id}/profile`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    )
    console.log(data)

    return data
}
