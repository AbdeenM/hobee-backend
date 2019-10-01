import { Router } from 'express';
import * as CategoryController from './controller';

const routes = new Router();

// Post requests:
routes.post('/categorys/new', CategoryController.createCategory);
routes.post('/categorys/:userId/hobees/new', CategoryController.createUserHobee);

// Get requests:
routes.get('/categorys/:userId/hobees', CategoryController.getUserHobees);

export default routes;
