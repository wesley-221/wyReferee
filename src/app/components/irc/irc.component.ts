import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IrcService } from '../../services/irc.service';

@Component({
	selector: 'app-irc',
	templateUrl: './irc.component.html',
	styleUrls: ['./irc.component.scss']
})
export class IrcComponent implements OnInit {
	@ViewChild('messageContainer', { static: false}) messageContainer: ElementRef;

	selectedChannel: string;
	chats = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	channels = [
		'#osu',
		'#ctb',
		'#mp_39334234',
		'Wesley'
	];

	constructor(private ircService: IrcService) { }

	ngOnInit() { }

	changeChannel(channel: string) {
		this.selectedChannel = channel;
		this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
	}

	temp() {
		this.ircService.connect('', '');
	}
}
