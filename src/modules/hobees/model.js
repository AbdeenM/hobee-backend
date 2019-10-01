import mongoose, { Schema } from 'mongoose';

const HobeeSchema = new Schema({
	image: {
		type: String
	},
	title: {
		type: String
	},
	description: {
		type: String
	},
	author: {
		type: String
	},
	authorId: {
		type: String
	},
	authorAvatar: {
		type: String
	},
	notes: {
		type: String
	},
	hobeeDate: {
		type: Date
	},
	hobeeCategory: {
		type: String
	},
	hobeeLocation: {
		address: {
			type: String
		},
		latitude: {
			type: String
		},
		longitude: {
			type: String
		}
	},
	goingUsers: [{
		type: String
	}],
	maybeUsers: [{
		type: String
	}],
	notGoingUsers: [{
		type: String
	}],
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}
}, { timestamps: true });

export default mongoose.model('Hobee', HobeeSchema);
