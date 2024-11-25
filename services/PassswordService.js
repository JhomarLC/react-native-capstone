import { useContext } from 'react'
import axios from '../utils/axios'

// PETOWNER
export async function forgotPassword(email) {
    const { data: message } = await axios.post(`/password/email`, {
        email: email,
    })
    console.log(message)
    return message
}
export async function checkCode(code) {
    const { data: validation } = await axios.post(`/password/code/check`, {
        code: code,
    })
    console.log(validation)
    return validation
}
export async function passwordReset(credentials) {
    const { data: validation } = await axios.post(
        `/password/reset`,
        credentials
    )
    console.log(validation)
    return validation
}

// VET
export async function forgotVetPassword(email) {
    const { data: message } = await axios.post(
        `/veterinarians/password/email`,
        {
            email: email,
        }
    )
    console.log(message)
    return message
}
export async function checkVetCode(code) {
    const { data: validation } = await axios.post(
        `/veterinarians/password/code/check`,
        {
            code: code,
        }
    )
    console.log(validation)
    return validation
}
export async function passwordVetReset(credentials) {
    const { data: validation } = await axios.post(
        `/veterinarians/password/reset`,
        credentials
    )
    console.log(validation)
    return validation
}
// export async function loadVetProfile(vet_id) {
//     const { data: vet_profile } = await axios.get(`/veterinarians/${vet_id}`)
//     return vet_profile
// }
