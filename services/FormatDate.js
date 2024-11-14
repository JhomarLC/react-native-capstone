import moment from 'moment'

export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
        'en-US',
        {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }
    )}`
}

export const formatUpcommingEventsDate = (date) => {
    return moment(date, 'YYYY-MM-DD HH:mm:ss').format(
        'MMMM D, YYYY [at] hh:mm A'
    )
}
