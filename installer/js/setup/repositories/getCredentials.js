
export default () => {
    const { accessToken, user } = window.localStorage;

    return { accessToken, user: user ? JSON.parse(user) : null };
};
