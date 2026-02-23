import { useEffect, useState } from "react";
import { socket } from "../socket/GameSocket.js";
import { Button, Card, Typography,Stack } from "@mui/material";


export default function QuestionCard({ question,gameid,playerid }) {

  const [locked, setLocked] = useState(false);

  useEffect(()=>{
    setLocked(false)
  },[question.id])

  const submitAnswer = (option) => {

    if (locked) return;

    setLocked(true)

    socket.emit("Submit_answer", {
      gameid: gameid,
      playerid: playerid,
      questionid: question.id,
      answer: option
    });
  };

  return (
    <Card
      sx={{
        padding: 4,
        width: "100%",
        textAlign: "center",
        borderRadius: 3,
        boxShadow: 4
      }}
    >
      <Typography variant="h5" mb={3}>
        {question.question}
      </Typography>

      <Stack spacing={2}>
        {question.options.map((opt, i) => (
          <Button
            key={i}
            variant="contained"
            disabled={locked}
            onClick={() => submitAnswer(opt)}
            fullWidth
            sx={{
              padding: 1.5,
              fontSize: "16px"
            }}
          >
            {opt}
          </Button>
        ))}
      </Stack>
    </Card>
  );
}