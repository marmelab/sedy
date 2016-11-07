import React, { Component, PropTypes } from 'react';
import Progress from 'material-ui/CircularProgress';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';

import { getRepositories } from '../../installer/github';

import Repository from './Repository';
import Pagination from './Pagination';

const accessToken = window.localStorage.accessToken;
const user = JSON.parse(window.localStorage.user);

class RepositoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            hasNext: false,
            loading: true,
            repositories: [],
        };
    }

    fetchRepositories = page => getRepositories(accessToken, user, page);

    componentWillMount() {
        this.fetchRepositories(this.state.page)
            .then(repositories => this.setState({ repositories, loading: false }));
    }

    onPageChange = page => () => {
        this.fetchRepositories(page)
            .then(repositories => this.setState({
                page,
                repositories,
            }));
    };

    render() {
        return (
            <div>
                {this.state.loading && <div style={{ textAlign: 'center' }}>
                    <Progress size={60} thickness={5} />
                </div>}
                <Table>
                    <TableBody>
                        {this.state.repositories.map(repository => (
                            <Repository
                                key={repository.id}
                                repository={repository}
                            />
                        ))}
                    </TableBody>
                </Table>
                {/* to be implemented
                <Pagination
                    hasNext={true}
                    page={2}
                    onChange={this.onPageChange}
                />*/}
            </div>
        );
    };
}

export default RepositoryList;
