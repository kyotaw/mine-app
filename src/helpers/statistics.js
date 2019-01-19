'use strict';

const array = require('./array');

function average(values) {
    const len = values.length;
    if (len === 0) {
        return 0;
    }
    if (array.isArray(values[0])) {
        const sum = values.reduce((prev, cur) => {
            for (let i = 0; i < prev.length; ++i) {
                cur[i] += prev[i];
            }
            return cur; 
        }); 
        return sum.map(s => { return s / len; });
    } else {
        return values.reduce((prev, cur) => { return prev + cur; }) / len;
    }
}

module.exports = {
    average: average
}
