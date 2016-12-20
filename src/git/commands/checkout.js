import { CommandError } from '../errors';

export default (references, commits) => function* (ref, force = false) {
    // @TODO: Check if there is current unstaged modifications
    // If yes: if force = false throw an error else continue
    // If no: continue

    const commitSha = yield references.get(ref);
    console.log('checkout', { ref, commitSha, force });

    if (!commitSha) {
        throw new CommandError(`Reference ${ref} does not exist`);
    }

    const commit = yield commits.get(commitSha);
    console.log('checkout', { commit });

    if (!commit) {
        throw new CommandError(`Commit SHA "${commitSha}" from reference "${ref}" does not exist`);
    }

    return yield references.update('head', commit);
};
