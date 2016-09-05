import http from 'http';
import request from 'request';
import app from '../../src/api/server';

export default function myRequest(params, authToken = null, cookies = {}) {
    return (callback) => {
        const port = process.env.NODE_PORT || 3010;
        const portOrigin = process.env.NODE_PORT_ORIGIN || 8081;
        const baseUrl = `http://localhost:${port}`;
        const server = http.createServer(app.callback()).listen(port);
        const jar = request.jar();
        const headers = { origin: `http://localhost:${portOrigin}` };

        if (cookies) {
            Object.keys(cookies).forEach(key => {
                const cookie = request.cookie(`${key}=${cookies[key]}`);
                jar.setCookie(cookie, baseUrl);
            });
        }

        const baseRequest = request.defaults({
            baseUrl,
            gzip: true,
            json: true,
            headers: Object.assign({}, headers, authToken ? { authorization: `${authToken}` } : {}),
            jar,
        });

        baseRequest(params, (error, response) => {
            server.close();

            callback(error, response);
        });
    };
}
