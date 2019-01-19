'use strict';

const User = require('./user').User
    , timestamp = require('../helpers/time').timestamp
    , emailService = require('../services/email_service')
    , CertificationMail = require('./certification_email').CertificationMail
    , hash = require('../helpers/hash').pbkdf2LatestVersion
    , env = require('../env');

class UnauthUser extends User {

    constructor(params) {
        super(params);
        this.certCode = params.certCode || null;
        this.expiresIn = params.expiresIn || timestamp();
    }

    async setEmail(plainEmail) {
        await super.setEmail(plainEmail);
        this.certCode = await hash(this.plainEmail);
        this.expiresIn = timestamp() + env.cert.EXPIRES_IN;
    }

    async sendCertifiationEmail() {
        let email = new CertificationMail(this);
        return await emailService.send(email);
    }
}

module.exports.UnauthUser = UnauthUser;
