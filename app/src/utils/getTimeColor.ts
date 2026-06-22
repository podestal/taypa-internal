const getTimeColor = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 5) return 'text-green-600 bg-green-100'
    if (minutes < 10) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
}

export default getTimeColor