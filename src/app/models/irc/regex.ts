export class Regex {
    static isListeningTo = {
        regex: /is listening to \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
        run: (message): { link: string, name: string} => {
            const isListeningToRegex = RegExp(Regex.isListeningTo.regex).exec(message);

            if(isListeningToRegex !== null) {
                return { link: isListeningToRegex[1], name: isListeningToRegex[2] };
            }

            return null;
        }
    }

    static isEditing = {
        regex: /is editing \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\]/,
        run: (message): { link: string, name: string} => {
            const isEditingRegex = RegExp(Regex.isEditing.regex).exec(message);

            if(isEditingRegex !== null) {
                return { link: isEditingRegex[1], name: isEditingRegex[2] };
            }

            return null;
        }
    }

    static isPlaying = {
        regex: /^is playing \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\](.+)?/,
        run: (message): { link: string, name: string} => {
            const isPlayingRegex = RegExp(Regex.isPlaying.regex).exec(message);

            if(isPlayingRegex !== null) {
                return { link: isPlayingRegex[1], name: `${isPlayingRegex[2]}${isPlayingRegex[3] ? ' ' + isPlayingRegex[3] : ''}` };
            }

            return null;
        }
    }

    static isWatching = {
        regex: /is watching \[(https:\/\/osu\.ppy\.sh\/[b|s]\/\d+) (.+)\] .+/,
        run: (message): { link: string, name: string } => {
            const isWatchingChangeRegex = RegExp(Regex.playerBeatmapChange.regex).exec(message);

            if(isWatchingChangeRegex !== null) {
                return { link: isWatchingChangeRegex[2], name: isWatchingChangeRegex[1] };
            }

            return null;
        }
    }

    static playerBeatmapChange = {
        regex: /Beatmap changed to: (.+) \((https:\/\/osu\.ppy\.sh\/b\/\d+)\)/, 
        run: (message): { link: string, name: string} => {
            const playerBeatmapChangeRegex = RegExp(Regex.playerBeatmapChange.regex).exec(message);

            if(playerBeatmapChangeRegex !== null) {
                return { link: playerBeatmapChangeRegex[2], name: playerBeatmapChangeRegex[1] };
            }

            return null;
        }
    }

    // TODO: refereeBeatmapChange
}
