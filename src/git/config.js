const mandatoryOptions = ['owner', 'repository'];

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
        id: `${config.owner}/${config.repository}`,
        owner: config.owner,
        name: config.repository,
        defaultReference: config.defaultReference || 'refs/heads/master',
    };

    return {
        repository,
    };
};
