import React, { Component, PropTypes } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import Repository from './Repository';
import Pagination from './Pagination';

const repositories = require('../repositories');

class RepositoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            hasNext: false,
        };
    }

    onPageChange = page => () => {
        console.log(`New page: ${page}`);
        this.setState({ page });
    };

    render() {
        return (
            <div>
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
                <Pagination
                    hasNext={true}
                    page={2}
                    onChange={this.onPageChange}
                />
            </div>
        );
    };
}

RepositoryList.propTypes = {
    repositories: PropTypes.array,
};

RepositoryList.defaultProps = {
    repositories: [],
};

export default RepositoryList;
