import { Component, NgZone, OnInit } from '@angular/core';
import { IrcService } from './services/irc.service';
import { AuthenticateService } from './services/authenticate.service';
import { CacheService } from './services/cache.service';
import { gt } from 'semver';
import { Router } from '@angular/router';
import { SettingsStoreService } from './services/storage/settings-store.service';
import { filter, take } from 'rxjs';
import PackageJson from '../../package.json';
import { MatDialog } from '@angular/material/dialog';
import { DataMigrationDialogComponent } from './components/dialogs/data-migration-dialog/data-migration-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from '../environments/environment';
import { NewUpdateDialogComponent } from './components/dialogs/new-update-dialog/new-update-dialog.component';
import { TournamentService } from './services/tournament.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private versionCheckComplete = false;
	private isProduction = AppConfig.production;
	private currentVersion = PackageJson.version;

	constructor(
		private ircService: IrcService,
		private authService: AuthenticateService,
		private settingsStore: SettingsStoreService,
		private tournamentService: TournamentService,
		private cacheService: CacheService,
		private dialog: MatDialog,
		private ngZone: NgZone,
		private router: Router
	) {
		this.settingsStore.watchSettings().pipe(
			filter(settings => settings != null && !this.versionCheckComplete),
			take(1)
		).subscribe(settings => {
			if (settings) {
				if (settings.version == undefined) {
					this.settingsStore.set('version', this.currentVersion);
				}

				// Check whether to show the changelog
				if (gt(this.currentVersion, settings.version)) {
					this.settingsStore.set('version', this.currentVersion);
					this.router.navigate(['changelog', 'information']);
				}

				this.versionCheckComplete = true;
			}
		});

		this.tournamentService.loadTournaments();

		this.authService.getMeData().subscribe({
			next: user => {
				this.authService.loginUser(user);
			},
			error: (error: HttpErrorResponse) => {
				console.warn(error.error.message);
			}
		});
	}

	ngOnInit(): void {
		window.electronApi.dataMigration.checkForMigrationsAndNotify();

		window.electronApi.dataMigration.migrationNeeded(() => {
			this.ngZone.run(() => {
				this.dialog.open(DataMigrationDialogComponent);
			});
		});

		if (this.isProduction) {
			window.electronApi.autoUpdater.checkForUpdates();
		}

		window.electronApi.autoUpdater.updateAvailable((info) => {
			this.dialog.open(NewUpdateDialogComponent, {
				disableClose: true,
				width: '620px',
				maxWidth: 'calc(100vw - 40px)',
				data: {
					info: info,
					currentVersion: this.currentVersion
				}
			});
		});
	}
}
