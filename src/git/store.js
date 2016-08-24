export default (initialState = {}) => {
    const store = { ...initialState };

    const copy = () => ({ ...store });

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
