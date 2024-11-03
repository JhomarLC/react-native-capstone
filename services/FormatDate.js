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
