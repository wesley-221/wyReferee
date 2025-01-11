export class SidebarItem {
	name: string;
	logo: string;
	svgIcon: string;
	link: string;
	subMenuItem: boolean;
	onlyShowWhenLoggedIn: boolean;
	onlyShowAsTournamentHost: boolean;
	onlyShowAsAdministrator: boolean;
	htmlElementId: string;

	constructor(init?: Partial<SidebarItem>) {
		Object.assign(this, init);
	}
}
