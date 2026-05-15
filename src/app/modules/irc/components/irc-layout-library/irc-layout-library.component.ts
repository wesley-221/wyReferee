import { Component, EventEmitter, Output } from '@angular/core';
import { IrcLayoutService } from '../../../../services/irc-layout.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetIrcLayoutDialogComponent } from '../../../../components/dialogs/reset-irc-layout-dialog/reset-irc-layout-dialog.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
	selector: 'app-irc-layout-library',
	templateUrl: './irc-layout-library.component.html',
	styleUrl: './irc-layout-library.component.scss'
})
export class IrcLayoutLibraryComponent {
	@Output() closeLayoutEditorEmitter = new EventEmitter<void>();

	layouts = this.ircLayoutService.layouts;

	hasChanged$	= this.ircLayoutService.hasChanges$;

	constructor(
		private dialog: MatDialog,
		private toastService: ToastService,
		private ircLayoutService: IrcLayoutService,
	) { }

	saveChanges() {
		this.ircLayoutService.commitChanges();
	}

	discardChanges() {
		this.ircLayoutService.discardChanges();
	}

	resetLayout() {
		const dialogRef = this.dialog.open(ResetIrcLayoutDialogComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result === true) {
				this.ircLayoutService.resetToDefault();
				this.toastService.addToast('Your IRC layout has been reset to the default configuration.');
			}
		});
	}

	closeLibrary() {
		this.closeLayoutEditorEmitter.emit();
	}

	onDragStarted() {
		document.body.classList.add('grabbing-cursor');
	}

	onDragEnded() {
		document.body.classList.remove('grabbing-cursor');
	}
}
