export class Regex {
	static isLink = {
		// regex: /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))/g,
		regex: /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*))/g,
		run: (message: string) => {
			const isLinkRegex = RegExp(Regex.isLink.regex).exec(message);

			if (isLinkRegex !== null) {
				return isLinkRegex;
			}

			return null;
		}
	};

	static isEmbedLink = {
		// regexFullEmbed: /(\[https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*) .+\])/g,
		// regexSplit: /\[(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)) (.+)\]/g,
		regexFullEmbed: /(\[https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*) .+\])/g,
		regexSplit: /\[(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)) (.+)\]/g,
		run: (message: string) => {
			const isEmbedLinkRegex = RegExp(Regex.isEmbedLink.regexFullEmbed).exec(message);

			if (isEmbedLinkRegex != null) {
				return isEmbedLinkRegex;
			}

			return null;
		}
	};

	static isListeningTo = {
		regex: /^(is listening to) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
		run: (message: string): { message: string; link: string; name: string } => {
			const isListeningToRegex = RegExp(Regex.isListeningTo.regex).exec(message);

			if (isListeningToRegex !== null) {
				return { message: isListeningToRegex[1], link: isListeningToRegex[2], name: isListeningToRegex[3] };
			}

			return null;
		}
	};

	static isEditing = {
		regex: /^(is editing) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
		run: (message: string): { message: string; link: string; name: string } => {
			const isEditingRegex = RegExp(Regex.isEditing.regex).exec(message);

			if (isEditingRegex !== null) {
				return { message: isEditingRegex[1], link: isEditingRegex[2], name: isEditingRegex[3] };
			}

			return null;
		}
	};

	static isPlaying = {
		regex: /^(is playing) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\](.+)?/,
		run: (message: string): { message: string; link: string; name: string } => {
			const isPlayingRegex = RegExp(Regex.isPlaying.regex).exec(message);

			if (isPlayingRegex !== null) {
				return { message: isPlayingRegex[1], link: isPlayingRegex[2], name: `${isPlayingRegex[3]}${isPlayingRegex[4] ? ' ' + isPlayingRegex[4] : ''}` };
			}

			return null;
		}
	};

	static isWatching = {
		regex: /^(is watching) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\] .+/,
		run: (message: string): { message: string; link: string; name: string } => {
			const isWatchingChangeRegex = RegExp(Regex.isWatching.regex).exec(message);

			if (isWatchingChangeRegex !== null) {
				return { message: isWatchingChangeRegex[1], link: isWatchingChangeRegex[3], name: isWatchingChangeRegex[2] };
			}

			return null;
		}
	};

	static playerBeatmapChange = {
		regex: /^(Beatmap changed to:) (.+) \((https:\/\/osu\.ppy\.sh\/b\/\d+)\)/,
		run: (message: string): { message: string; link: string; name: string } => {
			const playerBeatmapChangeRegex = RegExp(Regex.playerBeatmapChange.regex).exec(message);

			if (playerBeatmapChangeRegex !== null) {
				return { message: playerBeatmapChangeRegex[1], link: playerBeatmapChangeRegex[3], name: playerBeatmapChangeRegex[2] };
			}

			return null;
		}
	};

	static multiplayerInitialization = {
		regex: /^Team mode: (.+), Win condition: (.+)/,
		run: (message: string): { teamMode: string; winCondition: string } => {
			const multiplayerInitializationRegex = RegExp(Regex.multiplayerInitialization.regex).exec(message);

			if (multiplayerInitializationRegex !== null) {
				return { teamMode: multiplayerInitializationRegex[1], winCondition: multiplayerInitializationRegex[2] };
			}

			return null;
		}
	};

	static multiplayerMatchSize = {
		regex: /^Changed match to size ([0-9][0-9]?)/,
		run: (message: string): { size: number } => {
			const multiplayerMatchSizeRegex = RegExp(Regex.multiplayerMatchSize.regex).exec(message);

			if (multiplayerMatchSizeRegex !== null) {
				return { size: parseInt(multiplayerMatchSizeRegex[1]) };
			}

			return null;
		}
	};

	static multiplayerSettingsChange = {
		regex: /Changed match settings to ([0-9][0-9]?) slots, (.+), (.+)/,
		run: (message: string): { size: number; teamMode: string; winCondition: string } => {
			const multiplayerSettingsChange = RegExp(Regex.multiplayerSettingsChange.regex).exec(message);

			if (multiplayerSettingsChange !== null) {
				return { size: parseInt(multiplayerSettingsChange[1]), teamMode: multiplayerSettingsChange[2], winCondition: multiplayerSettingsChange[3] };
			}

			return null;
		}
	};

	static tournamentMatchCreated = {
		regex: /^Created the tournament match https:\/\/osu\.ppy\.sh\/mp\/(\d+).+/,
		run: (message: string): { multiplayerId: string } => {
			const tournamentMatchCreated = RegExp(Regex.tournamentMatchCreated.regex).exec(message);

			if (tournamentMatchCreated !== null) {
				return { multiplayerId: tournamentMatchCreated[1] };
			}

			return null;
		}
	};

	static closedMatch = {
		regex: /^Closed the match/,
		run: (message: string): boolean => RegExp(Regex.closedMatch.regex).test(message)
	};

	static matchFinished = {
		regex: /^The match has finished!/,
		run: (message: string): boolean => RegExp(Regex.matchFinished.regex).test(message)
	};

	static playerInSlot = {
		regexTeam: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[Team\s+(Blue|Red)\s?\]/,
		regexTeamHost: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[(Host)\s+\/\s+Team\s+(Blue|Red)\s?\]/,
		regexTeamHostMods: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[(Host)\s+\/\s+Team\s+(Blue|Red)\s+\/\s+(.*)\]/,
		regexTeamMods: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[Team\s+(Blue|Red)\s+\/\s+(.*)\]/,
		regexSolo: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s*$/,
		regexSoloHost: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[(Host)]/,
		regexSoloHostMods: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[(Host)\s+\/\s+(.*)\]/,
		regexSoloMods: /^Slot\s+(\d+)\s+([a-zA-Z\s]+)\s+https:\/\/osu\.ppy\.sh\/u\/\d+\s+(\S*)\s+\[(.*)\]/,
		run: (message: string): { type: string; slotId: number; status: string; username: string; host: boolean; team: string; mods: string } => {
			const regexTeamRegex = RegExp(Regex.playerInSlot.regexTeam).exec(message);

			if (regexTeamRegex !== null) {
				return { type: 'regexTeam', slotId: parseInt(regexTeamRegex[1]), status: regexTeamRegex[2], username: regexTeamRegex[3], team: regexTeamRegex[4], host: false, mods: 'none' };
			}

			const regexTeamModsRegex = RegExp(Regex.playerInSlot.regexTeamMods).exec(message);

			if (regexTeamModsRegex !== null) {
				return { type: 'regexTeamMods', slotId: parseInt(regexTeamModsRegex[1]), status: regexTeamModsRegex[2], username: regexTeamModsRegex[3], team: regexTeamModsRegex[4], mods: regexTeamModsRegex[5], host: false };
			}

			const regexTeamHostRegex = RegExp(Regex.playerInSlot.regexTeamHost).exec(message);

			if (regexTeamHostRegex !== null) {
				return { type: 'regexTeamHost', slotId: parseInt(regexTeamHostRegex[1]), status: regexTeamHostRegex[2], username: regexTeamHostRegex[3], team: regexTeamHostRegex[5], host: true, mods: 'none' };
			}

			const regexTeamHostModsRegex = RegExp(Regex.playerInSlot.regexTeamHostMods).exec(message);

			if (regexTeamHostModsRegex !== null) {
				return { type: 'regexTeamHost', slotId: parseInt(regexTeamHostModsRegex[1]), status: regexTeamHostModsRegex[2], username: regexTeamHostModsRegex[3], team: regexTeamHostModsRegex[5], host: true, mods: regexTeamHostModsRegex[6] };
			}

			const regexSoloRegex = RegExp(Regex.playerInSlot.regexSolo).exec(message);

			if (regexSoloRegex !== null) {
				return { type: 'regexSolo', slotId: parseInt(regexSoloRegex[1]), status: regexSoloRegex[2], username: regexSoloRegex[3], team: null, host: false, mods: 'none' };
			}

			const regexSoloModsRegex = RegExp(Regex.playerInSlot.regexSoloMods).exec(message);

			if (regexSoloModsRegex !== null) {
				// User is the host of the match
				if (regexSoloModsRegex[4].indexOf('Host') > -1) {
					const regexSoloHostRegex = RegExp(Regex.playerInSlot.regexSoloHost).exec(message);

					if (regexSoloHostRegex !== null) {
						return { type: 'regexSoloHost', slotId: parseInt(regexSoloHostRegex[1]), status: regexSoloHostRegex[2], username: regexSoloHostRegex[3], team: null, host: true, mods: 'none' };
					}

					const regexSoloHostModsRegex = RegExp(Regex.playerInSlot.regexSoloHostMods).exec(message);

					if (regexSoloHostModsRegex !== null) {
						return { type: 'regexSoloHostMods', slotId: parseInt(regexSoloHostModsRegex[1]), status: regexSoloHostModsRegex[2], username: regexSoloHostModsRegex[3], team: null, host: true, mods: regexSoloHostModsRegex[5] };
					}
				}
				// User is not the host of the match
				else {
					return { type: 'regexSoloHostMods', slotId: parseInt(regexSoloModsRegex[1]), status: regexSoloModsRegex[2], username: regexSoloModsRegex[3], team: null, host: false, mods: regexSoloModsRegex[4] };
				}
			}

			return null;
		}
	};

	static playerHasMoved = {
		regex: /^(.*) moved to slot (\d+)/,
		run: (message: string): { slotId: number; username: string } => {
			const playerHasMovedRegex = RegExp(Regex.playerHasMoved.regex).exec(message);

			if (playerHasMovedRegex !== null) {
				return { slotId: parseInt(playerHasMovedRegex[2]), username: playerHasMovedRegex[1] };
			}

			return null;
		}
	};

	static hostChanged = {
		regex: /^Changed match host to (.*)/,
		run: (message: string): { newHost: string } => {
			const hostChangedRegex = RegExp(Regex.hostChanged.regex).exec(message);

			if (hostChangedRegex !== null) {
				return { newHost: hostChangedRegex[1] };
			}

			return null;
		}
	};

	static playerHasChangedTeam = {
		regex: /^(.*) changed to (Red|Blue)/,
		run: (message: string): { username: string; team: string } => {
			const playerHasChangedTeamRegex = RegExp(Regex.playerHasChangedTeam.regex).exec(message);

			if (playerHasChangedTeamRegex !== null) {
				return { username: playerHasChangedTeamRegex[1], team: playerHasChangedTeamRegex[2] };
			}

			return null;
		}
	};

	static clearMatchHost = {
		regex: /^Cleared match host/,
		run: (message: string): boolean => {
			const clearMatchHostRegex = RegExp(Regex.clearMatchHost.regex).exec(message);

			if (clearMatchHostRegex !== null) {
				return true;
			}

			return null;
		}
	};

	static playerLeft = {
		regex: /^(.*) left the game/,
		run: (message: string): { username: string } => {
			const playerLeftRegex = RegExp(Regex.playerLeft.regex).exec(message);

			if (playerLeftRegex !== null) {
				return { username: playerLeftRegex[1] };
			}

			return null;
		}
	};

	static playerJoined = {
		regex: /^(.*) joined in slot (\d) for team (blue|red)./,
		run: (message: string): { username: string; slot: number; team: string } => {
			const playerJoinedRegex = RegExp(Regex.playerJoined.regex).exec(message);

			if (playerJoinedRegex !== null) {
				const team = playerJoinedRegex[3] == 'blue' ? 'Blue' : 'Red';
				return { username: playerJoinedRegex[1], slot: parseInt(playerJoinedRegex[2]), team: team };
			}

			return null;
		}
	};

	static multiplayerLobbyMod = {
		test: (regexp: RegExp, message: string): boolean => {
			const multiplayerModRegex = regexp.test(message);

			if (multiplayerModRegex) {
				return multiplayerModRegex;
			}

			return false;
		},
		run: (regexp: RegExp, message: string): any => {
			const multiplayerModRegex = regexp.exec(message);

			if (multiplayerModRegex) {
				return multiplayerModRegex;
			}

			return null;
		}
	};
}
