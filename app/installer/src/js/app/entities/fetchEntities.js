/* globals API_URL */
const getOptions = jwt => {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
    };

    if (jwt) {
        headers.Authorization = jwt;
    }

    return {
        headers,
        // Allows API to set http-only cookies with AJAX calls
        // @see http://www.redotheweb.com/2015/11/09/api-security.html
        credentials: 'include',
    };
};

const handleResponse = response => {
    if (!response.ok) {
        return response.text().then(result => Promise.reject(new Error(result)));
    }

    return response.json();
};

const handleError = error => ({ error });

export const fetchEntitiesFactory = path => jwt =>
    fetch(`${API_URL}/${path}`, getOptions(jwt))
    .then(handleResponse)
    .then(json => ({ list: json }))
    .catch(handleError);

export const fetchEntityFactory = path => (id, jwt) =>
    fetch(`${API_URL}/${path}/${id}`, getOptions(jwt))
    .then(handleResponse)
    .then(json => ({ item: json }))
    .catch(handleError);
