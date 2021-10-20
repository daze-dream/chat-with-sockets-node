/**Returns an object with the text and timestamp */
const generateMessage = (text) => {
    return {
        text,
        timestamp: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}