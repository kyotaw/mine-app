'use strict';

function removeNull(obj) {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
}

module.exports = {
    removeNull: removeNull
}
