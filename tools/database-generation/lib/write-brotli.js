const brotli = require('brotli');
const Fs = require('fs-extra');

module.exports = {
    writeWithBrotli
}

async function writeWithBrotli(path, data) {
    const jsonData = JSON.stringify(data);
    const brotliData = brotli.compress(Buffer.from(jsonData));
    
    return await Promise.all([
        Fs.outputJson(path, data),
        Fs.outputFile(`${path}.br`, brotliData)
    ]);
}