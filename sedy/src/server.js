import http from 'http';
import httpServerHandler from './httpServerHandler';
import { handler } from './';

const port = process.env.NODE_PORT || 3000;
http.createServer(httpServerHandler(handler)).listen(port);

console.log(`Sedy server listening on port ${port}. Press CTRL+C to stop it.`);
