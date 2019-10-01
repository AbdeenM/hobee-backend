import schedule from 'node-schedule';
import Category from './model';
import { User } from '../users';
import { Hobee } from '../hobees';
import { hobeeNotificationService } from '../../services/notifications';
import Config from '../../config/config';

export const createCategory = async (req, res) => {
	const {
		mainCategory,
	} = req.body;

	try {
		return res.status(200).json({
			error: false,
			message: await Category.findOrCreate({ mainCategory })
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Error when created category'
		});
	}
};

export const createUserHobee = async (req, res) => {
	const { image, author, authorId, authorAvatar, title, description, notes, hobeeLocation, hobeeCategory, hobeeDate, attendance, location } = req.body;
	const { userId } = req.params;

	let hobeeData = {
		image, author, authorId, authorAvatar, title, description, notes, hobeeLocation, hobeeCategory, hobeeDate, attendance, location
	}

	if (image) {
		const imageName = '/' + new Date().getTime().toString() + '.png';
		const base64Data = image.replace(/^data:([A-Za-z-+/]+);base64,/, '');
		const imagePath = `uploads/`;

		if (!require('fs').existsSync(imagePath)) {
			require('fs').mkdirSync(imagePath);
		}

		require('fs').writeFile(imagePath + imageName, base64Data, 'base64', (err) => {
			console.log(err);
		});

		hobeeData.image = Config.SERVER_URL + imagePath + imageName;
	}

	const categoryFromHobee = await Category.findOrCreate({ mainCategory: hobeeCategory });

	const categoryId = categoryFromHobee.id;

	if (!categoryId) {
		return res.status(400).json({
			error: true,
			message: 'Category must be provided, probably our issue try refreshing'
		});
	}

	try {
		const { hobee } = await Category.addHobee(categoryId, { image, author, authorId, authorAvatar, title, description, notes, hobeeLocation, hobeeCategory, hobeeDate, attendance, location, goingUsers: [userId] });

		await User.findByIdAndUpdate(userId, { $push: { postedHobees: hobee.id } });


		// Schedule notification sending
		const notificationDate = new Date(hobeeDate);
		schedule.scheduleJob(notificationDate, function () {
			hobeeNotificationService(hobee.id, 'TIme for your Hobee', `Time for your ${title} Hobee!`)
		});

		return res.status(200).json({
			error: false,
			hobee
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Hobee cannot be created!'
		});
	}
};

export const getUserHobees = async (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json({
			error: true,
			message: 'You need to provided a category id, probably our issue try refreshing'
		});
	}

	const user = await User.findById(userId);
	const postedHobees = [];
	const joinedHobees = [];

	for (let i = 0; i < user.postedHobees.length; i++) {
		postedHobees.push(await Hobee.findById(user.postedHobees[i]))
	}

	for (let i = 0; i < user.joinedHobees.length; i++) {
		joinedHobees.push(await Hobee.findById(user.joinedHobees[i]))
	}

	const userHobees = {
		postedHobees: postedHobees,
		joinedHobees: joinedHobees
	}

	try {
		return res.status(200).json({
			error: false,
			message: userHobees
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Cannot get your hobee'
		});
	}
};
