import React, { Component, PropTypes } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import { red500, green500 } from 'material-ui/styles/colors';

import FlatButton from 'material-ui/FlatButton';
import AddSedy from 'material-ui/svg-icons/content/add';
import RemoveSedy from 'material-ui/svg-icons/content/clear';

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

const Repository = ({ repository }) => (
    <TableRow className="repository">
        <TableRowColumn>
            <div>
                <h5 style={styles.name}>{repository.full_name}</h5>
                <p style={styles.description}>{repository.description}</p>
            </div>
        </TableRowColumn>
        <TableRowColumn style={styles.actions}>
            <FlatButton
                style={styles.actionButton}
                icon={
                    repository.sedy_installed ?
                    <RemoveSedy color={red500} /> :
                    <AddSedy color={green500} />
                }
            />
        </TableRowColumn>
    </TableRow>
);

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
