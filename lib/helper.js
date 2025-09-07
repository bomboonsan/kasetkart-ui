export const formatDate = (dateString) => {
    if (!dateString) return ''
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', options)
}

export const formatDateDMY = (dateString) => {
    if (!dateString) return ''
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', options)
}