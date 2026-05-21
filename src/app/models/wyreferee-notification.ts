export class WyRefereeNotification {
	id: number;
	title: string;
	message: string;

	minVersion: string;
	maxVersion: string;

	dismissible: boolean;
	type: string;

	createdAt: Date;
}
