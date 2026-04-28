export const AppConfig = {
	production: false,
	environment: 'LOCAL',
	apiUrl: 'http://localhost:8080/',
	osu: {
		client_id: 8144,
		redirect_uri: 'http://localhost:3000/osu-oauth-callback'
	},
	links: {
		githubApiReleases: 'https://api.github.com/repos/wesley-221/wyReferee/releases',
		githubWiki: 'https://github.com/wesley-221/wyReferee/wiki',
		githubIssues: 'https://github.com/wesley-221/wyReferee/issues',
		discordServer: 'https://discord.gg/wEaXFJ58kE'
	}
};
