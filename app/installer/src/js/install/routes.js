import Install from './Install';
import redirectIfNotAuthenticatedFactory from '../user/redirectIfNotAuthenticated';

export default store => {
    const redirectIfNotAuthenticated = redirectIfNotAuthenticatedFactory(store);

    return [{
        path: 'install',
        component: Install,
        onEnter: redirectIfNotAuthenticated,
    }];
};
