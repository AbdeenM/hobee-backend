import User from './model';
import { Categorys } from '../categorys';
import { createToken } from './utils/createToken';
import { facebookAuth } from './utils/facebookAuth';
import { googleAuth } from './utils/googleAuth';
import { getUserInfo } from './utils/getUserInfo';
import Config from '../../config/config';

var AWS = require('aws-sdk');

/* User registeration */
export const loginWithAuth0 = async (req, res) => {
	const { provider, notificationId, token } = req.body;
	let userInfo;

	try {
		if (provider === 'google') {
			userInfo = await googleAuth(token);
		} else if (provider === 'facebook') {
			userInfo = await facebookAuth(token);
		} else if (provider === 'email') {
			userInfo = getUserInfo(token, 'email');
		}

		// Add notificaiton Id to user details
		userInfo.notificationId = notificationId;

		const user = await User.findOrCreate(userInfo);

		return res.status(200).json({
			success: true,
			user: {
				id: user._id,
				avatar: user.avatar,
				name: user.fullName,
				email: user.email
			},
			token: `JWT ${createToken(user)}`
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: e.message
		});
	}
};

/* User Notifications */
export const getUserNotifications = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find user id, probably our fault try reporting this!'
		});
	}

	// Search for see if user exist
	const user = await User.findById(userId);
	const userData = user.toObject();

	if (!user) {
		return res.status(400).json({
			error: true,
			message: 'User not exist'
		});
	}

	try {
		return res.status(200).json({
			error: false,
			message: userData.notificationHobees
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get your settings, try refershing the app'
		});
	}
}

/* User Settings */
export const getUserSettings = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find user id, probably our fault try reporting this!'
		});
	}

	// Search for see if user exist
	const user = await User.findById(userId);

	if (!user) {
		return res.status(400).json({
			error: true,
			message: 'User not exist'
		});
	}

	try {
		return res.status(200).json({
			error: false,
			message: await User.findById(userId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get your settings, try refershing the app'
		});
	}
}

export const updateUserSettings = async (req, res) => {
	const { darkTheme, notifications } = req.body;
	const { userId } = req.params;

	try {
		await User.findByIdAndUpdate(userId, { darkTheme, notifications });

		return res.status(200).json({
			error: false,
			message: await User.findById(userId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Settings could not be updated, try again later'
		});
	}
}

/* User Profile */
export const getUserProfile = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find user id, probably our fault try reporting this!'
		});
	}

	// Search for see if user exist
	const user = await User.findById(userId);

	if (!user) {
		return res.status(400).json({
			error: true,
			message: 'User not exist'
		});
	}

	try {
		return res.status(200).json({
			error: false,
			message: await User.findById(userId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get your profile, try refershing the app'
		});
	}
}

export const updateUserProfile = async (req, res) => {
	const { avatar, fullName, email, age, address } = req.body;
	const { userId } = req.params;

	try {
		await User.findByIdAndUpdate(userId, { avatar, fullName, email, age, address });

		return res.status(200).json({
			error: false,
			message: await User.findById(userId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Profile could not be updated, try again later'
		});
	}
}

/* User Categorys */
export const getUserCategorys = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find user id, probably our fault try reporting this!'
		});
	}

	// Search for see if user exist
	const user = await User.findById(userId);

	if (!user) {
		return res.status(400).json({
			error: true,
			message: 'User not exist'
		});
	}

	try {
		return res.status(200).json({
			error: false,
			message: await User.findById(userId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get your categorys, try refershing the app'
		});
	}
}

export const updateUserCategorys = async (req, res) => {
	const { categorys } = req.body;
	const { userId } = req.params;

	try {
		return res.status(200).json({
			error: false,
			message: await User.findByIdAndUpdate(userId, { categorys })
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Categorys could not be updated, try again later'
		});
	}
}
