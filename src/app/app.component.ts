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

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	private versionCheckComplete = false;

	constructor(private ircService: IrcService, private authService: AuthenticateService, private settingsStore: SettingsStoreService, private cacheService: CacheService, private dialog: MatDialog, private ngZone: NgZone, private router: Router) {
		const currentVersion = PackageJson.version;

		this.settingsStore.watchSettings().pipe(
			filter(settings => settings != null && !this.versionCheckComplete),
			take(1)
		).subscribe(settings => {
			if (settings) {
				if (settings.version == undefined) {
					this.settingsStore.set('version', currentVersion);
				}

				// Check whether to show the changelog
				if (gt(currentVersion, settings.version)) {
					this.settingsStore.set('version', currentVersion);
					this.router.navigate(['changelog', 'information']);
				}

				this.versionCheckComplete = true;
			}
		});

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
	}
}
