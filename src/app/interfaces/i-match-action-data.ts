export interface IMatchActionData {
	team: string;
	action: 'pick' | 'ban' | 'protect';
	description: string;
	color: string;
	icon?: string;
	svgIcon?: string;
}
