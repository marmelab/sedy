import http from 'http';
import httpServerHandler from '../../sedy/src/httpServerHandler';
import { handler } from './';

const port = process.env.NODE_PORT || 3010;
http.createServer(httpServerHandler(handler)).listen(port);

console.log(`Sedy Oauth server listening on port ${port}. Press CTRL+C to stop it.`);
