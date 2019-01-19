'use strict';

const UnauthUserEntity = require('./entities/unauth_user_entity').UnauthUserEntity
    , UnauthUser = require('./unauth_user').UnauthUser;

const unauthUserRepository = {

    async create(user) {
        await UnauthUserEntity.create(user);
        return user;
    },

    async delete(user) {
        await UnauthUserEntity.destroy({where: {id: user.id}});
    },

    async getByCertCode(certCode) {
        const entity = await UnauthUserEntity.find({where: {certCode: certCode}});
        return entity ? new UnauthUser(entity) : null;
    },

    async getByEmail(email) {
        const entity = await UnauthUserEntity.find({where: {email: email}});
        return entity ? new UnauthUser(entity) : null;
    },
}

module.exports = unauthUserRepository;
