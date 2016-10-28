import http from 'http';
import request from 'request';
import { handler } from '../';

export default function myRequest(params, authToken = null, cookies = {}) {
    return (callback) => {
        const port = process.env.NODE_PORT || 3010;
        const baseUrl = `http://localhost:${port}`;
        const server = http.createServer((request, response) => {
            const body = [];

            request.on('error', (err) => {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(err));
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                const event = JSON.parse(Buffer.concat(body).toString());
                handler(event, {}, (err, result) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify(err));
                        return;
                    }

                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(result));
                });
            });
        }).listen(port);

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
