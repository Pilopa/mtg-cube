const { createLogger, stdSerializers } = require('bunyan');

const logger = createLogger({
    name: 'mtg-cube-cards',
    level: 'info',
    serializers: stdSerializers
});

module.exports = {
    logger
}
