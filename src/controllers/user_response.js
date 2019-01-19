'use strict';

function userResponse(user) {
    let params = {
        email: user.plainEmail,
        userId: user.userId,
    }
    return params;
}

module.exports = {
    userResponse: userResponse
}
