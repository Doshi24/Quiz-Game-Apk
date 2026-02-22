import { Socket } from "socket.io"
import { StoreGameSession } from "../store/memoryStore.js"

export const GameScoket = (io)=>{
    io.on("connection",(socket)=>{
        console.log("user Connected : ", socket.id )
        
        socket.on("Join_Game",({gameid, playerid})=>{
            socket.join(gameid)
            console.log(`${playerid} joined ${gameid}`)

            io.to(gameid).emit("player_joined",{
                playerid,
                message :"Player joined the Game"
            })
        })

        socket.on("Submit_answer",({gameid,playerid,questionid,answer})=>{
            console.log(`${playerid} answerd ${questionid}`)

            const game = StoreGameSession(gameid)

            if(!game){
                return socket.emit("error", {message : "Game not Found"})
            }
            if(!game.answer[playerid]){
                game.answer[playerid]=[]
            }
            const alreadyAnswered = game.answers[playerid].some(a=> a.questionid === questionid)
            if(alreadyAnswered){
                console.log("duplicate ans ignore")
                return
            }
            game.answer[playerid].push({
                questionid,
                answer,
                answerAt : Date.now()
            })

            io.to(gameid).emit("answer_recived",{
                playerid,questionid
            })
        })

        socket.on("disconnect",()=>{
                console.log("user Disconnected : ",socket.id)
        })
    })
}