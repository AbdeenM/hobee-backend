import { Router } from 'express';
import * as ChatsController from './controller';

const routes = new Router();

/** CHATS ROUTES */
routes.get('/chats/:userId/chats', ChatsController.fetchChatsUser);

export default routes;
