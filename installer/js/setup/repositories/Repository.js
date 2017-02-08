import React, { Component, PropTypes } from 'react';

import { TableRow, TableRowColumn } from 'material-ui/Table';
import AddSedy from 'material-ui/svg-icons/content/add';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RemoveSedy from 'material-ui/svg-icons/action/delete';


import { install, uninstall } from '../../github';
import getCredentials from './getCredentials';

const { accessToken, user } = getCredentials();

const styles = {
    name: {
        fontSize: '1rem',
        marginBottom: '.5rem',
    },
    description: {
        marginTop: 0,
        color: '#888',
        fontStyle: 'italic',
    },
    actions: {
        textAlign: 'center',
        width: '2rem',
    },
    actionButton: {
        minWidth: 'inherit',
        width: '100%',
    },
};

class Repository extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasSedy: props.repository.sedy_installed,
            loading: false,
        };
    }

    toggleSedy = () => {
        this.setState({ loading: true });

        let promise;
        if (!this.state.hasSedy) {
            promise = install(accessToken, user, this.props.repository);
        } else {
            promise = uninstall(accessToken, user, this.props.repository);
        }

        promise.then(() => this.setState({
            loading: false,
            hasSedy: !this.state.hasSedy,
        }));
    };

    actions() {
        if (this.state.loading) {
            return <CircularProgress color="#65658E" />;
        }

        return (
            <FlatButton
                onClick={this.toggleSedy}
                style={styles.actionButton}
                icon={this.state.hasSedy ? <RemoveSedy color="#EC5D73" /> : <AddSedy color="#88B04B" />}
            />
        );
    }

    render() {
        if (!user) return <div />;

        const {
            repository,
        } = this.props;

        return (
            <TableRow className="repository">
                <TableRowColumn>
                    <div>
                        <h5 style={styles.name}>{repository.full_name}</h5>
                        <p style={styles.description}>{repository.description}</p>
                    </div>
                </TableRowColumn>
                <TableRowColumn style={styles.actions}>
                    {this.actions()}
                </TableRowColumn>
            </TableRow>
        );
    }
}

Repository.propTypes = {
    repository: PropTypes.shape({
        description: PropTypes.string,
        full_name: PropTypes.string.isRequired,
        html_url: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        private: PropTypes.bool.isRequired,
        sedy_installed: PropTypes.bool.isRequired,
    }),
};

export default Repository;
