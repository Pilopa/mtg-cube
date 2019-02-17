const { validateMinifiedFormat } = require('./validation');

module.exports = {
    minifyCard
}

function minifyCard(card, {
    superTypeMap,
    typeMap,
    subTypeMap
}) {

    const result = {
        n: card.name, // NAME
        r: card.rarity > 0 ? card.rarity : undefined, // RARITY
        s: card.sets, // SETS
        st: mapArray(card.supertypes, t => superTypeMap[t.toLowerCase()]), // SUPERTYPES
        t: mapArray(card.types, t => typeMap[t.toLowerCase()]), // TYPES
        sb: mapArray(card.subtypes, t => subTypeMap[t.toLowerCase()]), // SUBTYPES
        p: card.power > 0 ? card.power : undefined, // POWER
        d: card.toughness > 0 ? card.toughness : undefined, // TOUGHNESS
        l: isNaN(parseInt(card.loyalty, 10)) || card.loyalty === 0 ? undefined : card.loyalty, // LOYALTY
        c: card.cost, // COST
        i: card.cmc > 0 ? card.cmc : undefined, // CMC
        o: card.otherCard ? minifyCard(card.otherCard, {
            superTypeMap, 
            typeMap,
            subTypeMap
        }) : undefined // OTHER CARD (split, transform, etc)
    };

    try {
        validateMinifiedFormat(result);
    } catch (error) {
        console.log(card);
        throw error;
    }

    return result;
}

function mapArray(arr, fn) {
    if (Array.isArray(arr) && arr.length > 0) {
        if (arr.length > 1) {
            return arr.map(fn);
        } else {
            return fn(arr[0]);
        }
    } else {
        return undefined;
    }
}