export enum ToastType {
    Warning = 'warning',
    Information = 'information',
    Error = 'danger'
}

export class Toast {
    id: number;
    message: string;
    toastType: ToastType;

    constructor(id: number, message: string, toastType: ToastType) {
        this.id = id; 
        this.message = message;
        this.toastType = toastType;
    }
}
