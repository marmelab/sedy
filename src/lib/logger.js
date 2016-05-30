export default config => ({
    info: console.log,
    debug: config.logs.debug ? console.log : () => null,
    error: console.error,
});
