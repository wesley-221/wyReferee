import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-data-migration-dialog',
	templateUrl: './data-migration-dialog.component.html',
	styleUrls: ['./data-migration-dialog.component.scss']
})
export class DataMigrationDialogComponent implements OnInit {
	migrationOptionsFormGroup: FormGroup;
	dataOptionsFormGroup: FormGroup;

	isMigrating: boolean;
	migrationSuccessful: boolean;
	migrationLog: { status: string; message: string }[];

	constructor() {
		this.migrationOptionsFormGroup = new FormGroup({
			'webhook-customization': new FormControl(false),
			'tournaments': new FormControl(false),
			'lobbies': new FormControl(false),
			'irc-channels': new FormControl(false),
			'irc-shortcut-commands': new FormControl(false)
		});

		this.dataOptionsFormGroup = new FormGroup({
			'keep-data-backup': new FormControl(null, Validators.required)
		});

		this.isMigrating = false
		this.migrationSuccessful = false;
	}

	ngOnInit(): void { }

	migrateData() {
		if (this.migrationOptionsFormGroup.invalid || this.dataOptionsFormGroup.invalid) {
			this.migrationOptionsFormGroup.markAllAsTouched();
			this.dataOptionsFormGroup.markAllAsTouched();

			return;
		}

		this.isMigrating = true;

		window.electronApi.dataMigration.startDataMigration(
			{
				webhookCustomization: this.migrationOptionsFormGroup.controls['webhook-customization'].value,
				tournaments: this.migrationOptionsFormGroup.controls['tournaments'].value,
				lobbies: this.migrationOptionsFormGroup.controls['lobbies'].value,
				ircChannels: this.migrationOptionsFormGroup.controls['irc-channels'].value,
				ircShortcutCommands: this.migrationOptionsFormGroup.controls['irc-shortcut-commands'].value,
				keepDataBackup: this.dataOptionsFormGroup.controls['keep-data-backup'].value
			},
		).then((updatedMigrations: { status: string; message: string }[]) => {
			this.isMigrating = false;

			this.migrationSuccessful = true;
			this.migrationLog = updatedMigrations;
		});
	}

	restartClient() {
		window.electronApi.dataMigration.restartAppAfterMigration();
	}
}
