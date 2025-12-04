import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-changelog',
	templateUrl: './changelog.component.html',
	styleUrls: ['./changelog.component.scss']
})
export class ChangelogComponent implements OnInit {
	changelogReleases: { version: string; body: string }[];

	private readonly GIT_OWNER = 'wesley-221';
	private readonly GIT_REPOSITORY = 'wyReferee';
	private readonly GIT_RELEASE_URL = `https://api.github.com/repos/${this.GIT_OWNER}/${this.GIT_REPOSITORY}/releases`;

	constructor(private http: HttpClient) {
		this.changelogReleases = [];

		this.http.get(this.GIT_RELEASE_URL).subscribe((releases: any) => {
			for (const release of releases) {
				const newRelease: { version: string; body: string } = {
					version: null,
					body: null
				};

				newRelease.version = release.name;

				let body: string = release.body;

				body = body.replace(/@([a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38})/gi, match => {
					return `[${match}](https://github.com/${match.substring(1)})`;
				});

				newRelease.body = body;

				this.changelogReleases.push(newRelease);
			}
		});
	}

	ngOnInit(): void { }
}
