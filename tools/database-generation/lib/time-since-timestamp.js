module.exports = {
    getSecondsSinceTimestamp
}

function getSecondsSinceTimestamp(timestamp) {
    return Math.floor((Date.now() - timestamp) / 1000);
}