import { Component } from '@angular/core';
import { IrcService } from './services/irc.service';
import { AuthenticateService } from './services/authenticate.service';
import { CacheService } from './services/cache.service';
import { GenericService } from './services/generic.service';
import { gte, gt } from 'semver';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	clearDataBeforeVersion: string;

	constructor(private ircService: IrcService, private auth: AuthenticateService, private cacheService: CacheService, private genericService: GenericService, private router: Router) {
		const currentVersion = require('../../package.json').version;

		this.clearDataBeforeVersion = '5.5.0';

		if (cacheService.cacheVersion == undefined) {
			this.cacheService.setCacheVersion(currentVersion);

			this.genericService.setCacheHasBeenChecked(true);
		}
		else {
			if (!gte(cacheService.cacheVersion, this.clearDataBeforeVersion)) {
				this.cacheService.clearAllData();
				this.cacheService.setCacheVersion(currentVersion);

				this.genericService.setCacheHasBeenChecked(true);
			}
			else {
				this.cacheService.setCacheVersion(currentVersion);
				this.genericService.setCacheHasBeenChecked(true);
			}
		}

		this.showChangelog(currentVersion);
	}

	/**
	 * Show the changelog if a newer version has been downloaded
	 *
	 * @param currentVersion the current version of wyReferee
	 */
	showChangelog(currentVersion: string): void {
		const lastVersion = this.cacheService.getVersion();

		if (lastVersion == undefined) {
			this.cacheService.setVersion(currentVersion);
			this.router.navigate(['changelog', 'information']);
		}
		else {
			if (gt(currentVersion, lastVersion)) {
				this.cacheService.setVersion(currentVersion);
				this.router.navigate(['changelog', 'information']);
			}
		}
	}
}
