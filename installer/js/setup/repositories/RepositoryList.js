/* global APP_BASE_URL */
import React, { Component } from 'react';
import Progress from 'material-ui/CircularProgress';
import { Table, TableBody, TableFooter } from 'material-ui/Table';

import { getRepositories } from '../../github';

import Repository from './Repository';
import Pagination from './Pagination';
import getCredentials from './getCredentials';

const { accessToken, user } = getCredentials();

class RepositoryList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            repositories: [],
            pagination: null,
        };
    }


    componentWillMount() {
        if (user) {
            this.fetchRepositories().then(({ repositories, pagination }) => {
                this.setState({
                    pagination,
                    repositories,
                    loading: false,
                });
            });
        }
    }

    onPageChange = page => () => {
        this.setState({ loading: true });

        this.fetchRepositories(page).then(({ repositories, pagination }) => {
            this.setState({
                pagination,
                repositories,
                loading: false,
            });
        });
    };

    fetchRepositories = page => getRepositories(accessToken, user, page);

    render() {
        if (!user) {
            return (<p>
                Please wait while we retrieve your GitHub informations.<br />
                <a href={APP_BASE_URL}>Back to the home</a>
            </p>);
        }

        return (
            <div>
                {this.state.loading && <div style={{ textAlign: 'center' }}>
                    <Progress color="#65658E" size={60} thickness={5} />
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
                    {this.state.pagination && <TableFooter>
                        <Pagination
                            links={this.state.pagination}
                            onChange={this.onPageChange}
                        />
                    </TableFooter>}
                </Table>
            </div>
        );
    }
}

export default RepositoryList;
