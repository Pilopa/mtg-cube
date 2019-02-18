const { get, setWith, uniq } = require('lodash');
const hash = require('object-hash');
const { logger } = require('./logger');

module.exports = {
    index,
    writeIndexVersions,
    getIndexBounds
}

function parseAsArray(val) {
    return Array.isArray(val) ? val : [parseVal(val)];
}

function parseVal(val) {
    if (val === undefined || val === null || val === '') return undefined;
    val = parseInt(val);
    return !isNaN(val) ? val : 0;
}

function getCardIndexValues(card, indexFn) {
    let val = indexFn(card);
    if (card.otherCard) {
        let otherVal = indexFn(card.otherCard);
        if (val !== undefined && val !== null && val !== '') {
            if (otherVal !== undefined && otherVal !== null && otherVal !== '') {
                return [...parseAsArray(val), ...parseAsArray(otherVal)];
            } else {
                return parseAsArray(val);
            }
        } else {
            return parseAsArray(otherVal);
        }
    } else {
        return parseAsArray(val);
    }
}

function writeIndexVersions(indexObject, indexVersions, path) {
    for (const [key, val] of Object.entries(indexObject)) {
        if (key === undefined || key === null || key === '') { continue; }
        const childPath = path ? `${path}.${key}` : key;
        if (typeof val === 'object' && !Array.isArray(val)) {
            writeIndexVersions(val, indexVersions, childPath);
        } else {
            setWith(indexVersions, childPath, hash(val), Object);
        }
    }
}

function index(card, indexObject, indexBounds, { superTypeMap, typeMap, subTypeMap }) {
    createSimpleIndex(card, indexObject, 'sets', card => Object.keys(card.sets));
    createSimpleIndex(card, indexObject, 'identity', card => mapColorIndexValues(card.identity));
    createSimpleIndex(card, indexObject, 'colors', getColorIndices);
    createSimpleIndex(card, indexObject, 'rarity', card => [card.rarity]);
    createSimpleIndex(card, indexObject, 'types', card => card.types.map(t => typeMap[t.toLowerCase()]));
    createSimpleIndex(card, indexObject, 'supertypes', card => card.supertypes.map(t => superTypeMap[t.toLowerCase()]));
    createSimpleIndex(card, indexObject, 'subtypes', card => card.subtypes.map(t => subTypeMap[t.toLowerCase()]));
    createSimpleIndex(card, indexObject, 'power', card => [card.power]);
    createSimpleIndex(card, indexObject, 'toughness', card => [card.toughness]);
    createSimpleIndex(card, indexObject, 'loyalty', card => [card.loyalty]);
    createSimpleIndex(card, indexObject, 'cmc', card => [card.cmc]);
}

/**
 * @returns {[number, number]} [min, max]
 */
function getIndexBounds(cards, indexFn) {
    let min, max;
    for (const card of cards) {
        const cardValues = getCardIndexValues(card, indexFn);
        if (cardValues === undefined || cardValues === null || cardValues === '') { continue; }
        let cardMin, cardMax;
        if (Array.isArray(cardValues)) {
            if (cardValues.length > 0) {
                if (card.layout === 'split') {
                    cardMin = Math.min(...cardValues);
                    cardMax = Math.max(...cardValues);
                } else {
                    cardMin = cardValues[0];
                    cardMax = cardValues[0];
                }
            }
        } else {
            cardMin = cardValues;
            cardMax = cardValues;
        }

        if (cardMin === undefined || cardMax === undefined) { continue; }
        if (min === undefined || min > cardMin) { min = cardMin; }
        if (max === undefined || max < cardMax) { max = cardMax; }
    }

    return [
        Math.max(0, min || 0),
        Math.max(0, max || 0)
    ];
}

function createSimpleIndex(card, indexObject, indexId, indexFn) {
    getCardIndexValues(card, indexFn).forEach(indexValue => {
        if (indexValue === undefined || indexValue === null || indexValue === '') { return; }
        const setIndexPath = `${indexId}.${indexValue}`;
        addToIndex(indexObject, setIndexPath, card.id);
    });
}

function addToIndex(indexObject, path, cardId) {
    const indexList = get(indexObject, path, []);
    if (indexList.indexOf(cardId) === -1) {
        indexList.push(cardId);
        setWith(indexObject, path, indexList, Object);
    } else {
        logger.trace(`Ignoring duplicate index on '${path}' for cardId: ${cardId}`);
    }
}

function mapColorIndexValues(colors) {
    if (Array.isArray(colors)) {
        colors = uniq(colors.filter(symbol => ['c', 'w', 'u', 'b', 'r', 'g'].includes(symbol)));
        if (colors.length > 1) {
            return [colors.sort().join('')];
        } else if (colors.length > 0) {
            return colors;
        } else {
            return ['c'];
        }
    } else {
        return ['c'];
    }
}

function getColorIndices(card) {
    return mapColorIndexValues(card.cost ? Object.keys(card.cost) : null);
}
