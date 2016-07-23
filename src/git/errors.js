class ValidationError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'ValidationError';
        this.message = msg;
    }
}

export {
    ValidationError,
};
