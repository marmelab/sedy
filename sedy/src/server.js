import http from 'http';
import httpServerHandler from './httpServerHandler';
import { handler } from './';
import githubAppPrivateKey from '../githubAppPrivateKey';

// Mock webpack DefinePlugin
global.GITHUB_APP_PRIVATE_KEY = JSON.parse(githubAppPrivateKey);

const port = process.env.NODE_PORT || 3000;
http.createServer(httpServerHandler(handler)).listen(port);

console.log(`Sedy server listening on port ${port}. Press CTRL+C to stop it.`);
