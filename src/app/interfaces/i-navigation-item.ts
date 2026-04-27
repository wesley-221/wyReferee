export interface INavigationItem {
	icon?: string;
	header?: string;
	link?: string;
	showIf?: boolean;
	type?: 'item' | 'divider';
}
