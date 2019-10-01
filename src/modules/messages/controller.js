import Chats from '../chats/model';
import User from '../users/model';
import { messageNotificationService } from '../../services/notifications';

export const onUserJoined = async (userId, friendId, socket) => {
	const checkChat = await Chats.findOne({ $or: [{ friendId }, { friendId: userId }] });
	if (checkChat) {
		socket.emit('message', checkChat.messages.reverse());
	} else {
		socket.emit('message', []);
	}
};

export const onMessageRecieved = (message, senderSocket) => {
	_sendAndSaveMessage(message, senderSocket);
};

async function _sendAndSaveMessage(message, socket, fromServer) {
	delete message['_id'];
	const checkChat = await Chats.findOne({ $or: [{ friendId: message.friendId }, { friendId: message.user._id }] });
	if (checkChat) {
		await Chats.findOneAndUpdate({ $or: [{ friendId: message.friendId }, { friendId: message.user._id }] }, { $push: { messages: { $each: [message] } } });
	} else {
		await Chats.create({
			friendId: message.friendId,
			messages: message
		});

		await User.findByIdAndUpdate(message.user._id, { $push: { chats: message.friendId } });

		await User.findByIdAndUpdate(message.friendId, { $push: { chats: message.user._id } });
	}

	const friendUser = await User.findById(message.user._id);
	const friendUserData = friendUser.toObject();

	// Send notificaiton to friend
	await messageNotificationService(message.friendId, 'Hobee Message', `You have a message from ${friendUserData.fullName}`);

	const emitter = fromServer ? webSocket : socket.broadcast;
	emitter.emit('message', [message]);
};
