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
        origin : "http://localhost:5173"
    }
})
GameScoket(io)

app.get('/testapi',(req,res)=>{
    res.send("quiz Game Server is ready")
})

const PORT = 3000
server.listen(PORT,()=>{
    console.log(`server running on port ${PORT} `)
})
