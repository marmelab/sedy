import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import Repository from './Repository';

const RepositoryList = ({ repositories }) => (
    <Table>
        <TableBody>
            {repositories.map(repository => (
                <Repository
                    key={repository.id}
                    repository={repository}
                />
            ))}
        </TableBody>
    </Table>
);

RepositoryList.propTypes = {
    repositories: PropTypes.array,
};

RepositoryList.defaultProps = {
    repositories: [],
};

export default RepositoryList;
