export class Regex {
    static isLink = {
        regex: /(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*))/g,
        run: (message) => {
            const isLinkRegex = RegExp(Regex.isLink.regex).exec(message);

            if(isLinkRegex !== null) {
                return isLinkRegex;
            }

            return null;
        }
    }

    static isEmbedLink = {
        regexFullEmbed: /(\[https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*) .+\])/g,
        regexSplit: /\[(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)) (.+)\]/g,
        run: (message) => {
            const isEmbedLinkRegex = RegExp(Regex.isEmbedLink.regexFullEmbed).exec(message);

            if(isEmbedLinkRegex != null) {
                return isEmbedLinkRegex;
            }
            
            return null;
        }
    }

    static isListeningTo = {
        regex: /^(is listening to) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
        run: (message): { message: string, link: string, name: string } => {
            const isListeningToRegex = RegExp(Regex.isListeningTo.regex).exec(message);

            if(isListeningToRegex !== null) {
                return { message: isListeningToRegex[1], link: isListeningToRegex[2], name: isListeningToRegex[3] };
            }

            return null;
        }
    }

    static isEditing = {
        regex: /^(is editing) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
        run: (message): { message: string, link: string, name: string } => {
            const isEditingRegex = RegExp(Regex.isEditing.regex).exec(message);

            if(isEditingRegex !== null) {
                return { message: isEditingRegex[1], link: isEditingRegex[2], name: isEditingRegex[3] };
            }

            return null;
        }
    }

    static isPlaying = {
        regex: /^(is playing) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\](.+)?/,
        run: (message): { message: string, link: string, name: string } => {
            const isPlayingRegex = RegExp(Regex.isPlaying.regex).exec(message);

            if(isPlayingRegex !== null) {
                return { message: isPlayingRegex[1], link: isPlayingRegex[2], name: `${isPlayingRegex[3]}${isPlayingRegex[4] ? ' ' + isPlayingRegex[4] : ''}` };
            }

            return null;
        }
    }

    static isWatching = {
        regex: /^(is watching) \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\] .+/,
        run: (message): { message: string, link: string, name: string } => {
            const isWatchingChangeRegex = RegExp(Regex.isWatching.regex).exec(message);

            if(isWatchingChangeRegex !== null) {
                return { message: isWatchingChangeRegex[1], link: isWatchingChangeRegex[3], name: isWatchingChangeRegex[2] };
            }

            return null;
        }
    }

    static playerBeatmapChange = {
        regex: /^(Beatmap changed to:) (.+) \((https:\/\/osu\.ppy\.sh\/b\/\d+)\)/, 
        run: (message): { message: string, link: string, name: string } => {
            const playerBeatmapChangeRegex = RegExp(Regex.playerBeatmapChange.regex).exec(message);

            if(playerBeatmapChangeRegex !== null) {
                return { message: playerBeatmapChangeRegex[1], link: playerBeatmapChangeRegex[3], name: playerBeatmapChangeRegex[2] };
            }

            return null;
        }
    }

    static multiplayerInitialization = {
        regex: /^Team mode: (.+), Win condition: (.+)/,
        run: (message): { teamMode: string, winCondition: string } => {
            const multiplayerInitializationRegex = RegExp(Regex.multiplayerInitialization.regex).exec(message);

            if(multiplayerInitializationRegex !== null) {
                return { teamMode: multiplayerInitializationRegex[1], winCondition: multiplayerInitializationRegex[2] };
            }

            return null;
        }
    }

    static multiplayerMatchSize = {
        regex: /^Changed match to size ([0-9][0-9]?)/,
        run: (message): { size: number } => {
            const multiplayerMatchSizeRegex = RegExp(Regex.multiplayerMatchSize.regex).exec(message);

            if(multiplayerMatchSizeRegex !== null) {
                return { size: parseInt(multiplayerMatchSizeRegex[1]) };
            }

            return null;
        }
    }

    static multiplayerSettingsChange = {
        regex: /Changed match settings to ([0-9][0-9]?) slots, (.+), (.+)/,
        run: (message): { size: number, teamMode: string, winCondition: string } => {
            const multiplayerSettingsChange = RegExp(Regex.multiplayerSettingsChange.regex).exec(message);

            if(multiplayerSettingsChange !== null) {
                return { size: parseInt(multiplayerSettingsChange[1]), teamMode: multiplayerSettingsChange[2], winCondition: multiplayerSettingsChange[3] };
            }
            
            return null;
        }
    }

    static tournamentMatchCreated = {
        regex: /^Created the tournament match https:\/\/osu\.ppy\.sh\/mp\/(\d+).+/,
        run: (message): { multiplayerId: string } => { 
            const tournamentMatchCreated = RegExp(Regex.tournamentMatchCreated.regex).exec(message);

            if(tournamentMatchCreated !== null) {
                return { multiplayerId: tournamentMatchCreated[1] };
            }

            return null;
        }
    }

    static closedMatch = {
        regex: /^Closed the match/,
        run: (message): boolean => {
            return RegExp(Regex.closedMatch.regex).test(message);
        }
    }

    static matchFinished = {
        regex: /^The match has finished!/,
        run: (message): boolean => {
            return RegExp(Regex.matchFinished.regex).test(message);
        }
    }

    // TODO: refereeBeatmapChange
}
