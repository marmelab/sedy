import fs from 'fs';

const env = process.env.NODE_ENV || 'development';

let buffer = null;
try {
    buffer = fs.readFileSync(`${__dirname}/config/privateKeys/${env}.pem`);
} catch (e) {
    console.warn('Unable to read the private key');
    console.warn(e.message);
}

module.exports = JSON.stringify((buffer || '').toString('utf-8'));
