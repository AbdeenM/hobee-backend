import { Router } from 'express';

import * as HobeeController from './controller';
import { requireJwtAuth } from '../../utils/requireJwtAuth';

const routes = new Router();

// Post requests:
routes.post('/hobees/create', HobeeController.createHobee);
routes.post('/hobees/search', HobeeController.searchAllHobees);
routes.post('/hobees/hobeeDetails', HobeeController.fetchHobeeDetails);
routes.post('/hobees/hobeeAttendance', HobeeController.updateHobeeAttendance);
routes.post('/hobees/browse', HobeeController.browseAllHobees);

// Get requests:
routes.get('/hobees', /*requireJwtAuth,*/ HobeeController.getAllHobees);

export default routes;
