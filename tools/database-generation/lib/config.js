const { join } = require('path');

module.exports = {
    CONFIG: {
        START_TIME_STAMP: Date.now(),
        PARALLEL_TRANSFORMATIONS: 100,
        SPLIT_CARD_SEPARATOR: ' // ',
        OUTPUT_MAPS_PATH: join(__dirname, '..','output', 'maps')
    }
};