const { outputJson } = require('fs-extra');
const { writeWithBrotli } = require('./write-brotli');

module.exports = {
    writeJson
}

async function writeJson(obj, fileNameFn, pathFn, pathParts) {
    for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'object' && !Array.isArray(val)) {
            await writeJson(val, fileNameFn, pathFn, [...pathParts, key]);
        } else {
            const fileName = `${pathFn(pathParts)}/${fileNameFn(key, val)}.json`;
            await writeWithBrotli(fileName, val);
        }
    }
}