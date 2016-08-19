export default (initialState = {}) => {
    const store = Object.assign({}, initialState);

    const copy = () => Object.assign({}, store);

    const get = sha => store[sha];

    const update = obj => {
        store[obj.sha] = obj;
    };

    return {
        get,
        update,
        copy,
    };
};
