const { RARITY_MAP } = require('./rarity-map');
const allSets = require('../input/AllSets');
const allCards = require('../input/AllCards');
const _ = require('lodash');
const Path = require('path');
const { outputJson } = require('fs-extra');
const { SUPERTYPE_MAP, TYPE_MAP } = require('./type-maps');

module.exports = {
    createMaps
}

function createMaps(path) {
    // SETs
    let setId = 0;
    const SET_CODE_MAP = {}, SET_NAME_MAP = {};
    const sortedSets = _.sortBy(allSets, 'releaseDate');
    sortedSets.forEach(setData => {
        SET_CODE_MAP[setData.code.toLowerCase()] = setId;
        SET_NAME_MAP[setId] = setData.name.toLowerCase();
        setId++;
    });

    let typeId = 0;
    const SUB_TYPE_MAP = _.uniq(_.flatten(Object.values(allCards)
    .map(card => card.subtypes)))
    .reduce((r,t) => {
        r[t.toLowerCase()] = typeId++;
        return r;
    }, {});

    // Write maps
    return Promise.all([
        outputJson(Path.join(path, 'setCodeMap.json'), SET_CODE_MAP),
        outputJson(Path.join(path, 'setNameMap.json'), SET_NAME_MAP),
        outputJson(Path.join(path, 'rarityMap.json'), RARITY_MAP),
        outputJson(Path.join(path, 'typeMap.json'), TYPE_MAP),
        outputJson(Path.join(path, 'superTypeMap.json'), SUPERTYPE_MAP),
        outputJson(Path.join(path, 'subTypeMap.json'), SUB_TYPE_MAP)
    ]);

}
