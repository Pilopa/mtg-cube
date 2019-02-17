const allSets = require('../input/AllSets');
const _ = require('lodash');

module.exports = {
    getCardSetInfo
};

function getCardSetInfo(cardName, setName) {
    const setCards = getSetCards(setName);
    if (setCards) {
        return _.find(setCards, card => card.name === cardName);
    } else {
        return undefined;
    }
}

function getAnyCardInfo(cardName) {
    for (const set of Object.values(allSets)) {
        for (const card of set.cards) {
            if (card.name === cardName) {
                return card;
            }
        }
    }
    return undefined;
}

function getSetCards(setName) {
    return (allSets[setName] || {}).cards;
}