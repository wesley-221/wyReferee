import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-changelog',
	templateUrl: './changelog.component.html',
	styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {
	private readonly GIT_OWNER = 'wesley-221';
	private readonly GIT_REPOSITORY = 'wyReferee';
	private readonly GIT_RELEASE_URL = `https://api.github.com/repos/${this.GIT_OWNER}/${this.GIT_REPOSITORY}/releases`;

	changelogReleases: { version: string; body: string; }[];

	constructor(private http: HttpClient) {
		this.changelogReleases = [];

		this.http.get(this.GIT_RELEASE_URL).subscribe((releases: any) => {
			for (const release of releases) {
				const newRelease: { version: string; body: string; } = {
					version: null,
					body: null
				};

				newRelease.version = release.name;

				let body: string = release.body;
				let allUsernameMatches = body.match(/@([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})/gi);
				allUsernameMatches = [...new Set(allUsernameMatches)];

				for (const username of allUsernameMatches) {
					body = body.replace(new RegExp(username, 'g'), `[${username}](https://github.com/${username.substring(1, username.length)})`);
				}

				newRelease.body = body;

				this.changelogReleases.push(newRelease);
			}
		});
	}

	ngOnInit(): void { }
}
