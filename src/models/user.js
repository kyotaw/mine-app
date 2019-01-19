'use strict';

const hash = require('../helpers/hash')
    , hashEnv = require('../env').auth.hash
    , cryptEnv = require('../env').auth.crypt
    , {encrypt, decrypt} = require('../helpers/crypt');

class User {

    constructor(params) {
        params = params || {};
        this.id = params.id;
        this.userId = params.userId;
        this.socialUserId = params.socialUserId;
        this.password = params.password;
        this.email = params.email;
        this.name = params.name || params.userId || params.socialUserId || 'guest';
        this.salt = params.salt;
        this.hashVersion = params.hashVersion;
        this.cryptVersion = params.cryptVersion;
        this.loginSystem = params.loginSystem;
    }

    get plainEmail() {
        if (this.email) {
            return decrypt(
                this.email,
                cryptEnv.versions[this.cryptVersion].AUTH_CRYPT_KEY,
                cryptEnv.versions[this.cryptVersion].AUTH_CRYPT_ALGO);
        } else {
            return '';
        }
    }

    async setEmail(plainEmail) {
        const latestCryptEnv = cryptEnv.latestVersion;
        this.email = encrypt(
            plainEmail,
            latestCryptEnv.AUTH_CRYPT_KEY,
            latestCryptEnv.AUTH_CRYPT_ALGO);
        this.cryptVersion = latestCryptEnv.VERSION;
    }

    async setPassword(plainPass) {
        const latestHashEnv = hashEnv.latestVersion;
        this.salt = hash.randomBytes(latestHashEnv.SALT_LENGTH);
        this.password = await hash.pbkdf2(
            plainPass,
            this.salt,
            latestHashEnv.ITERATION,
            latestHashEnv.HASH_LENGTH,
            latestHashEnv.ALGO);
        this.hashVersion = latestHashEnv.VERSION;
    }

    async comparePassword(plainPass) {
        const hashedPass = await hash.pbkdf2(
            plainPass,
            this.salt,
            hashEnv.versions[this.hashVersion].ITERATION,
            hashEnv.versions[this.hashVersion].HASH_LENGTH,
            hashEnv.versions[this.hashVersion].ALGO);
        return this.password === hashedPass;
    }

    async _hashPassword(plainPass) {
        return await hash.pbkdf2(
            password,
            this.salt,
            hashEnv.versions[this.hashVersion].ITERATION,
            hashEnv.versions[this.hashVersion].HASH_LENGTH,
            hashEnv.versions[this.hashVersion].ALGO);
    }

    toDict() {
        return {
            userId: this.userId || this.socialUserId,
            email: this.email,
            name: this.name,
            loginSystem: this.loginSystem,
        }
    }
}

module.exports.User = User;
