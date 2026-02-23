import { Box, Paper, Typography, Button, Stack } from "@mui/material";

export default function Result({ winner, scores }) {

  const getMessage = () => {
    if (winner === "Draw")
      return " It's a Draw! Both minds equally powerful!";

    return " Hurry! You defeated your friend!\nYou are the MASTER OF QUIZ 🧠👑";
  };

  return (
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
      <Paper elevation={5} sx={{ p: 5, textAlign: "center", width: 450 }}>

        <Typography variant="h3" gutterBottom>
           Game Finished
        </Typography>

        <Typography variant="h5" color="success.main" whiteSpace="pre-line">
          {getMessage()}
        </Typography>

        <Typography variant="h6" mt={3}>
           Winner: {winner}
        </Typography>

        <Stack spacing={1} mt={3}>
          {Object.entries(scores).map(([player, score]) => (
            <Typography key={player}>
              {player} : {score}
            </Typography>
          ))}
        </Stack>

        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => {
            localStorage.removeItem("playerid"); 
            localStorage.removeItem("gameid")
            window.location.reload();}}
        >
          🔁 Play Again
        </Button>

      </Paper>
    </Box>
  );
}