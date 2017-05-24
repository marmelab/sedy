import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

module.exports = fs.readFileSync(`${__dirname}/config/privateKeys/${env}.pem`);
