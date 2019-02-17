const _ = require('lodash');
const { getCardSetInfo } = require('./get-card-set-info');
const { validateOutputFormat, validateInputFormat } = require('./validation');
const { RARITY_MAP } = require('./rarity-map');
const { getCardNameId } = require('./get-card-name-id');
const hash = require('object-hash');

const validColors = ['R', 'U', 'B', 'W', 'G', 'C'];

module.exports = {
    transformCard
}

function transformCard(input) {

    let setCardInfos;

    try {

        // Validate input format
        validateInputFormat(input);

        // Get all instances of the card that exist in different sets
        // Used to determine the minimum printed rarity, etc.
        setCardInfos = _.map(input.printings, setName => ({
            name: setName,
            info: getCardSetInfo(input.name, setName)
        }))
        .filter(obj => !!obj.info)
        .reduce((r, s) => { r[s.name.toLowerCase()] = s.info; return r; }, {});

        // Perform transformation
        const transformedCard = {
            name: input.name,
            sets: _.mapValues(setCardInfos, val => val.multiverseId),
            rarity: Math.min(...Object.values(setCardInfos).map(card => RARITY_MAP[card.rarity])),
            text: Object.values(setCardInfos)[0].text,
            supertypes: input.supertypes,
            types: input.types,
            subtypes: input.subtypes,
            cmc: input.convertedManaCost,
            power: input.power,
            toughness: input.toughness,
            loyalty: input.loyalty,
            identity: input.colorIdentity.map(symbol => symbol.toLowerCase()),
            side: input.side,
            layout: input.layout.toLowerCase(),
            other: _.find(input.names, name => name !== input.name),
            cost: input.manaCost ? getManaCostSymbols(input.manaCost).reduce((result, symbol) => {
                symbol = symbol.substring(1, symbol.length - 1);
                if (!isNaN(parseInt(symbol))) {
                    result['a'] = (result['a'] || 0) + parseInt(symbol);
                } else {
                    validColors.forEach(colorCode => {
                        if (symbol.includes(colorCode)) result[colorCode.toLowerCase()] = (result[colorCode.toLowerCase()] || 0) + 1;
                    });
                }
                return result;
            }, {}) : undefined
        }; 

        transformedCard.hash = hash(transformedCard);
        transformedCard.id = getCardNameId(input.name);

        // Validate output format
        validateOutputFormat(transformedCard);
    
        return transformedCard;

    } catch (error) {
        console.log(setCardInfos);
        throw error;
    }
}

function getManaCostSymbols(str) {
    return str.match(/\{.*?\}/g);
}