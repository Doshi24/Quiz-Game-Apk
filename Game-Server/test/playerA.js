import { Socket } from "socket.io";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000")

socket.on("connect",()=>{
    console.log("player A joined ")

    socket.emit("Join_Game",{
        gameid : "game1771773104662",
        playerid :"A"
    })

})

socket.on("Game_Started",(data)=>{
    console.log("Game Started")
    console.log(data.questions)

    setTimeout(()=>{
        socket.emit("Submit_answer",{
            gameid : "game1771773104662",
            playerid : "A",
            questionid : 1,
            answer : "OptionA"
        })
    },3000)
})