export default (client, repo, store) => {
    const get = function* (sha) {
        const storedCommit = store.get(sha);

        if (storedCommit && storedCommit.type === 'commit') {
            return storedCommit;
        }

        const commit = yield client.getCommitFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            commitId: sha,
        });

        store.update(commit);

        return commit;
    };

    return { get };
};
