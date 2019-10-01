import mongoose, { Schema } from 'mongoose';

const ChatsSchema = new Schema(
	{
		friendId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		messages: [{
			text: String,
			image: String,
			video: String,
			createdAt: {
				type: Date,
				default: Date.now
			},
			user: {
				_id: {
					type: Schema.Types.ObjectId,
					ref: 'User'
				},
				name: String,
				avatar: String
			}
		}]
	}
);

export default mongoose.model('Chats', ChatsSchema);
