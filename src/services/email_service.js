'use strict';

const nodemailer = require('nodemailer')
    , env = require('../env')
    , errors = require('../errors');

const emailService = {

    async send(email) {
        const config = {
            host: env.cert.email.HOST,
            port: env.cert.email.PORT,
            secure: true,
            auth: {
                user: env.cert.email.USER,
                pass: env.cert.email.PASSWORD,
            }
        };
        const transport = nodemailer.createTransport(config);
        const message = {
            from: email.from,
            to: email.to,
            subject: email.subject,
            text: email.body
        };
        
        return new Promise((resolve, reject) => {
            transport.sendMail(message, (err, info) => {
                if (err) {
                    reject(new errors.KairaiError(errors.ErrorTypes.FAILED_SEND_EMAIL));
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = emailService;
