import { Message } from "./message";

export class Channel {
    channelName: string;
    active: boolean = true;
    allMessages: Message[] = [];
    lastActiveChannel: boolean = false;
    isPrivateChannel: boolean = false;

    constructor(channelName: string, isPrivateChannel: boolean = false) {
        this.channelName = channelName;
        this.isPrivateChannel = isPrivateChannel;
    }
}
