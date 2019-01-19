'use strict';


// Yコンビネーター
var Y = function(func) {
    return ((next) => {
        return next(next);
    })((next) => {
        return func(function(value) {
            return next(next).apply(this, arguments);
        });
    });
}


module.exports = {
    Y: Y
}
