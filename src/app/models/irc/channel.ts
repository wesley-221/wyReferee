import { Message } from "./message";

export class Channel {
    channelName: string;
    active: boolean = true;
    allMessages: Message[] = [];
    lastActiveChannel: boolean = false;

    constructor(channelName: string) {
        this.channelName = channelName;
    }
}
