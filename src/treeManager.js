export default (githubApi, parsedContent) => {
    const rafineBlob = function* (file, parentTree) {
        const raw = yield githubApi.getBlobFromId({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            id: file.sha,
        });

        return {
            ...file,
            absolutePath: parentTree.absolutePath + file.path,
            parentTreeSha: parentTree.sha,
            raw,
        };
    };

    const rafineTree = function* (tree, parentPath, root = false) {
        let retrievedTree;
        if (root) {
            retrievedTree = tree;
            retrievedTree.absolutePath = '/';
        } else {
            retrievedTree = yield githubApi.getFromUrl(tree.url);
            retrievedTree.absolutePath = `${parentPath}${tree.path}/`;
        }

        const children = yield retrievedTree.tree.map(file => {
            switch (file.type) {
                case 'tree':
                    return rafineTree(file, retrievedTree.absolutePath);
                case 'blob':
                    return rafineBlob(file, retrievedTree);

                default:
                    throw new Error(`File type "${file.type}" not supported`);
            }
        });

        const rafinedTree = [{ ...retrievedTree }];

        children.forEach(child => {
            const files = Array.isArray(child) ? child : [child];

            files.forEach(file => {
                rafinedTree.push(file);
            });
        });

        return rafinedTree;
    };

    const rafine = function* (tree) {
        const rafinedTree = {};
        const files = yield rafineTree(tree, tree.absolutePath, true);

        files.forEach(file => {
            rafinedTree[file.absolutePath] = file;
        });

        rafinedTree.root = rafinedTree['/'];

        return rafinedTree;
    };

    const getFromSha = function* (sha) {
        const tree = yield githubApi.getTreeFromId({
            repoUser: parsedContent.repository.user,
            repoName: parsedContent.repository.name,
            id: sha,
        });

        return yield rafine(tree);
    };

    return {
        getFromSha,
        rafine,
    };
};
