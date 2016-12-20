import http from 'http';
import request from 'request';
import { httpServerHandler } from '../src/server';

export default function myRequest(params, authToken = null, cookies = {}) {
    return (callback) => {
        const port = process.env.NODE_PORT || 3010;
        const baseUrl = `http://localhost:${port}`;
        const server = http.createServer(httpServerHandler).listen(port);

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
}
