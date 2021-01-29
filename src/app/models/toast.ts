export enum ToastType {
	Warning = 'warning',
	Information = 'information',
	Error = 'danger'
}

export class Toast {
	id: number;
	message: string;
	toastType: ToastType;
	duration: number;

	constructor(id: number, message: string, toastType: ToastType, duration: number) {
		this.id = id;
		this.message = message;
		this.toastType = toastType;
		this.duration = duration;
	}
}
