import Expo from 'expo-server-sdk';
import Hobee from '../modules/hobees/model';
import User from '../modules/users/model';

// Create a new Expo SDK client
let expo = new Expo();

export async function hobeeNotificationService(eventId, notificationTitleMessage, notificationBodyMessage) {
	// Create the messages that you want to send to clents
	let messages = [];

	const hobee = await Hobee.findById(eventId);
	const hobeeData = hobee.toObject();

	// Get total Hobee users to send notification too
	const totalUsers = hobeeData.goingUsers.concat(hobeeData.maybeUsers);

	// Get users notifiaction tokens
	let somePushTokens = [];
	for (let index = 0; index < totalUsers.length; index++) {
		const element = totalUsers[index];
		const user = await User.findById(element);
		const userData = user.toObject();

		// Check if user wants to receive notifications
		if (userData.notifications) {
			somePushTokens.push(userData.notificationId);

			const notificationData = {
				eventId,
				title: notificationTitleMessage,
				body: notificationBodyMessage,
				author: hobeeData.author,
				avatar: hobeeData.image
			};
			await User.findByIdAndUpdate(element, { $push: { notificationHobees: notificationData } });
		}
	}

	for (let pushToken of somePushTokens) {
		// Check that all your push tokens appear to be valid Expo push tokens
		if (!Expo.isExpoPushToken(pushToken)) {
			console.error(`Push token ${pushToken} is not a valid Expo push token`);
			continue;
		}

		messages.push({
			to: pushToken,
			sound: 'default',
			title: notificationTitleMessage,
			body: notificationBodyMessage,
			data: {
				mode: 'hobeeTime',
				title: notificationTitleMessage,
				body: notificationBodyMessage
			}
		});
	}

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
	(async () => {
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				console.error(error);
			}
		}
	})();

	let receiptIds = [];
	for (let ticket of tickets) {
		if (ticket.id) {
			receiptIds.push(ticket.id);
		}
	}

	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		for (let chunk of receiptIdChunks) {
			try {
				let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
				console.log(receipts);
				for (let receipt of receipts) {
					if (receipt.status === 'ok') {
						continue;
					} else if (receipt.status === 'error') {
						console.error(`There was an error sending a notification: ${receipt.message}`);
						if (receipt.details && receipt.details.error) {
							console.error(`The error code is ${receipt.details.error}`);
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	})();
};

export async function messageNotificationService(friendId, notificationTitleMessage, notificationBodyMessage) {
	// Create the messages that you want to send to clents
	let messages = [];

	// Get users notifiaction tokens
	const user = await User.findById(friendId);
	const userData = user.toObject();

	let somePushTokens = [];
	if (userData.notifications) {
		somePushTokens.push(userData.notificationId);
	}

	for (let pushToken of somePushTokens) {
		// Check that all your push tokens appear to be valid Expo push tokens
		if (!Expo.isExpoPushToken(pushToken)) {
			console.error(`Push token ${pushToken} is not a valid Expo push token`);
			continue;
		}

		messages.push({
			to: pushToken,
			sound: 'default',
			title: notificationTitleMessage,
			body: notificationBodyMessage,
			data: {
				mode: 'message',
				title: notificationTitleMessage,
				body: notificationBodyMessage
			}
		});
	}

	let chunks = expo.chunkPushNotifications(messages);
	let tickets = [];
	(async () => {
		for (let chunk of chunks) {
			try {
				let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
				tickets.push(...ticketChunk);
			} catch (error) {
				console.error(error);
			}
		}
	})();

	let receiptIds = [];
	for (let ticket of tickets) {
		if (ticket.id) {
			receiptIds.push(ticket.id);
		}
	}

	let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
	(async () => {
		for (let chunk of receiptIdChunks) {
			try {
				let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
				console.log(receipts);
				for (let receipt of receipts) {
					if (receipt.status === 'ok') {
						continue;
					} else if (receipt.status === 'error') {
						console.error(`There was an error sending a notification: ${receipt.message}`);
						if (receipt.details && receipt.details.error) {
							console.error(`The error code is ${receipt.details.error}`);
						}
					}
				}
			} catch (error) {
				console.error(error);
			}
		}
	})();
};
