import { io } from "socket.io-client";

const gameid = "game1771777325794";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Player B joined");

    socket.emit("Join_Game", {
        gameid: gameid,
        playerid: "B"
    });
});


// GAME START EVENT
socket.on("Game_Started", (data) => {
    console.log("Game Started");
    console.log("Questions:", data.questions);
});


// NEW QUESTION EVENT
socket.on("new_questions", (data) => {

    console.log("Question:", data.question.question);

    setTimeout(() => {
        socket.emit("Submit_answer", {
            gameid: gameid,
            playerid: "B",
            questionid: data.question.id,
            answer: data.question.options[0]
        });
    }, 2000);
});


// SCORE UPDATE
socket.on("score_update",(data)=>{
    console.log("Scores:", data);
});