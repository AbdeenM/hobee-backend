import User from '../users/model';
import Chats from './model';

/** FETCH USER CHATS */
export const fetchChatsUser = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.json({
			error: true,
			message: 'Error with getting your account information, try logging in again.'
		});
	}

	/** Get the user profile */
	const user = await User.findById(userId);

	if (!user) {
		return res.json({
			error: true,
			message: 'Failed to get your account details, it has their been deleted or deactivated.'
		});
	}

	/** Get all chats ID of the profile */
	const userChats = [];

	for (let index = 0; index < user.chats.length; index++) {
		const friend = await User.findById(user.chats[index]);

		const chatHistory = await Chats.findOne({ $or: [{ friendId: friend._id }, { friendId: userId }] }).select('messages');

		/** Push friend details to userChats */
		userChats.push({
			fullName: friend.fullName,
			avatar: friend.avatar,
			friendId: friend._id,
			chatHistory: chatHistory.messages[chatHistory.messages.length - 1]
		});
	}

	return res.status(200).json({
		error: false,
		message: userChats
	});
};
