// Imports
const { map, flatten, chunk, uniqWith, isEqual } = require('lodash');
const { transformCard } = require('./lib/transform-card');
const { minifyCard } = require('./lib/minify-card');
const { INPUT_SCHEMA_VERSION, MINIFIED_SCHEMA_VERSION, OUTPUT_SCHEMA_VERSION } = require('./lib/validation');
const { getSecondsSinceTimestamp } = require('./lib/time-since-timestamp');
const { byteCount } = require('./lib/byte-count');
const { createMaps } = require('./lib/create-maps');
const { outputJson, remove, readJSON } = require('fs-extra');
const { index, writeIndexVersions, getIndexBounds } = require('./lib/create-indices');
const { displayTimedAction } = require('./lib/time-action');
const { mergeCards } = require('./lib/merge-cards');
const { logger } = require('./lib/logger');
const { getLeaves } = require('./lib/get-leaves');
const { CONFIG } = require('./lib/config');
const Path = require('path');
const elasticlunr = require('elasticlunr');
const hash = require('object-hash');

// Define Execution
async function run() {

    // Print schema versions
    logger.info(`Input Schema Version: ${INPUT_SCHEMA_VERSION}`);
    logger.info(`Output Schema Version: ${OUTPUT_SCHEMA_VERSION}`);
    logger.info(`Minified Schema Version: ${MINIFIED_SCHEMA_VERSION}`);

    // Clean output
    logger.info(`=== Clearing output directory ===`);
    const clearOuputStart = Date.now();
    await remove('./output');
    logger.info(`Cleared output in ${getSecondsSinceTimestamp(clearOuputStart)}s`);

    // Create Maps
    logger.info(`=== Creating Maps ===`);
    const createMapsStart = Date.now();
    await createMaps(CONFIG.OUTPUT_MAPS_PATH);
    logger.info(`Created maps in ${getSecondsSinceTimestamp(createMapsStart)}s`);

    // Read relevant map output
    const [ superTypeMap, typeMap, subTypeMap ] = await Promise.all([
        readJSON(Path.join(CONFIG.OUTPUT_MAPS_PATH, 'superTypeMap.json')),
        readJSON(Path.join(CONFIG.OUTPUT_MAPS_PATH, 'typeMap.json')),
        readJSON(Path.join(CONFIG.OUTPUT_MAPS_PATH, 'subTypeMap.json'))
    ]);

    // Read Input
    logger.info(`=== Loading Card Input ===`);
    const input = require('./input/AllCards');

    // Transform Input into card list
    logger.info(`=== Filtering Input ===`);
    // # Exclude unwanted cards here
    const inputCardList = Object.values(input)
        .filter(card => !(
            card.types.some(t => ['scheme', 'hero', 'plane', 'vanguard', 'phenomenon', 'emblem'].includes(t.toLowerCase())) ||
            card.supertypes.some(t => ['basic'].includes(t.toLowerCase())) ||
            ['token'].includes(card.layout.toLowerCase())
        ));

    // Transform cards into custom format
    logger.info(`=== Transform ===`);

    const transformStart = Date.now();
    const transformPromises = chunk(inputCardList, CONFIG.PARALLEL_TRANSFORMATIONS)
                                .map(async chunk => chunk.map(card => transformCard(card)));
    const transformedCardList = flatten(await Promise.all(transformPromises));
    logger.info(`${transformedCardList.length} cards transformed in ${getSecondsSinceTimestamp(transformStart)}s`);

    logger.info(`=== Merge ===`);
    const mergedCardList = mergeCards(transformedCardList);
    logger.info(`Merged cards down to ${mergedCardList.length}`);

    // Create & store indexing information
    logger.info(`=== Indexing ===`);
    const indexVersions = {};
    const indexObject = {};

    logger.info(`> Determine Numeric Index Bounds`);
    const indexBoundsStart = Date.now();
    const indexBounds = {
        'cmc': getIndexBounds(mergedCardList, card => card.cmc),
        'loyalty': getIndexBounds(mergedCardList, card => card.loyalty),
        'power': getIndexBounds(mergedCardList, card => card.power),
        'toughness': getIndexBounds(mergedCardList, card => card.toughness)
    };
    logger.info(`Numeric index bounds determined in ${getSecondsSinceTimestamp(indexBoundsStart)}s`);
    logger.debug(indexBounds);

    logger.info(`> Create Base Indices`);
    await displayTimedAction(time => `Created base indices in ${time}s (${byteCount(JSON.stringify(indexObject)) / 1024 / 1024} MB)`, async () => {
        await Promise.all(mergedCardList.map(async card => index(card, indexObject, indexBounds, {
            superTypeMap,
            typeMap,
            subTypeMap
        })));
        writeIndexVersions(indexObject, indexVersions);
    });
    logger.info(`> Write Base Indices`);
    const cardIndexLists = uniqWith(getLeaves(indexObject).map(cardList => cardList.sort()), isEqual);
    await displayTimedAction(time => `Wrote base indices to disk in ${time}s (${byteCount(JSON.stringify(cardIndexLists)) / 1024 / 1024} MB)`, async () => {
        await Promise.all(cardIndexLists.map(list => outputJson(`./output/indices/data/${hash(list)}.json`, list)));
    });

    logger.info(`> Create Search Indices`);

    // -- Index.text / Index.name / Index.combined
    const elasticIndexText = elasticlunr(function () {
        this.addField('text');
        this.addField('otherCard.text');
        this.setRef('id');
        this.saveDocument(false);
    });

    const elasticIndexName = elasticlunr(function () {
      this.addField('name');
      this.addField('otherCard.name');
      this.setRef('id');
      this.saveDocument(false);
    });

    const elasticIndexCombined = elasticlunr(function () {
      this.addField('name');
      this.addField('otherCard.text');
      this.addField('text');
      this.addField('otherCard.name');
      this.setRef('id');
      this.saveDocument(false);
    });

    logger.info(`> Load Search Indices`);

    await Promise.all(mergedCardList.map(async card => {
        elasticIndexText.addDoc(card);
        elasticIndexName.addDoc(card);
        elasticIndexCombined.addDoc(card);
    }));

    logger.info(`> Save Search Indices`);

    const saveLunrIndex = async (index, indexId) => {
        const elasticJSON = JSON.stringify(index);
        const elasticHash = hash(index);
        indexVersions[indexId] = elasticHash;
        logger.info(`Elasticlunr ${indexId} Index: ${byteCount(elasticJSON) / 1024 / 1024} MB`);
        await outputJson(`./output/indices/${indexId}-${elasticHash}.json`, index);
    };

    await Promise.all([
        saveLunrIndex(elasticIndexText, 'text'),
        saveLunrIndex(elasticIndexName, 'name'),
        saveLunrIndex(elasticIndexCombined, 'combined')
    ]);

    logger.info(`> Save Index Version Map`);

    // Save index versions
    const indexVersionsHash = hash(indexVersions);
    outputJson(`./output/indices/versions-${indexVersionsHash}.json`, indexVersions);

    // Minify & store individual card information
    logger.info(`=== Minify ===`);

    const minifyStart = Date.now();
    const minifiedCardList = mergedCardList.reduce((r, card) => { r[card.hash] = minifyCard(card, {
        superTypeMap,
        typeMap,
        subTypeMap
    }); return r; } , {});
    const cardVersions = mergedCardList.reduce((r, card) => { r[card.id] = card.hash; return r; }, {});
    const cardVersionsHash = hash(cardVersions);
    logger.info(`${Object.keys(minifiedCardList).length} cards minified in ${getSecondsSinceTimestamp(minifyStart)}s (${byteCount(JSON.stringify(minifiedCardList)) / 1024 / 1024} MB)`);

    logger.info(`=== Writing Output ===`);
    await Promise.all([
        outputJson(`./output/cards/versions-${cardVersionsHash}.json`, cardVersions),
        outputJson('./output/versions.json', {
            cards: cardVersionsHash,
            indices: indexVersionsHash
        }),
        ...map(minifiedCardList, (card, hash) => outputJson(`./output/cards/singles/${hash}.json`, card))
    ]);
}

// Perform Execution
run()
.then(_ => logger.info(`DONE in ${getSecondsSinceTimestamp(CONFIG.START_TIME_STAMP)}s`))
.catch(error => console.error(error));
