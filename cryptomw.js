const crypto = require('crypto');

function generateSalt() {
    var buf = crypto.randomBytes(16);
    return buf.toString('base64');
}

function encodePassword(password, salt) {
    return crypto.createHmac('sha512', salt).update(password).digest('base64').toString();
}

module.exports = { generateSalt, encodePassword };
