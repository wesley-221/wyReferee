[![Made with Angular](https://img.shields.io/badge/Built%20with-Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Electron](https://img.shields.io/badge/Electron-202020?style=flat&logo=electron&logoColor=9FEAF9)](https://www.electronjs.org/)
[![MIT License](https://img.shields.io/github/license/wesley-221/wyReferee)](./LICENSE)
[![Discord](https://img.shields.io/discord/1078366521916666048?label=Join%20Discord&logo=discord&color=5865F2)](https://discord.gg/wEaXFJ58kE)

# wyReferee
**wyReferee** is a cross-platform referee client for osu! tournaments, designed to help you manage your matches with ease and automation.

<p align="center">
	<img src="./src/assets/screenshots/irc.png" alt="IRC" width="48%" />
	<img src="./src/assets/screenshots/mappool-management.png" alt="Tournament management" width="48%" />
</p>

## Features

### IRC
- Full IRC functionality.
- Match progression tracking:
	- Live score updates.
	- Tracks picked/banned maps.
	- Indicates which player/team picks next.
- Clickable beatmap list for the current match stage.
- Recognizes and hyperlinks messages like `NM1`, `DT3`, `FM4`, etc.
- Player invite buttons for current match participants.

### Tournament Management
- Manage your tournament by adding referees, participants, and mappools to automate referee tasks.
- Configure webhooks to notify specific Discord channels of match events (e.g., match creation, beatmap picks/bans, match completion).
- Send conditional messages to the multiplayer lobby triggered by match events.
	- Fully customizable using variables. Example: `Score: {{ beatmapTeamOneScore }} - {{ beatmapTeamTwoScore }} | score difference: {{ scoreDifference }}` becomes `Score: 989 323 - 222 541 | score difference: 766 782`
- Mappool configuration per stage:
	- Each stage has its own mappool.
	- Mod brackets can specify their own mods, applied alongside the selected beatmap.

### Custom Score System Support
- Modify how scores are calculated in real time.
- Adjust score modifiers (e.g., HardRock: `1.78x`, Hidden: `2.23x`).
- Fully customizable score calculation systems. See [this example](https://osu.ppy.sh/community/forums/topics/1874028?n=1) (under the calculations header).
- _Note: Custom score systems may require development. If you need something specific, please ask in advance. If you're a developer (or know someone who is), feel free to ask for help in the [Discord server](https://discord.gg/wEaXFJ58kE)._

### wyBin Integration
- Import staff, participants, stages, and mappools directly from your wyBin tournament.
- Submit match results (scores, bans, stats) from wyReferee to wyBin with one click.

## Download
Visit the [Releases](https://github.com/wesley-221/wyReferee/releases) page to download the installer.

## Contribute
See [CONTRIBUTING.md](./CONTRIBUTING.md) for instructions on contributing code or reporting bugs.
