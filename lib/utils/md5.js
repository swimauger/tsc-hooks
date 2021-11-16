const crypto = require('crypto');
module.exports = (value) => crypto.createHash('md5').update(value).digest('hex');
