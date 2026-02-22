import { Socket } from "socket.io"
import { StoreGameSession } from "../store/memoryStore.js"

export const GameScoket = (io)=>{
    io.on("connection",(socket)=>{
        console.log("user Connected : ", socket.id )
        
        socket.on("Join_Game",({gameid, playerid})=>{
            const game = StoreGameSession(gameid)

            if(!game){
                return socket.emit("error",{
                    message : "Game Does not Exist"
                })
            }

            socket.join(gameid)
            console.log(`${playerid} joined ${gameid}`)

            io.to(gameid).emit("player_joined",{
                playerid,
                message :"Player joined the Game"
            })

            const room = io.sockets.adapter.rooms.get(gameid)

            if(room && room.size === 2) {
                console.log("both Players are joined --- starting Game Now")

                game.status = "playing"
                game.start_time = Date.now()

                io.to(gameid).emit("Game_Started",{
                    questions : game.questions
                })
            }
        })

        socket.on("Submit_answer",({gameid,playerid,questionid,answer})=>{
            console.log(`${playerid} answerd ${questionid}`)

            const game = StoreGameSession(gameid)

            if(!game){
                return socket.emit("error", {message : "Game not Found"})
            }
            if(game.status !== "playing"){
                return socket.emit("error",{
                    message : "Game not Started yet"
                })
            }
            
            if(!game.answers[playerid]){
                game.answers[playerid]=[]
            }

            // prevent duplicate answer
            const alreadyAnswered = game.answers[playerid].some(a=> a.questionid === questionid)
            
            if(alreadyAnswered){
                console.log("duplicate ans ignore")
                return
            }
            // find question 
            const question = game.questions.find(q =>q.id ==  questionid)

            if(!question){
                return socket.emit("error",{
                    message : "Invalid Question"
                })
            }

            //check correct ans
            const isCorrectans = question.correctanswers === answer

            if(isCorrectans){
                game.scores[playerid] += 1
            }
            console.log("Scores:", game.scores);    

            //store ans
            game.answers[playerid].push({
                questionid,
                answer,
                isCorrectans,
                answerAt : Date.now()
            })

            // display ans to all user real time 
            io.to(gameid).emit("answer_recived",{
                playerid,
                questionid,
                isCorrectans,
                score : game.scores[playerid]
            })
        })

        socket.on("disconnect",()=>{
                console.log("user Disconnected : ",socket.id)
        })
    })
}