import jwt from 'jsonwebtoken';

import Config from '../../../config/config';

export const createToken = args =>
	jwt.sign({ id: args._id }, Config.JWT_SECRET);
