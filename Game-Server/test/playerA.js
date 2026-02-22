import { Socket } from "socket.io";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000")

socket.on("connect",()=>{
    console.log("player  A joined ")

    socket.emit("Join_Game",{
        gameid : "game1771768867412",
        playerid :"A"
    })
    setTimeout(()=>{
        socket.emit("Submit_answer",{
            gameid : "game1771768867412",
            playerid : "A",
            questionid : "1",
            answer : "OptionA"
        })
    },3000)

})

socket.on("answer_recived",(data)=>[
    console.log("update :",data)
])