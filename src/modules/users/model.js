import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
		},
		fullName: {
			type: String
		},
		age: {
			type: String
		},
		address: {
			fullName: String
		},
		avatar: {
			type: String
		},
		darkTheme: {
			type: Boolean,
			default: true
		},
		notifications: {
			type: Boolean,
			default: true
		},
		notificationId: {
			type: String
		},
		providerData: {
			uid: String,
			provider: String
		},
		categorys: {
			type: Array
		},
		chats: [{
			type: String
		}],
		notificationHobees: [{
			eventId: String,
			title: String,
			time: { type: Date, default: Date.now },
			body: String,
			author: String,
			avatar: String
		}],
		postedHobees: [{
			type: String
		}],
		joinedHobees: [{
			type: String
		}]
	},

	{ timestamps: true },
);

UserSchema.statics.findOrCreate = async function (args) {
	try {
		const user = await this.findOne({
			email: args.email
		});

		if (!user) {
			return await this.create(args);
		}

		return user;
	} catch (e) {
		return e;
	}
};

export default mongoose.model('User', UserSchema);
