
export const watingplayes = {
    easy : [],
    medium : [],
    hard : []
}

export const activeGames = new Map()

export const addPlayersToQueues = (level,player)=>{
    watingplayes[level].push(player)
}

export const RemovePlayersFromQueues = (level)=>{
     return watingplayes[level].shift()
}


export const CreateGameSession = (gameId,gameData)=>{
    activeGames.set(gameId,gameData)
}


export const StoreGameSession = (gameId)=>{
    return activeGames.get(gameId)
}


export const RemoveGameSession = (gameId)=>{
    activeGames.delete(gameId)
}
