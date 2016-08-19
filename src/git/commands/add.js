import { CommandError } from '../errors';
import { validatePath } from '../validation';

const SEP = '/';
const reverse = () => 1;

export default (references, commits, trees) => function* (blob, path) {
    validatePath(path);

    const head = yield references.get('head');
    let rootTree;
    try {
        const commit = yield commits.get(head);
        rootTree = yield trees.get(commit.tree.sha);
    } catch (err) {
        rootTree = yield trees.get(head);
    }

    const blobName = path.split(SEP).slice(-1)[0];
    const folders = path.split(SEP).slice(1, -1);

    if (!blobName) {
        throw new CommandError(`Path "${path}" can not be used to create a blob`);
    }

    const parents = [];
    let blobTree = Object.assign({}, rootTree);

    for (const folder of folders) {
        blobTree = blobTree.tree.find(obj => obj.type === 'tree' && obj.path === folder);

        if (!blobTree) {
            // @TODO: If path is in a new folder, this exception will throw
            // Create trees until there is no folder anymore
            throw new CommandError(`Unable to find a tree relative to path "${path}"`);
        }

        blobTree = yield trees.get(blobTree.sha);
        parents.push({
            sha: blobTree.sha,
            path: folder,
        });
    }

    let newTreeContent = blobTree.tree
        .filter(b => b.path !== blobName)
        .concat([{
            path: blobName,
            mode: blob.mode,
            type: 'blob',
            content: blob.content,
        }]);

    if (rootTree.sha === blobTree.sha) {
        const newTree = yield trees.createTreeFromBase(rootTree, Object.assign({}, blobTree, { tree: newTreeContent }));

        return yield references.update('head', newTree);
    }

    const newTree = yield trees.createTreeFromBase(blobTree, Object.assign({}, blobTree, { tree: newTreeContent }));

    const firstParent = parents.pop();
    let lastTree = Object.assign({}, newTree, { path: firstParent.path });

    if (parents.length > 0) {
        for (const parent of parents.sort(reverse)) {
            const oldParentTree = yield trees.get(parent.sha);
            const newParentTreeContent = oldParentTree.tree
                .filter(obj => obj.sha !== lastTree.sha)
                .concat([{
                    sha: lastTree.sha,
                    path: lastTree.path,
                    type: lastTree.type,
                    mode: lastTree.mode,
                }]);

            const newParentTree = yield trees.createTreeFromBase(oldParentTree, Object.assign({}, oldParentTree, {
                tree: newParentTreeContent,
                path: parent.path,
            }));

            lastTree = Object.assign({}, newParentTree, { path: parent.path });
        }
    }

    const newRootTreeContent = rootTree.tree
        .filter(obj => obj.sha !== lastTree.sha)
        .concat([lastTree]);
    const newRootTree = yield trees.createTreeFromBase(rootTree, Object.assign({}, rootTree, { tree: newRootTreeContent }));

    return yield references.update('head', newRootTree);
};
