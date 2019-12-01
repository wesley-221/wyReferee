import { MultiplayerData } from "./multiplayer-data";
import { MultiplayerDataUser } from "./multiplayer-data-user";
import { Mappool } from "../osu-mappool/mappool";

export class MultiplayerLobby {
    lobbyId: number;
    description: string;
    multiplayerLink: string;
    tournamentAcronym: string;
    teamOneName: string;
    teamTwoName: string;
    teamOneScore: number = 0;
    teamTwoScore: number = 0;
    teamSize: number;
    webhook: string;
    mappool: Mappool = null;
    mappoolId: number = null;
    ircChannel: string;
    ircConnected: boolean = false;

    firstPick: string;
    bestOf: number;

    teamOneBanOne: number;
    teamOneBanTwo: number;
    teamTwoBanOne: number;
    teamTwoBanTwo: number;

    mapsCountTowardScore: {} = {};
    multiplayerData: MultiplayerData[];

    constructor() { 
        this.multiplayerData = [];
    }

    existMpData(multiplayerData: MultiplayerData): boolean {
        for(let mpData in this.multiplayerData)
            if(this.multiplayerData[mpData].game_id == multiplayerData.game_id) {
                return true;
        }

        return false;
    }

    updateMpData(multiplayerData: MultiplayerData): void {        
        for(let mpData in this.multiplayerData) {
            if(this.multiplayerData[mpData].game_id == multiplayerData.game_id) {
                this.multiplayerData[mpData] = multiplayerData;
                return;
            }
        }
    }

    addMpData(multiplayerData: MultiplayerData) {
        this.multiplayerData.push(multiplayerData);
    }

    /**
     * Initialize the class from the given json file
     * @param json the json file we're loading from
     */
    loadFromJson(json: any) {
        this.lobbyId = json.data.lobbyId;
        this.description = json.data.description;
        this.multiplayerLink = json.data.multiplayerLink;
        this.tournamentAcronym = json.data.tournamentAcronym;
        this.teamOneName = json.data.teamOneName;
        this.teamTwoName = json.data.teamTwoName;
        this.teamSize = json.data.teamSize;
        this.webhook = json.data.webhook;
        this.mappoolId = json.data.selectedMappoolId;
       
        this.firstPick = json.data.firstPick;
        this.bestOf = json.data.bestOf;
        this.teamOneBanOne = json.data.teamOneBanOne;
        this.teamOneBanTwo = json.data.teamOneBanTwo;
        this.teamTwoBanOne = json.data.teamTwoBanOne;
        this.teamTwoBanTwo = json.data.teamTwoBanTwo;

        this.mapsCountTowardScore = json.countForScore;

        for(let mpData in json.multiplayerData) {
            const currentMpData = json.multiplayerData[mpData];

            const newMpData = new MultiplayerData();

            newMpData.game_id = parseInt(mpData);
            newMpData.beatmap_id = currentMpData.beatmap_id;
            newMpData.mods = currentMpData.mods;
            newMpData.team_one_score = currentMpData.team_one_score;
            newMpData.team_two_score = currentMpData.team_two_score;

            // Add team score if it counts towards the score
            if(newMpData.team_one_score > newMpData.team_two_score) {
                if(this.mapsCountTowardScore.hasOwnProperty(newMpData.game_id) && this.mapsCountTowardScore[newMpData.game_id] == true) {
                    this.teamOneScore ++;
                }
            }
            else {
                if(this.mapsCountTowardScore.hasOwnProperty(newMpData.game_id) && this.mapsCountTowardScore[newMpData.game_id] == true) {
                    this.teamTwoScore ++;
                }
            }

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
     */
    convertToJson(multiplayerLobby: MultiplayerLobby = this): any {
        const lobby = {
            "data": {
                "lobbyId": multiplayerLobby.lobbyId,
                "description": multiplayerLobby.description,
                "multiplayerLink": multiplayerLobby.multiplayerLink,
                "tournamentAcronym": multiplayerLobby.tournamentAcronym,
                "teamOneName": multiplayerLobby.teamOneName,
                "teamTwoName": multiplayerLobby.teamTwoName,
                "teamSize": multiplayerLobby.teamSize,
                "webhook": multiplayerLobby.webhook,
                "selectedMappoolId": (multiplayerLobby.mappool == null) ? -1 : multiplayerLobby.mappool.id,
                "firstPick": multiplayerLobby.firstPick,
                "bestOf": multiplayerLobby.bestOf,
                "teamOneBanOne": multiplayerLobby.teamOneBanOne,
                "teamOneBanTwo": multiplayerLobby.teamOneBanTwo,
                "teamTwoBanOne": multiplayerLobby.teamTwoBanOne,
                "teamTwoBanTwo": multiplayerLobby.teamTwoBanTwo
            },
            "countForScore": { },
            "multiplayerData": { }
        };

        if(multiplayerLobby.mapsCountTowardScore !== undefined) 
            lobby.countForScore = multiplayerLobby.mapsCountTowardScore;
        
        for(let match in multiplayerLobby.multiplayerData) {
            const currentMatch = multiplayerLobby.multiplayerData[match];
            lobby.multiplayerData[currentMatch.game_id] = { };
            const allPlayers = currentMatch.getPlayers();

            for(let score in allPlayers) {
                lobby.multiplayerData[currentMatch.game_id][allPlayers[score].slot] = {
                    "user": allPlayers[score].user,
                    "score": allPlayers[score].score,
                    "accuracy": allPlayers[score].accuracy,
                    "passed": allPlayers[score].passed,
                    "mods": allPlayers[score].mods
                }
            }

            lobby.multiplayerData[currentMatch.game_id].beatmap_id = currentMatch.beatmap_id;
            lobby.multiplayerData[currentMatch.game_id].team_one_score = currentMatch.team_one_score;
            lobby.multiplayerData[currentMatch.game_id].team_two_score = currentMatch.team_two_score;
            lobby.multiplayerData[currentMatch.game_id].mods = currentMatch.mods;
        }

        return lobby;
    }
}
