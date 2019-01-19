'use strict';

const crypto = require('crypto')
    , hashEnv = require('../env').auth.hash

function sha256(data) {
    const algo = crypto.createHash('sha256');
    for (let d of data) {
        algo.update(d);
    }
    return algo.digest('hex');
}

function pbkdf2(password, salt, iterations, keylen, algo, cb) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, iterations, keylen, algo, (err, key) => {
            if (err) {
                reject(err);
            } else {
                let s = key.toString('hex');
                resolve(key.toString('hex'));
            }
        });
    });
}

function randomBytes(bytes) {
    return crypto.randomBytes(bytes).toString('hex');
}

async function pbkdf2LatestVersion(plainText) {
    const latestHashEnv = hashEnv.latestVersion;
    const salt = randomBytes(latestHashEnv.SALT_LENGTH);
    const hash = await pbkdf2(
        plainText,
        salt,
        latestHashEnv.ITERATION,
        latestHashEnv.HASH_LENGTH,
        latestHashEnv.ALGO);
   return hash; 
}

module.exports = {
    sha256: sha256,
    pbkdf2: pbkdf2,
    randomBytes: randomBytes,
    pbkdf2LatestVersion: pbkdf2LatestVersion
}
