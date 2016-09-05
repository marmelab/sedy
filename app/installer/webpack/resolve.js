import path from 'path';

export default function () {
    return {
        root: path.resolve(`${__dirname}/..`),
        alias: {
            isomorphic: 'src/isomorphic',
        },
    };
}
