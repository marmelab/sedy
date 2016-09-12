import React, { PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

const willEnter = children => ({ children, opacity: spring(0), scale: spring(0.95) });
const willLeave = (key, { children }) => ({ children, opacity: spring(0), scale: spring(0.95) });
const getStyles = (children, pathname) => ({
    [pathname]: {
        children,
        opacity: spring(1),
        scale: spring(1),
    },
});

const computeStyles = interpolatedKey => ({
    position: 'absolute',
    opacity: interpolatedKey.opacity,
    transform: `scale(${interpolatedKey.scale})`,
});

const RouteTransition = ({ children, pathname }) => (
    <TransitionMotion
        styles={getStyles(children, pathname)}
        willEnter={willEnter}
        willLeave={willLeave}
    >
        {interpolated => (
            <div>
                {Object.keys(interpolated).map(key =>
                    <div
                        key={`${key}-transition`}
                        style={computeStyles(interpolated[key])}
                    >
                        {interpolated[key].children}
                    </div>)}
            </div>
        )}
    </TransitionMotion>
);

RouteTransition.propTypes = {
    children: PropTypes.node,
    pathname: PropTypes.string,
};

export default RouteTransition;
