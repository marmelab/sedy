const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export default (base) =>
    [REQUEST, SUCCESS, FAILURE].reduce((requestTypes, type) => {
        requestTypes[type] = `${base}_${type}`; // eslint-disable-line no-param-reassign
        return requestTypes;
    }, {});
