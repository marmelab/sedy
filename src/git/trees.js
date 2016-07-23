export default (client, repo, store) => {
    const get = function* (sha) {
        const storedTree = store.get(sha);

        if (storedTree && storedTree.type === 'tree') {
            return storedTree;
        }

        const tree = yield client.getTreeFromId({
            repoUser: repo.owner,
            repoName: repo.name,
            id: sha,
        });

        store.update(tree);

        return tree;
    };

    return { get };
};
