import fs from 'fs';

module.exports = fs.readFileSync(`${__dirname}/config/private-key.pem`);
