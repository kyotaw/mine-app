'use strict';


(function(Env) {
    
    let settings = {};
    try {
	    settings = require('../settings');
    } catch (e) {
        console.log('Lot Settings.js failed');
    }

    Env.HOME_URL = 'http://localhost:4200';

    Env.SRC_ROOT_DIR = __dirname;

	Env.DB_HOST = process.env.DB_HOST || settings.DB_HOST || 'localhost';
    Env.DB_NAME = process.env.DB_NAME || settings.DB_NAME || 'kairaidb';
    Env.DB_USER_NAME = process.env.DB_USER_NAME || settings.DB_USER_NAME || 'postgres2';
    Env.DB_PASSWORD = process.env.DB_PASSWORD || settings.DB_PASSWORD || '';
    Env.DATABASE_URL = process.env.DATABASE_URL || settings.DATABASE_URL || '';

    Env.APISERVER_HOST = process.env.APISERVER_HOST || settings.APISERVER_HOST || 'localhost';
    Env.APISERVER_PORT = process.env.PORT || settings.APISERVER_PORT || '6171';
    Env.APISERVER_URL = process.env.APISERVER_URL || settings.APISERVER_URL || Env.APISERVER_HOST + ':' + Env.APISERVER_PORT;

    Env.server = {
        root: process.env.SERVER_ROOT || settings.SERVER_ROOT || 'http://localhost/',
    }

    Env.auth = {
        hash: {
            versions: [
                {
                    HASH_LENGTH: process.env.AUTH_HASH_LENGTH_V0 || settings.AUTH_HASH_LENGTH_V0 || null,
                    SALT_LENGTH: process.env.AUTH_HASH_SALT_LENGTH_V0 || settings.AUTH_HASH_SALT_LENGTH_V0 || null,
                    ITERATION: process.env.AUTH_HASH_ITERATION_V0 || settings.AUTH_HASH_ITERATION_V0 || null,
                    ALGO: process.env.AUTH_HASH_ALGO_V0 || settings.AUTH_HASH_ALGO_V0 || null,
                    VERSION: 0
                }
            ],
            get latestVersion() {
                return Env.auth.hash.versions[Env.auth.hash.versions.length - 1];
            } 
        },
        crypt: {
            versions: [
                {
                    AUTH_CRYPT_KEY: process.env.AUTH_CRYPT_KEY_V0 || settings.AUTH_CRYPT_KEY_V0 || null,
                    AUTH_CRYPT_ALGO: process.env.AUTH_CRYPT_ALGO_V0 || settings.AUTH_CRYPT_ALGO_V0 || null,
                    AUTH_CRYPT_IV: process.env.AUTH_CRYPT_IV_V0 || settings.AUTH_CRYPT_IV_V0 || null,
                    VERSION: 0 
                } 
            ],
            get latestVersion() {
                return Env.auth.crypt.versions[Env.auth.crypt.versions.length - 1];
            } 
        },
        accessToken: {
            JWT_KEY: process.env.AUTH_JWT_PUBLIC_KEY || settings.AUTH_JWT_PUBLIC_KEY || null,
            JWT_SECRET: process.env.AUTH_JWT_SECRET_KEY || settings.AUTH_JWT_SECRET_KEY || null,
            JWT_ISSURE: process.env.AUTH_JWT_ISSURE || settings.AUTH_JWT_ISSURE || null,
            JWT_AUDIENCE: process.env.AUTH_JWT_AUDIENCE || settings.AUTH_JWT_AUDIENCE || null,
            JWT_EXPIRES_IN: process.env.AUTH_JWT_EXPIRES_IN || settings.AUTH_JWT_EXPIRES_IN || '5 hour',
        },
        google: {
            CLIENT_ID: process.env.GOOGLE_AUTH_CLIENT_ID || settings.GOOGLE_AUTH_CLIENT_ID || '',
            CLIENT_SECRET: process.env.GOOGLE_AUTH_CLIENT_SECRET || settings.GOOGLE_AUTH_CLIENT_SECRET || '',
            CALLBACK_URL: process.env.GOOGLE_AUTH_CALLBACK_URL || settings.GOOGLE_AUTH_CALLBACK_URL || '',
            CALLBACK_PATH: process.env.GOOGLE_AUTH_CALLBACK_PATH || settings.GOOGLE_AUTH_CALLBACK_PATH || '',
        }
    },

    Env.cert = {
        EXPIRES_IN: process.env.CERT_EXPIRES_IN || settings.CERT_EXPIRES_IN || 1200000,
        email: {
            HOST: process.env.CERT_EMAIL_HOST || settings.CERT_EMAIL_HOST || null,
            PORT: process.env.CERT_EMAIL_PORT || settings.CERT_EMAIL_PORT || null,
            USER: process.env.CERT_EMAIL_USER || settings.CERT_EMAIL_USER || null,
            PASSWORD: process.env.CERT_EMAIL_PASSWORD || settings.CERT_EMAIL_PASSWORD || null,
        }
    },

    Env.channel = {
        maxFps: process.env.CHANNEL_MAX_FPS || settings.CHANNEL_MAX_FPS || 500
    }

}(exports));
