class GitError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'ValidationError';
        this.message = msg;
    }
}

class ValidationError extends GitError {
    constructor(msg) {
        super(msg);
        this.name = 'ValidationError';
        this.message = msg;
    }
}

class CommandError extends GitError {
    constructor(msg) {
        super(msg);
        this.name = 'CommandError';
        this.message = msg;
    }
}

export {
    ValidationError,
    CommandError,
};
