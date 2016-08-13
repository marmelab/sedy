const mandatoryOptions = ['repository', 'commitAuthor'];

const check = config => {
    const missingOptions = mandatoryOptions.reduce((missings, option) => {
        if (Object.keys(config).indexOf(option) === -1) {
            missings.push(option);
        }

        return missings;
    }, []);

    if (missingOptions.length > 0) {
        throw Error(`These options are required: ${missingOptions.join(', ')}`);
    }
};

export default config => {
    check(config);

    const repository = {
        id: `${config.repository.owner}/${config.repository.name}`,
        owner: config.repository.owner,
        name: config.repository.name,
        defaultReference: config.repository.defaultReference || 'refs/heads/master',
    };

    const commitAuthor = {
        name: config.commitAuthor.name,
        email: config.commitAuthor.email,
    };

    return {
        commitAuthor,
        repository,
    };
};
