import { useState, useEffect } from "react";
import { socket } from "../socket/GameSocket.js";
import {Button,TextField,Container,Stack,MenuItem, Select,InputLabel,FormControl,Box,Typography
} from "@mui/material";

export default function Join({ setScreen, setGameData }) {

  const [gameid, setGameid] = useState("");
  const [playerid, setPlayerid] = useState(localStorage.getItem("playerid") || "");
  const [level, setLevel] = useState("easy");


  /* ===============================
     LISTEN SERVER EVENTS
  =============================== */
  useEffect(() => {

    // when host creates game
    socket.on("game_created", ({ gameid }) => {
      console.log("Game created:", gameid);

      localStorage.setItem("gameid",gameid)

      setGameData({
        gameid,
        playerid
      });

      setScreen("waiting");
    });

    // optional error listener
    socket.on("error", (err) => {
      console.log("Server Error:", err.message);
      alert(err.message);
    });

    return () => {
      socket.off("game_created");
      socket.off("error");
    };

  }, [playerid, setGameData, setScreen]);

  /* ===============================
     CREATE GAME (PLAYER 1)
  =============================== */
  const createGame = () => {

    if (!playerid) {
      alert("Enter Player ID");
      return;
    }
    localStorage.setItem("playerid", playerid);
    socket.emit("create_game", {
      playerid,
      level
    });
  };

  /* ===============================
     JOIN GAME (PLAYER 2)
  =============================== */
  const joinGame = () => {

    if (!gameid || !playerid) {
      alert("Enter Game ID & Player ID");
      return;
    }
    localStorage.setItem("playerid",playerid)
    localStorage.setItem("gameid",gameid)
    
    socket.emit("Join_Game", {
      gameid,
      playerid
    });

    setGameData({
      gameid,
      playerid
    });

    // setScreen("waiting");
  };

  /* ===============================
     UI
  =============================== */
  return (
  <Box
  sx={{
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8"
  }}
>
    <Container maxWidth="sm">

      <Stack spacing={3}>

        <Typography variant="h4" textAlign="center" color="black">
           Join Quiz Game
        </Typography>

        <TextField
          label="Player ID"
          fullWidth
          value={playerid}
          onChange={(e) => {
          const value = e.target.value;
          setPlayerid(value);
          localStorage.setItem("playerid", value);}}
        />

        <TextField
          label="Game ID (Only for Join)"
          fullWidth
          value={gameid}
          onChange={(e) => setGameid(e.target.value)}
        />

        {/* ✅ LEVEL SELECTOR */}
        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={level}
            label="Difficulty"
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="easy" >Easy </MenuItem>
            <MenuItem value="medium" >Medium </MenuItem>
            <MenuItem value="hard" >Hard </MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={createGame}>
          Create Game (Host)
        </Button>

        <Button variant="outlined" onClick={joinGame}>
          Join Game
        </Button>

      </Stack>

    </Container>
  </Box>
);
  
}