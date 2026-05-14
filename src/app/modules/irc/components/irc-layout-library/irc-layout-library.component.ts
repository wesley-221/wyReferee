import { Component, EventEmitter, Output } from '@angular/core';
import { IrcLayoutService } from '../../../../services/irc-layout.service';

@Component({
	selector: 'app-irc-layout-library',
	templateUrl: './irc-layout-library.component.html',
	styleUrl: './irc-layout-library.component.scss'
})
export class IrcLayoutLibraryComponent {
	@Output() closeLayoutEditorEmitter = new EventEmitter<void>();

	layouts = this.ircLayoutService.layouts;

	constructor(
		private ircLayoutService: IrcLayoutService
	) { }

	closeLayoutEditor() {
		this.closeLayoutEditorEmitter.emit();
	}
}
