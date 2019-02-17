const hash = require('object-hash');

module.exports = {
    getCardNameId
}

function getCardNameId(cardName) {
    return cardName.trim().toLowerCase().replace(/[^a-zA-Z0-9-_.!*~'()]/g, '');
}