'use strict';

function loginResponse(user, accessToken) {
    let data = {
        user: {
            userId: user.userId,
            email: user.plainEmail,
        },
        accessToken: accessToken.token
    };
    return data;
}

function loggedInResponse(loggedIn) {
    return {
        loggedIn: loggedIn
    }
}

module.exports = {
    loginResponse: loginResponse,
    loggedInResponse: loggedInResponse,
}
