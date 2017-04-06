import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    pagination: {
        textAlign: 'center',
        padding: 5,
    },
};

const Pagination = ({ links, onChange }) => {
    if (!links) {
        return <div />;
    }

    const { first, prev, next, last } = links;
    const renderButton = link => <FlatButton
        label={link.page}
        onClick={onChange(link.page)}
    />;

    return (
        <div style={styles.pagination}>
            {first && renderButton(first)}
            {prev && prev.page !== first.page && renderButton(prev)}
            <FlatButton label="Page" disabled={true} />
            {next && renderButton(next)}
            {last && next.page !== last.page && renderButton(last)}
        </div>
    );
};

Pagination.propTypes = {
    links: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    onChange: PropTypes.func,
};

Pagination.defaultProps = {
    links: null,
    onChange: () => {},
};

export default Pagination;
