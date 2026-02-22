import { CreateGameSession } from "../store/memoryStore.js";
import { GenerateQuiz } from "./quiz.services.js";

export const startGameSession = async(Players,level)=>{

    const gameid = `game${Date.now()}`
    const questions = await GenerateQuiz(level)
    const GameData = {
        gameid,
        level,
        Players,
        questions,
        answers : {},
        start_time : Date.now(),
        status : "active"
    }

    Players.forEach(Player => {
        GameData.answers[Player.PlayerId] = []
    });

    CreateGameSession(gameid,GameData)
    return GameData
}