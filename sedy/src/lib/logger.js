/* eslint-disable no-console */

export default config => ({
    debug: config.logs.debug ? console.log : () => null,
    info: console.log,
    warn: console.warn,
    error: console.error,
});
