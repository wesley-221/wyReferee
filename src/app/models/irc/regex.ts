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

    // TODO: refereeBeatmapChange
}
