'use strict';

const crypto = require('crypto')
    , hashEnv = require('../env').auth.hash;

function encrypt(text, key, algo) {
    let cipher = crypto.createCipher(algo, key);
    let crypted = cipher.update(text, 'utf8', 'hex');
    return crypted + cipher.final('hex');
}

function decrypt(encryptedText, key, algo) {
    let decipher = crypto.createDecipher(algo, key);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    return decrypted + decipher.final('utf8');
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}
