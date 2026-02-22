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
        scores : {},
        currentQuestionIndex : -1,
        questionTimer : null,
        start_time : null,
        status : "wating"
    }

    Players.forEach(Player => {
        GameData.answers[Player.playerId] = []
        GameData.scores[Player.playerId] = 0
    });

    CreateGameSession(gameid,GameData)
    return GameData
}