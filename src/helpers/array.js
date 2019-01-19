'use strict';

module.exports = {
    extend: function(array, newSize, padValue) {
        if (array.push == undefined) {
            return;
        }
        var diff = newSize - array.length;
        if (diff > 0) {
            for (var i = 0; i < diff; ++i) {
                array.push(padValue);
            }
        }
    },

    index: function(array, value) {
        var size = array.length;
        for (var i = 0; i < size; ++i) {
            if (typeof value === 'function') {
                if (value(array[i])) {
                    return i;
                }
            } else {
                if (value === array[i]) {
                    return i;
                }
            }
        }
        return -1;
    },

    equal: function(array1, array2) {
        return Array.isArray(array1) &&
               Array.isArray(array2) &&
               array1.toString() === array2.toString();
    },

    contain: function(array1, array2) {
        return array2.every(item => {
            return this.index(array1, item) !== -1;
        });
    },

    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}
