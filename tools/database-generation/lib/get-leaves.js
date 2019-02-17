

module.exports = {
    getLeaves
}

function getLeaves(obj, out = []) {
    for (const val of Object.values(obj)) {
        if (typeof val === 'object' && !Array.isArray(val)) {
            getLeaves(val, out);
        } else {
            out.push(val);
        }
    }

    return out;
}