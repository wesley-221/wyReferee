import { MessageBuilder } from "./message-builder";

export class Message {
    messageId: number;
    date: string;
    time: string;
    author: string;
    message: MessageBuilder[];
    isADivider: boolean;
    read: boolean;

    constructor(messageId: number, date: string, time: string, author: string, message: MessageBuilder[], isADivider: boolean = false, read: boolean = false) {
        this.messageId = messageId;
        this.date = date;
        this.time = time;
        this.author = author;
        this.message = message;
        this.isADivider = isADivider;
        this.read = read;
    }

    convertToJson(): { messageId: number, date: string, time: string, author: string, message: any[], read: boolean } {
        return {
            messageId: this.messageId,
            date: this.date,
            time: this.time,
            author: this.author, 
            message: this.message.map(m => m.convertToJson()),
            read: this.read
        };
    }
}
