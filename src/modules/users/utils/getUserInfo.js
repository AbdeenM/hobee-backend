export function getUserInfo(data, provider) {
	let fullName;
	let avatar;


	if (provider === 'google') {
		fullName = data.name;
		avatar = data.picture;
	} else if (provider === 'facebook') {
		fullName = data.name;
		avatar = data.picture.data.url;
	} else if (provider === 'email') {
		fullName = data.name;
		data.id = '';
	}

	return {
		fullName,
		avatar,
		email: data.email,
		providerData: {
			uid: data.id,
			provider
		}
	};
}
