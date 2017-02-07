import http from 'http';
import request from 'request';
import { handler } from '../src';
import httpServerHandler from '../src/httpServerHandler';

export default params => (callback) => {
    const port = process.env.NODE_PORT || 3010;
    const baseUrl = `http://localhost:${port}`;
    const server = http.createServer(httpServerHandler(handler)).listen(port);

    const baseRequest = request.defaults({
        baseUrl,
        gzip: true,
        json: true,
    });

    baseRequest(params, (error, response) => {
        server.close();

        callback(error, response);
    });
};
