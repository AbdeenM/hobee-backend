import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema(
	{
		mainCategory: {
			type: String
		},
		hobees: [{
			type: Schema.Types.ObjectId,
			ref: 'Hobee'
		}],
	}, { timestamps: true }
);

CategorySchema.statics.findOrCreate = async function (args) {
	try {
		const categoryCheck = await this.findOne({ mainCategory: args.mainCategory });

		if (!categoryCheck) {
			return await this.create(args);
		}

		return categoryCheck;
	} catch (e) {
		return e;
	}
}

CategorySchema.statics.addHobee = async function (id, args) {
	const Hobee = mongoose.model('Hobee');
	const hobee = await new Hobee({ ...args, category: id });

	await this.findByIdAndUpdate(id, { $push: { hobees: hobee.id } });

	return {
		hobee: await hobee.save()
	};
};

export default mongoose.model('Category', CategorySchema);
