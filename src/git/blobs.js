export default (client, repo) => {
    const get = function* (sha) {
        return yield client.getBlobFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });
    };

    return { get };
};
