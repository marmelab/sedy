import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

const buffer = fs.readFileSync(`${__dirname}/config/privateKeys/${env}.pem`);

module.exports = JSON.stringify(buffer.toString('utf-8'));
