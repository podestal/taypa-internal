const getTimeElapsed = (currentTime: Date, orderTime: Date) => {
    const orderDate = new Date(orderTime)
    const elapsed = Math.floor((currentTime.getTime() - orderDate.getTime()) / 1000) // seconds
    return elapsed
}

export default getTimeElapsed