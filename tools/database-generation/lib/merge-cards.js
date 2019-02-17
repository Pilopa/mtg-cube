const { cloneDeep } = require('lodash');
const { getCardNameId } = require('./get-card-name-id');
const { CONFIG } = require('./config');
const { logger } = require('./logger');
const hash = require('object-hash');

module.exports = {
    mergeCards
}

function mergeCards(cards) {
    return cards.reduce((mergedCards, card) => {
        if (card.side) {
            if (card.side === 'a') {
                card.otherCard = cloneDeep(cards.find(c => c.side !== 'a' && c.name.toLowerCase() === card.other.toLowerCase()));

                if (!card.otherCard) {
                    logger.warn(card, `Could not find other half of this card`);
                    return mergedCards;
                }

                delete card.otherCard.rarity;

                if (card.layout === 'split') {
                    card.name = `${card.name}${CONFIG.SPLIT_CARD_SEPARATOR}${card.otherCard.name}`;

                    delete card.otherCard.name;
                    delete card.otherCard.id;
                    delete card.otherCard.hash;
                    delete card.hash;
                    delete card.id;

                    card.id = getCardNameId(card.name);
                }

                card.hash = hash(card);
                return [...mergedCards, card];
            } else {
                return mergedCards;
            }
        } else {
            return [...mergedCards, card];
        }
    }, []);
}
