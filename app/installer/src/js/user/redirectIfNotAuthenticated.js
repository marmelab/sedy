export default store => (nextState, replace) => {
    const { user: { authenticated } } = store.getState();

    if (!authenticated) {
        const query = nextState.location.search ? nextState.location.search : '';

        replace({
            pathname: '/sign-in',
            state: {
                nextPath: nextState.location.pathname + query,
            },
        });
    }
};
