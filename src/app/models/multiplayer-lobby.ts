import { MultiplayerData } from "./multiplayer-data";
import { MultiplayerDataUser } from "./multiplayer-data-user";

export class MultiplayerLobby {
    lobbyId: number;
    description: string;
    multiplayerLink: string;
    teamOneName: string;
    teamTwoName: string;

    mapsCountTowardScore: number[];
    multiplayerData: MultiplayerData[];

    constructor() { 
        this.multiplayerData = [];
    }

    /**
     * Initialize the class from the given json file
     * @param json the json file we're loading from
     */
    loadFromJson(json: any) {
        this.lobbyId = json.data.lobbyId;
        this.description = json.data.description;
        this.multiplayerLink = json.data.multiplayerLink;
        this.teamOneName = json.data.teamOneName;
        this.teamTwoName = json.data.teamTwoName;

        this.mapsCountTowardScore = json.countForScore;

        for(let mpData in json.multiplayerData) {
            const currentMpData = json.multiplayerData[mpData];

            const newMpData = new MultiplayerData();

            newMpData.beatmap_id = currentMpData.beatmap_id;
            newMpData.mods = currentMpData.mods;
            newMpData.team_one_score = currentMpData.team_one_score;
            newMpData.team_two_score = currentMpData.team_two_score;

            for(let playerData in currentMpData) {
                if(["beatmap_id", "mods", "players", "team_one_score", "team_two_score"].indexOf(playerData) == -1) {
                    const newMpDataUser = new MultiplayerDataUser();

                    newMpDataUser.accuracy = currentMpData[playerData].accuracy;
                    newMpDataUser.mods = currentMpData[playerData].mods;
                    newMpDataUser.passed = currentMpData[playerData].passed;
                    newMpDataUser.score = currentMpData[playerData].score;
                    newMpDataUser.user = currentMpData[playerData].user;
                    newMpDataUser.slot = parseInt(playerData);

                    newMpData.addPlayer(newMpDataUser);
                }
            }

            this.multiplayerData.push(newMpData);
        }
    }

    /**
     * Convert a MultiplayerLobby to json file
     * @param multiplayerLobby the lobby to convert
     * 
     * TODO: add multiplayerData
     */
    convertToJson(multiplayerLobby: MultiplayerLobby = this): any {
        const lobby = {
            "data": {
                "lobbyId": multiplayerLobby.lobbyId,
                "description": multiplayerLobby.description,
                "multiplayerLink": multiplayerLobby.multiplayerLink,
                "teamOneName": multiplayerLobby.teamOneName,
                "teamTwoName": multiplayerLobby.teamTwoName
            },
            "countForScore": { },
            "multiplayerData": { }
        };

        if(multiplayerLobby.mapsCountTowardScore !== undefined) 
            lobby.countForScore = multiplayerLobby.mapsCountTowardScore;

        return lobby;
    }
}
