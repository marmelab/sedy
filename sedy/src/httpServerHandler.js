import config from 'config';

export default (handler) => (request, response) => {
    let body = '';

    request.on('error', (err) => {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(err));
    }).on('data', (chunk) => {
        body += chunk.toString('utf8');
    }).on('end', () => {
        if (!body) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Bad Request', message: 'empty request' }));
            return;
        };

        let event;
        try {
            event = JSON.parse(body);
        } catch (e) {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Bad Request', message: 'unable to parse JSON' }));
            return;
        }

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
