import { CommandError } from '../errors';

export default (references, trees, commits) => function* (ref, message) {
    const head = yield references.get('head');

    let tree;

    try {
        tree = yield trees.get(head);
    } catch (e) {
        throw new CommandError('Nothing to commit.');
    }

    const parent = yield references.get(ref);
    const commit = yield commits.create(tree, message, [parent]);

    yield references.update('head', commit);

    return commit;
};
