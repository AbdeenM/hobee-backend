import { Router } from 'express';

import * as UserController from './controller';

const routes = new Router();

routes.post('/users/auth0', UserController.loginWithAuth0);

// Post requests:
routes.post('/users/:userId/settings/new', UserController.updateUserSettings);
routes.post('/users/:userId/profile/new', UserController.updateUserProfile);
routes.post('/users/:userId/categorys/new', UserController.updateUserCategorys);

// Get requests:
routes.get('/users/:userId/notifications', UserController.getUserNotifications);
routes.get('/users/:userId/settings', UserController.getUserSettings);
routes.get('/users/:userId/categorys', UserController.getUserProfile);
routes.get('/users/:userId/profile', UserController.getUserCategorys);


export default routes;
