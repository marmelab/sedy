import App from './App';
import userRoutes from '../user/routes';
import installRoutes from '../install/routes';

export default store => ({
    childRoutes: [{
        path: '/',
        component: App,
        childRoutes: [
            ...userRoutes,
            ...installRoutes(store),
        ],
    }],
});
