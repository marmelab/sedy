import React, { PropTypes } from 'react';

import { blue500 } from 'material-ui/styles/colors';

const styles = {
    pagination: {
        display: 'flex',
    },
    link: {
        flex: '1 0 0',
        color: blue500,
        padding: '0.5rem 1rem',
    },
};

const Pagination = ({ hasNext, onChange, page }) => {
    const previousStyle = {
        ...styles.link,
        display: page <= 1 ? 'none' : 'block',
    };

    const nextStyle = {
        ...styles.link,
        textAlign: 'right',
        display: hasNext ? 'block' : 'none',
    };

    return (
        <div style={styles.pagination}>
            <a href="#" style={previousStyle} onClick={onChange(page - 1)}>
                &laquo; Previous
            </a>
            <a href="#" style={nextStyle} onClick={onChange(page + 1)}>
                Next &raquo;
            </a>
        </div>
    );
};

Pagination.propTypes = {
    hasNext: PropTypes.bool,
    onChange: PropTypes.func,
    page: PropTypes.number,
};

Pagination.defaultProps = {
    hasNext: false,
    onChange: () => {},
    page: 1,
};

export default Pagination;
