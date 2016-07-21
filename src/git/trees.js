export default (client, repo) => {
    const get = function* (sha) {
        return yield client.getTreeFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });
    };

    return { get };
};
