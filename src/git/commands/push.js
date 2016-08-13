import { CommandError } from '../errors';

export default (references) => function* (ref, force = false) {
    const head = yield references.get('head');
    const reference = yield references.get(ref);

    if (head === reference) {
        throw new CommandError('Everything up-to-date');
    }

    return yield references.push(ref, force);
};
