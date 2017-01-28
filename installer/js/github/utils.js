const getWindowSearchParams = () => {
    const params = {};
    const search = window.location.search;

    if (!search) {
        return params;
    }

    const rawParams = search.startsWith('?') ? search.substring(1) : search;

    for (const rawParam of rawParams.split('&')) {
        const [key, value] = rawParam.split('=');

        params[decodeURIComponent(key)] = decodeURIComponent(value);
    }

    return params;
};

export default { getWindowSearchParams };
