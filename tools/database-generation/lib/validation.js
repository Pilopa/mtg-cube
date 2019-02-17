// Imports
const Joi = require('joi');

// Consts

const INPUT_SCHEMA_VERSION = '4.2.1';
const INPUT_SCHEMA = Joi.object().keys({
    "name": Joi.string().min(1),
    "printings": Joi.array().items(Joi.string().min(1).max(5)),
    "supertypes": Joi.array().items(Joi.string()),
    "types": Joi.array().items(Joi.string()),
    "subtypes": Joi.array().items(Joi.string()),
    "power": Joi.string(),
    "toughness": Joi.string(),
    "convertedManaCost": Joi.number(),
    "loyalty": Joi.alternatives(Joi.number(), Joi.string()),
    "manaCost": Joi.string(),
    "colorIdentity": Joi.array().items(Joi.string()),
    "side": Joi.string().valid('a', 'b', 'c'),
    "names": Joi.array().items(Joi.string()),
    "layout": Joi.string()
})
.requiredKeys('name', 'printings', 'supertypes', 'types', 'subtypes', "colorIdentity", "layout")
.options({
    stripUnknown: true
});

const OUTPUT_SCHEMA_VERSION = '0.0.1';
const OUTPUT_SCHEMA = Joi.object().keys({
    "name": Joi.string().min(1),
    "rarity": Joi.number().min(0).max(3),
    "sets": Joi.object().pattern(Joi.string().min(1).max(5).lowercase(), Joi.number()),
    "text": Joi.string().min(1),
    "supertypes": Joi.array().items(Joi.string()),
    "types": Joi.array().items(Joi.string()),
    "subtypes": Joi.array().items(Joi.string()),
    "power": Joi.string(),
    "toughness": Joi.string(),
    "cmc": Joi.number(),
    "loyalty": Joi.alternatives(Joi.number(), Joi.string()),
    "identity": Joi.array().items(Joi.string().valid('w', 'u', 'b', 'r', 'g', 'c')),
    "cost": Joi.object().pattern(Joi.string().valid('a', 'w', 'u', 'b', 'r', 'g', 'c'), Joi.number()),
    "hash": Joi.string(),
    "id": Joi.string(),
    "other": Joi.string(),
    "side": Joi.string().valid('a', 'b', 'c'),
    "layout": Joi.string()
}).requiredKeys('name', 'rarity', 'sets', 'supertypes', 'types', 'subtypes', 'cmc', 'hash', 'id', 'identity', 'layout');

const MINIFIED_SCHEMA_VERSION = '0.0.1';
const MINIFIED_SCHEMA = Joi.object().keys({
    "n": Joi.string(), // Name
    "r": Joi.number().min(1).max(3), // Rarity, undefined = common
    "s": Joi.object().pattern(Joi.string().min(1).max(5).lowercase(), Joi.number()), // Sets, undefined = none
    "st": Joi.alternatives(Joi.number(), Joi.array()), // Supertypes, undefined = none
    "t": Joi.alternatives(Joi.number(), Joi.array()), // Types, undefined = none
    "sb": Joi.alternatives(Joi.number(), Joi.array()), // Subtypes, undefined = none
    "p": Joi.string(), // Power, undefined = 0
    "d": Joi.string(), // Toughness, undefined = 0
    "l": Joi.number(), // Loyalty, undefined = 0
    "c": Joi.object().pattern(Joi.string().valid('a', 'w', 'u', 'b', 'r', 'g', 'c'), Joi.number()), // Cost, undefined = none
    "i": Joi.number(), // CMC, undefined = 0
    "o": Joi.object(), // Other side, for 
});

// Exports

module.exports = {
    validateInputFormat,
    validateMinifiedFormat,
    validateOutputFormat,
    OUTPUT_SCHEMA_VERSION,
    MINIFIED_SCHEMA_VERSION,
    INPUT_SCHEMA_VERSION
}

// Implementation

function validateFormat(card, format) {
    const error = Joi.validate(card, format).error;
    if (error) {
        throw error;
    } else {
        return true;
    }
}

function validateInputFormat(cardInput) {
    return validateFormat(cardInput, INPUT_SCHEMA);
}

function validateOutputFormat(cardOutput) {
    return validateFormat(cardOutput, OUTPUT_SCHEMA);
}

function validateMinifiedFormat(minifiedCard) {
    return validateFormat(minifiedCard, MINIFIED_SCHEMA);

}