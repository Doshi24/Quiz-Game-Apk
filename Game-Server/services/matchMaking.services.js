import { watingplayes,addPlayersToQueues,RemovePlayersFromQueues } from "../store/memoryStore.js";

export const findMatch = (player,level)=>{

    const queue = watingplayes[level]

    if(queue.length > 0){
        const matchedPlayers = RemovePlayersFromQueues(level)

        return{
        matched : true,
        player : [matchedPlayers,player]
    }
    }
    addPlayersToQueues(level,player)
    return {
        matched : false,
        message : "wating for player to join"
    }
}