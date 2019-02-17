module.exports = {
    invertMap
}

function invertMap(obj) {
    const out = {};

    Object.keys(obj).forEach(key => {
        const value = obj[key];
        out[value] = key;
    });

    return out;
}