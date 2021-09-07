import { Component } from '@angular/core';
import { IrcService } from './services/irc.service';
import { AuthenticateService } from './services/authenticate.service';
import { CacheService } from './services/cache.service';
import { GenericService } from './services/generic.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	clearDataBeforeVersion: string;

	constructor(private ircService: IrcService, private auth: AuthenticateService, private cacheService: CacheService, private genericService: GenericService) {
		const currentVersion = require('../../package.json').version;

		this.clearDataBeforeVersion = '5.5.0';

		if (cacheService.cacheVersion == undefined) {
			this.cacheService.clearAllData();
			this.cacheService.setCacheVersion(currentVersion);

			this.genericService.setCacheHasBeenChecked(true);
		}
		else {
			if (this.haveToClearCache(cacheService.cacheVersion)) {
				this.cacheService.clearAllData();
				this.cacheService.setCacheVersion(currentVersion);

				this.genericService.setCacheHasBeenChecked(true);
			}
			else {
				this.cacheService.setCacheVersion(currentVersion);

				this.genericService.setCacheHasBeenChecked(true);
			}
		}
	}

	private haveToClearCache(versionToCheck: string) {
		const versionToCheckSplit = versionToCheck.split('.').map(Number).reduce((a, b) => a + b, 0);
		const oldVersionSplit = this.clearDataBeforeVersion.split('.').map(Number).reduce((a, b) => a + b, 0);

		return versionToCheckSplit < oldVersionSplit;
	}
}
