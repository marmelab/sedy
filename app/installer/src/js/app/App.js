import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { RouteTransition } from 'react-router-transition';
import HelmetTitle from './HelmetTitle';

export class App extends Component {
    mapStylesForRouteTransition(s) {
        return { transform: `translateX(${s.translateX}%)` };
    }

    render() {
        const { children, location } = this.props;

        return (
            <div className="app container-fluid">
                <HelmetTitle />
                <div className="row">
                    <nav className="navbar navbar-fixed-top navbar-dark bg-primary">
                        <a className="navbar-brand" href="#">Sedy Installer</a>
                        <ul className="nav navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/install">Install</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-10 col-lg-9">
                        <RouteTransition
                            pathname={location.pathname}
                            atEnter={{ translateX: 100 }}
                            atLeave={{ translateX: -100 }}
                            atActive={{ translateX: 0 }}
                            mapStyles={this.mapStylesForRouteTransition}
                            style={{ position: 'relative' }}
                        >
                            <div style={{ position: 'absolute', width: '100%' }}>
                                {children}
                            </div>
                        </RouteTransition>
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
};

export default connect()(App);
