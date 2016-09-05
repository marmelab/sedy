/* global APP_NAME */
import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

const HelmetTitle = ({ title }) => <Helmet title={APP_NAME + (!!title ? ` - ${title}` : '')} />;

HelmetTitle.propTypes = {
    title: PropTypes.string,
};

export default HelmetTitle;
