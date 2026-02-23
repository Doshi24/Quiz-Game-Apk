    import { useState, useEffect } from "react";
    import Join from "./pages/Join";
    import Quiz from "./pages/Quiz";
    import Result from "./Pages/Result";
    import { socket } from "./socket/GameSocket.js";
    import { Box, Paper, Typography, Stack } from "@mui/material";

    export default function App() {

      const [screen, setScreen] = useState("join");
      const [gameData, setGameData] = useState({});
      const [question, setQuestion] = useState(null);
      const [scores, setScores] = useState({});
      const [winner, setWinner] = useState(null);

      useEffect(() => {

        socket.on("connect",()=>{
          console.log("Frontend Connected", socket.id)
        })

        socket.on("Game_Started", (data) => {
          console.log("🔥 Game Started received");
          setScreen("quiz");
        });

        socket.on("new_questions", (data) => {
          console.log("question comming", data)
          setQuestion(data.question);
        });

        socket.on("score_update", (data) => {
          setScores(data.scores);
        });

        socket.on("Game_finished", (data) => {
          setWinner(data.winner);
          setScores(data.scores);
          setScreen("result");
        });

        const savedplayer = localStorage.getItem("playerid");
        const savedgame = localStorage.getItem("gameid");
        

        if (savedgame && savedplayer) {

        setGameData({
        playerid: savedplayer,
        gameid: savedgame
        });
        socket.emit("Join_Game", {
        gameid: savedgame,
        playerid: savedplayer
        });

        setScreen("waiting");
        }

        return () => {
          socket.off("Game_Started")
          socket.off("new_questions")
          socket.off("score_update")
          socket.off("Game_finished")
        };

      }, []);
      if(screen === "waiting") 
        return  (
      <Box
        sx={{
          height: "100vh",          // full screen height
          width: "100vw",
          display: "flex",
          justifyContent: "center", // LEFT-RIGHT CENTER
          alignItems: "center",     // TOP-BOTTOM CENTER
          backgroundColor: "#f4f6f8"
        }}
      >
        <Paper elevation={4} sx={{ p: 5, textAlign: "center", width: 420 }}>
          
          <Typography variant="h4" gutterBottom>
            Waiting for Players...
          </Typography>

          <Typography variant="h6" color="primary">
            Game ID: {gameData.gameid}
          </Typography>

          <Stack spacing={1} mt={3} textAlign="left">

            <Typography>📜 Rules:</Typography>
            <Typography>• Game starts automatically when 2 players join</Typography>
            <Typography>• Each question has 10 seconds</Typography>
            <Typography>• Faster answers = better chance to win</Typography>
            <Typography>• No answer = 0 points</Typography>

          </Stack>

          <Typography mt={3} color="success.main">
            ⏳ Game will start immediately once opponent joins!
          </Typography>

        </Paper>
      </Box>
    );
      if (screen === "join")
        return <Join setScreen={setScreen} setGameData={setGameData} />;

      if (screen === "quiz")
        return <Quiz question={question} scores={scores} gameid={gameData.gameid}  playerid={gameData.playerid} />;

      if (screen === "result")
        return <Result winner={winner} scores={scores} />;
    }