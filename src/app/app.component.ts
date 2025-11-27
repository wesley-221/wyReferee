import { Component, NgZone, OnInit } from '@angular/core';
import { IrcService } from './services/irc.service';
import { AuthenticateService } from './services/authenticate.service';
import { CacheService } from './services/cache.service';
import { GenericService } from './services/generic.service';
import { gte, gt } from 'semver';
import { Router } from '@angular/router';
import { ToastService } from './services/toast.service';
import { ToastType } from './models/toast';
import { SettingsStoreService } from './services/storage/settings-store.service';
import { filter, take } from 'rxjs';
import PackageJson from '../../package.json';
import { MatDialog } from '@angular/material/dialog';
import { DataMigrationDialogComponent } from './components/dialogs/data-migration-dialog/data-migration-dialog.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	clearDataBeforeVersion: string;
	private versionCheckComplete = false;

	constructor(private ircService: IrcService, private authService: AuthenticateService, private settingsStore: SettingsStoreService, private cacheService: CacheService, private dialog: MatDialog, private ngZone: NgZone, private genericService: GenericService, private router: Router, private toastService: ToastService) {
		const currentVersion = PackageJson.version;

		this.clearDataBeforeVersion = '6.6.0';

		settingsStore.watchSettings().pipe(
			filter(settings => settings != null && !this.versionCheckComplete),
			take(1)
		).subscribe(settings => {
			if (settings) {
				// Set default values for versions
				if (settings.cacheVersion == undefined) {
					settingsStore.set('cacheVersion', currentVersion);
				}

				if (settings.version == undefined) {
					settingsStore.set('version', currentVersion);
				}

				// Check if cache has to be cleared
				if (!gte(settings.cacheVersion, this.clearDataBeforeVersion)) {
					// TODO: update this to clear all data when the other store services are available
					this.cacheService.clearAllData();
					settingsStore.set('cacheVersion', currentVersion);

					this.toastService.addToast('Your local data has been cleared. This is because a new update has been pushed which could cause problems because of your local data. Make sure to import your tournament(s) again!', ToastType.Warning, 30);

					this.genericService.setCacheHasBeenChecked(true);
				}
				else {
					settingsStore.set('cacheVersion', currentVersion);
					this.genericService.setCacheHasBeenChecked(true);
				}

				// Check whether to show the changelog
				if (gt(currentVersion, settings.version)) {
					settingsStore.set('version', currentVersion);
					this.router.navigate(['changelog', 'information']);
				}

				this.versionCheckComplete = true;
			}
		});

		authService.getMeData().subscribe(user => {
			this.authService.loginUser(user);
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
