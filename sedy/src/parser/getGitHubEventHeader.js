export default headers => {
    if (!headers) return;

    let header = headers['X-GitHub-Event'];
    if (header) return header;

    header = headers['x-github-event'];
    if (header) return header;

    header = headers['X-GITHUB-EVENT'];
    if (header) return header;
};
