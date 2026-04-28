import { Observable } from "rxjs";

export interface INavigationItem {
	icon?: string;
	header?: string;
	link?: string;
	showIf?: boolean;
	showIfObservable?: Observable<boolean>;
	type?: 'item' | 'divider';
}
