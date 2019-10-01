import Categorys from '../categorys/model';
import Hobee from './model';
import User from '../users/model';

export const createHobee = async (req, res) => {
	const { title, description } = req.body;
	const newHobee = new Hobee({ title, description });

	try {
		return res.status(200).json({
			error: false,
			hobee: await newHobee.save()
		});
	} catch (e) {
		return res.status(e.status).json({
			error: true,
			message: 'Couldnt save hobee, try again later'
		});
	}
};

export const getAllHobees = async (req, res) => {
	try {
		return res.status(200).json({
			error: false,
			message: await Hobee.find({})
		});
	} catch (e) {
		return res.status(e.status).json({
			error: true,
			message: 'Couldnt get your hobees, try again later'
		});
	}
};

export const browseAllHobees = async (req, res) => {
	let browseData = [];
	const categorys = await Categorys.find({});

	for (let index = 0; index < categorys.length; index++) {
		let hobeeData = [];
		const category = categorys[index];

		for (let index = 0; index < category.hobees.length && index < 11; index++) {
			const hobees = category.hobees.reverse()[index];
			const hobee = await Hobee.findById(hobees);

			hobeeData.push({
				_id: hobee._id,
				title: hobee.title,
				image: hobee.image,
			});
		};

		const categoryName = category.mainCategory;
		let result = {};
		result[categoryName] = hobeeData;
		browseData.push(result);
	};

	return res.status(200).json({
		error: false,
		message: browseData
	});
};

export const searchAllHobees = async (req, res) => {
	const { search } = req.body;

	try {
		return res.status(200).json({
			error: false,
			message: await Hobee.find({ title: { '$regex': search, '$options': 'i' } })
		});
	} catch (e) {
		return res.status(e.status).json({
			error: true,
			message: 'Couldnt get your search, try again later'
		});
	}
};

export const fetchHobeeDetails = async (req, res) => {
	const { hobeeId, userId } = req.body;

	if (!hobeeId || !userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find hobee id or user id probably our fault try reporting this!'
		});
	}

	try {
		const hobee = await Hobee.findById(hobeeId);
		const hobeeData = hobee.toObject();

		if (hobeeData.goingUsers.includes(userId)) {
			hobeeData.attendance = 'Going';
		} else if (hobeeData.maybeUsers.includes(userId)) {
			hobeeData.attendance = 'Maybe';
		} else if (hobeeData.notGoingUsers.includes(userId)) {
			hobeeData.attendance = 'Not Going';
		}

		const user = await User.findById(hobeeData.authorId);
		const userData = user.toObject();

		hobeeData.authorAvatar = userData.avatar;
		hobeeData.author = userData.fullName;

		return res.status(200).json({
			error: false,
			message: hobeeData
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get the hobee, try refershing the app'
		});
	}
};

export const updateHobeeAttendance = async (req, res) => {
	const { userId, hobeeId, attendance } = req.body;

	if (!hobeeId || !userId) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt find hobee id, or user id probably our fault try reporting this!'
		});
	}

	// Search to see if hobee exist
	const hobee = await Hobee.findById(hobeeId);

	if (!hobee) {
		return res.status(400).json({
			error: true,
			message: 'Hobee not exist'
		});
	}

	const user = await User.findById(userId);

	try {
		const hobeeData = hobee.toObject();
		const userData = user.toObject();
		if (attendance === 'Going') {
			if (hobeeData.goingUsers.includes(userId)) {
				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			} else if (hobeeData.maybeUsers.includes(userId)) {
				await Hobee.findByIdAndUpdate(hobeeId, { $pull: { maybeUsers: userId }, $push: { goingUsers: userId } });

				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			} else {
				try {
					await Hobee.findByIdAndUpdate(hobeeId, { $pull: { notGoingUsers: userId } });
				} catch (error) { }
				await Hobee.findByIdAndUpdate(hobeeId, { $push: { goingUsers: userId } });

				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			}
		} else if (attendance === 'Maybe') {
			if (hobeeData.goingUsers.includes(userId)) {
				await Hobee.findByIdAndUpdate(hobeeId, { $pull: { goingUsers: userId }, $push: { maybeUsers: userId } });

				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			} else if (hobeeData.maybeUsers.includes(userId)) {
				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			} else {
				try {
					await Hobee.findByIdAndUpdate(hobeeId, { $pull: { notGoingUsers: userId } });
				} catch (error) { }
				await Hobee.findByIdAndUpdate(hobeeId, { $push: { maybeUsers: userId } });

				// Add hobee to user joined hobees
				if (!userData.postedHobees.includes(hobeeId)) {
					if (!userData.joinedHobees.includes(hobeeId)) {
						await User.findByIdAndUpdate(userId, { $push: { joinedHobees: hobeeId } })
					}
				}
			}
		} else {
			if (hobeeData.goingUsers.includes(userId)) {
				await Hobee.findByIdAndUpdate(hobeeId, { $pull: { goingUsers: userId }, $push: { notGoingUsers: userId } });

				// Remove hobee from user joined hobees
				if (userData.joinedHobees.includes(hobeeId)) {
					await User.findByIdAndUpdate(userId, { $pull: { joinedHobees: hobeeId } })
				}
			} else if (hobeeData.maybeUsers.includes(userId)) {
				await Hobee.findByIdAndUpdate(hobeeId, { $pull: { maybeUsers: userId }, $push: { notGoingUsers: userId } });

				// Remove hobee from user joined hobees
				if (userData.joinedHobees.includes(hobeeId)) {
					await User.findByIdAndUpdate(userId, { $pull: { joinedHobees: hobeeId } })
				}
			} else {
				try {
					await Hobee.findByIdAndUpdate(hobeeId, { $pull: { notGoingUsers: userId } });
				} catch (error) { }
				await Hobee.findByIdAndUpdate(hobeeId, { $push: { notGoingUsers: userId } });
			}

			// Remove hobee from user joined hobees
			if (userData.joinedHobees.includes(hobeeId)) {
				await User.findByIdAndUpdate(userId, { $pull: { joinedHobees: hobeeId } })
			}
		}

		return res.status(200).json({
			error: false,
			message: await Hobee.findById(hobeeId)
		});
	} catch (e) {
		return res.status(400).json({
			error: true,
			message: 'Couldnt get the hobee, try refershing the app'
		});
	}
}
