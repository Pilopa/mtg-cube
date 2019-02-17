const { getSecondsSinceTimestamp } = require('./time-since-timestamp');
const { logger } = require('./logger');

module.exports = {
    timeFn,
    displayTimedAction
}

async function timeFn(fn) {
    const start = Date.now();
    await fn();
    return getSecondsSinceTimestamp(start);
}

async function displayTimedAction(formatter, fn) {
    const start = Date.now();
    const result = await fn();
    logger.info(formatter(getSecondsSinceTimestamp(start)));
    return result;
}