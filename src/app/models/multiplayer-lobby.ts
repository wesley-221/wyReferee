export class MultiplayerLobby {
    lobbyId: number;
    description: string;
    multiplayerLink: string;
    teamOneName: string;
    teamTwoName: string;

    mapsCountTowardScore: number[];

    constructor() { }

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
