export default (client, repo) => {
    const get = function* (sha) {
        return yield client.getCommitFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            commitId: sha,
        });
    };

    return { get };
};
