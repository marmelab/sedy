import config from 'config';
import { handler } from './';

export default (request, response) => {
    let body = '';

    request.on('error', (err) => {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(err));
    }).on('data', (chunk) => {
        body += chunk.toString('utf8');
    }).on('end', () => {
        const event = JSON.parse(body);
        handler({ body: event, headers: request.headers }, {}, (err, result) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(err));
                return;
            }

            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(result));
        }, config);
    });
};
