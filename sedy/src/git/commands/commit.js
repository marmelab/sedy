import { CommandError } from '../errors';

export default (commitAuthor, references, trees, commits) => function* (ref, message, parentSha = null) {
    const head = yield references.get('head');

    let tree;

    try {
        tree = yield trees.get(head);
    } catch (e) {
        throw new CommandError('Nothing to commit.');
    }

    let parent = parentSha;
    if (!parent) {
        parent = yield references.get(ref);
    }
    const commit = yield commits.create(tree, message, commitAuthor, [parent]);

    yield references.update('head', commit);

    return commit;
};
