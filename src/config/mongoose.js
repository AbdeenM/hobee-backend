import mongoose from 'mongoose';

import Config from './config';

export default () => {
	mongoose.Promise = global.Promise;
	mongoose.connect(Config.DB_URL, { useNewUrlParser: true });
	mongoose.set('debug', true);
	mongoose.set('useCreateIndex', true);
	mongoose.connection
		.once('open', () => console.log('Mongodb running'))
		.on('error', err => console.error(err));
};
