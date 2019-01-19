'use strict';

const userRepository = require('../models/user_repository')
    , errors = require('../errors')
    , User = require('../models/user').User
    , unauthUserRepository = require('../models/unauth_user_repository')
    , timestamp = require('../helpers/time').timestamp
    , cryptEnv = require('../env').auth.crypt
    , hash = require('../helpers/hash')
    , encrypt = require('../helpers/crypt').encrypt;

const userService = {

    async createProprietaryUser(certCode) {
        const unauthUser = await unauthUserRepository.getByCertCode(certCode);
        if (!unauthUser) {
            throw new errors.KairaiError(errors.ErrorTypes.CERT_INVALID_CODE); 
        }
        await unauthUserRepository.delete(unauthUser);
        if (unauthUser.expiresIn < timestamp()) {
            throw new errors.KairaiError(errors.ErrorTypes.CERT_CODE_EXPIRED); 
        }
        const newUser = new User(unauthUser);
        return await userRepository.create(newUser);
    },

    async createSocialUser(params) {
        const user = await userRepository.getBySocialId(params.socialUserId, params.loginSystem);
        if (user) {
            throw new errors.KairaiError(errors.ErrorTypes.USER_ALREADY_EXISTS);
        }
        params.userId = hash.randomBytes(64);
        return await userRepository.create(params);
    },

    async getById(id) {
        return await userRepository.getById(id);
    },
    
    async getByUserId(userId) {
        return  await userRepository.getByUserId(userId);
    },

    async getBySocialId(socialUserId, loginSystem) {
        return await userRepository.getBySocialId(socialUserId, loginSystem);
    },

    async updatePassword(user, curPassword, newPassword) {
        const passMatch = await user.comparePassword(curPassword);
        if (!passMatch) {
            throw new errors.KairaiError(errors.ErrorTypes.PASSWORD_DONOT_MATCH);
        }
        await user.setPassword(newPassword);
        return await userRepository.update(user, ['password', 'salt', 'hashVersion']);
    },

    async delete(userId) {
        await userRepository.delete(userId);    
    },

}

module.exports = userService;
