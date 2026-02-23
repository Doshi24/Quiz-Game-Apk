import QuestionCard from "../component/QuestionCard.jsx";
import ScoreBoard from "../component/ScoreButtion.jsx";
import Timer from "../component/Timer.jsx";
import { Box, Stack } from "@mui/material";

export default function Quiz({ question, scores, gameid,playerid }) {

  if (!question) return <h2>Waiting for question...</h2>;

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
      <Stack
        spacing={3}
        sx={{
          width: 450,
          textAlign: "center"
        }}
      >
        <ScoreBoard scores={scores} />
        <Timer questionId={question.id} />

        <QuestionCard
          question={question}
          gameid={gameid}
          playerid={playerid}
        />
      </Stack>
    </Box>
  );
}