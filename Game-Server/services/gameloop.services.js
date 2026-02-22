import { StoreGameSession } from "../store/memoryStore.js";

export const  startGameloop = (io,gameid)=>{
    const game = StoreGameSession(gameid)

    if(!game) return

    game.status = "playing"
    game.currentQuestionIndex = -1

    nextQuestion(io,gameid)
}


const nextQuestion = (io,gameid) =>{
    const game = StoreGameSession(gameid)

    game.currentQuestionIndex++

    if(game.currentQuestionIndex >= game.questions.length){
        return finsihGame(io,gameid)
    }

    const question = game.questions[game.currentQuestionIndex]
    console.log("sending Questions : ",question)

    io.to(gameid).emit("new_questions",{
        questionNumber : game.currentQuestionIndex + 1,
        question
    })

    game.questionTimer = setTimeout(()=>{
        nextQuestion(io,gameid)
    },10000)
}


const finsihGame = (io,gameid) =>{
    const game = StoreGameSession(gameid)

    game.status = "finished"

    const players = Object.keys(game.scores)

    let winner = "Draw"

    if(game.scores[players[0]]> game.scores[players[1]]){
        winner = players[0]
    }else if (game.scores[players[1]] > game.scores[players[0]]){
        winner = players[1]
    }

    io.to(gameid).emit("Game_finished",{
        scores : game.scores,
        winner
    })

    console.log("Game Finished : ", winner)
}