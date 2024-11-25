import axios from '../utils/axios'
import { setToken } from './TokenService'

export async function addNotificationToken(token) {
    try {
        const { data: notification_token } = await axios.post(
            '/notification-tokens',
            token
        )
        return notification_token
    } catch (error) {
        console.error('Error adding notification token:', error)
        throw error
    }
}
export async function addVetNotificationToken(token) {
    try {
        const { data: notification_token } = await axios.post(
            '/vet-notification-tokens',
            token
        )
        return notification_token
    } catch (error) {
        console.error('Error adding notification token:', error)
        throw error
    }
}
export async function loadNotifications() {
    const { data: history } = await axios.get(`/notification-history`)
    return history
}
