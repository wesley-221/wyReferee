export class Message {
    time: string;
    author: string;
    message: string;
    containsHtml: boolean = false;
    linkData: { messageBeforeName: string, link: string, name: string };

    constructor(time: string, author: string, message: string, containsHtml: boolean = false, linkData: { messageBeforeName: string, link: string, name: string } = null) {
        this.time = time;
        this.author = author;
        this.message = message;
        this.containsHtml = containsHtml;
        this.linkData = linkData;
    }
}
