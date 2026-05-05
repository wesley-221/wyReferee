import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { SlashCommand } from '../../../../models/slash-command';

@Component({
	selector: 'app-irc-chat-controls',
	templateUrl: './irc-chat-controls.component.html',
	styleUrl: './irc-chat-controls.component.scss'
})
export class IrcChatControlsComponent {
	@Output() sendMessageEmitter = new EventEmitter<KeyboardEvent>();
	@Output() handleKeyboardEventEmitter = new EventEmitter<KeyboardEvent>();
	@Output() selectSlashCommandEmitter = new EventEmitter<SlashCommand>();

	@Input() activeSlashCommand: SlashCommand;
	@Input() allSlashCommandsFiltered: SlashCommand[];

	@ViewChild('chatMessage') chatMessage: ElementRef;

	@HostListener('document:keyup', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		this.handleKeyboardEventEmitter.emit(event);
	}

	sendMessage(event: KeyboardEvent) {
		this.sendMessageEmitter.emit(event);
	}

	sendMessageButton() {
		const event = new KeyboardEvent('keyup', { key: 'Enter' });
		this.sendMessageEmitter.emit(event);
	}

	preventDefault(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
		}
	}

	selectSlashCommand(slashCommand: SlashCommand) {
		this.selectSlashCommandEmitter.emit(slashCommand);
	}
}
