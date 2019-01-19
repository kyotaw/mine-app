'use strict';

const mailer = require('nodemailer')
    , env = require('../env');

class CertificationMail {

    constructor(user) {
        this.to = user.plainEmail;
        this.from = env.cert.email.USER;
        this.subject = 'Comfirm your account on Kairai';
        this.body = this._makeBody(user.certCode);
    }

    _makeBody(certCode) {
        const link = `${env.HOME_URL}/certification?code=${certCode}`;
        return `Thank you for signing up with Kairai. To complete user registration, you must follow this link.
             
${link}
        
Kairai
${env.HOME_URL}`;
    }

}

module.exports.CertificationMail = CertificationMail;
