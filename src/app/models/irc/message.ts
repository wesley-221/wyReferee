export class Message {
    author: string;
    message: string;
    containsHtml: boolean = false;
    linkData: { messageBeforeName: string, link: string, name: string };

    constructor(author: string, message: string, containsHtml: boolean = false, linkData: { messageBeforeName: string, link: string, name: string } = null) {
        this.author = author;
        this.message = message;
        this.containsHtml = containsHtml;
        this.linkData = linkData;
    }
}
