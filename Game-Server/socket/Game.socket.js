import { Socket } from "socket.io"
import { CreateGameSession, StoreGameSession } from "../store/memoryStore.js"
import { startGameSession } from "../services/gameSession.services.js"
import { startGameloop } from "../services/gameloop.services.js"

export const GameScoket = (io)=>{
    io.on("connection",(socket)=>{
        console.log("user Connected : ", socket.id )

        socket.on("create_game", async ({ playerid, level }) => {

        const game = await startGameSession(
            [{ playerId: playerid }],
            level
        );

        socket.join(game.gameid);

        socket.emit("game_created", {
            gameid: game.gameid
        });

            console.log("GAME CREATED:", game.gameid);
        });
        
        socket.on("Join_Game",({gameid, playerid})=>{
            const game = StoreGameSession(gameid)

            if(!game){
                return socket.emit("error",{
                    message : "Game Does not Exist"
                })
            }
            socket.join(gameid)
            console.log(`${playerid} joined ${gameid}`)
            
            game.scores[playerid] = 0;
            game.answers[playerid] = [];

            io.to(gameid).emit("player_joined",{
                playerid,
                message :"Player joined the Game"
            })

            const room = io.sockets.adapter.rooms.get(gameid)
            console.log("ROOM DATA:", room)
            console.log("ROOM SIZE:", room?.size)
            console.log("ROOM SOCKETS:", [...(room || [])])

            if(room && room.size === 2) {
                console.log("both Players are joined --- starting Game Now")

                game.status = "playing"
                game.start_time = Date.now()
                startGameloop(io, gameid)

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

            const currentQuestion = game.questions[game.currentQuestionIndex]

            if(currentQuestion.id != questionid){
                return socket.emit("error",{
                    message : "Not Current Question"
                })
            }

            if(game.questionTimer === null){
                return socket.emit("error",{
                    message : "Question Time Finsh"
                })
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