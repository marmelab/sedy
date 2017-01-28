import http from 'http';
import httpServerHandler from './httpServerHandler';

const port = process.env.NODE_PORT || 3010;
http.createServer(httpServerHandler).listen(port);
