import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-join-irc-channel',
	templateUrl: './join-irc-channel.component.html',
	styleUrls: ['./join-irc-channel.component.scss']
})
export class JoinIrcChannelComponent implements OnInit {
	validationForm: FormGroup;

	constructor(@Inject(MAT_DIALOG_DATA) public data: string, private dialogRef: MatDialogRef<JoinIrcChannelComponent>) {
		this.validationForm = new FormGroup({
			'channel-name': new FormControl('', Validators.required)
		});
	}

	@HostListener('window:keyup.Enter', ['$event'])
	onDialogClick(): void {
		this.dialogRef.close(this.getChannelName());
	}

	ngOnInit(): void { }

	getChannelName(): string {
		return this.validationForm.get('channel-name').value;
	}
}
