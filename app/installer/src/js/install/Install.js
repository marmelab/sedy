import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
    getRepositories as getRepositoriesActions,
    installSedy as installSedyActions,
} from './actions';
import HelmetTitle from '../app/HelmetTitle';

class Install extends Component {
    componentDidMount() {
        const { user, getRepositories } = this.props;

        getRepositories(user);
    }

    handleOnClick(repository) {
        const { user, installSedy } = this.props;

        installSedy({ user, repository });
    }

    render() {
        const { user, repositories } = this.props;

        return (
            <div className="container register">
                <HelmetTitle title="Install" />
                <div className="row">
                    <div className="col-xs-12" style={{ marginTop: '2em' }}>
                        <h2>Click on your repository to install Sedy on it</h2>
                        {repositories &&
                            repositories.map(repository =>
                                <li
                                    key={repository.id}
                                    onClick={() => this.handleOnClick(repository)}
                                >
                                    { user.name }/{ repository.name }&nbsp;
                                    {repository.hookInstalled && <span>(hook installed)</span>}
                                </li>
                            )
                        }
                        {(!repositories || repositories.length === 0) &&
                            <span>No repository found</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Install.propTypes = {
    user: PropTypes.object.isRequired,
    repositories: PropTypes.array,
    getRepositories: PropTypes.func.isRequired,
    installSedy: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    user: state.user,
    repositories: state.install.repositories,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getRepositories: getRepositoriesActions.request,
    installSedy: installSedyActions.request,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Install);
