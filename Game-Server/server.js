import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import { GameScoket } from "../Game-Server/socket/Game.socket.js"
const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin : "*",
        methods :["GET","POST"]
    }
})
GameScoket(io)

app.get('/testapi',(req,res)=>{
    res.send("quiz Game Server is ready")
})

const PORT = 3000
const startServer = async () => {

    // const game = await startGameSession(
    //     [
    //         { playerId: "A" },
    //         { playerId: "B" }
    //     ],
    //     "easy"
    // )

    // console.log("GAME CREATED:", game.gameid)

    server.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
}

startServer()