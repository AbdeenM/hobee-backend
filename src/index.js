import http from 'http';
import express from 'express';
import socketio from 'socket.io';

import dbConfig from './config/mongoose';
import middlewaresConfig from './config/middlewares';
import {
	HobeeRoutes,
	CategoryRoutes,
	UserRoutes,
	ChatRoutes
} from './modules';

import {
	onUserJoined,
	onMessageRecieved
} from './modules/messages/controller';

const app = express();
const server = http.Server(app);
const webSocket = socketio(server);

dbConfig();

middlewaresConfig(app);

app.use('/api', [HobeeRoutes, CategoryRoutes, UserRoutes, ChatRoutes]);
app.use('/uploads', express.static(process.cwd() + '/uploads'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, err => {
	if (err) {
		console.error(err);
	} else {
		console.log(`App listen to port: ${PORT}`);
	}
});

webSocket.on('connection', (socket) => {
	console.log('A client just joined on', socket.id);
	socket.on('userJoined', (userId, friendId) => onUserJoined(userId, friendId, socket));
	socket.on('message', (message) => onMessageRecieved(message, socket));
});
