export default (client, repo, store) => {
    const get = function* (sha) {
        const storedBlob = store.get(sha);

        if (storedBlob && storedBlob.type === 'blob') {
            return storedBlob;
        }

        const blob = yield client.getBlobFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });

        store.update(blob);

        return blob;
    };

    return { get };
};
