export const GenerateQuiz =  async (level)=>{

    const diffuciltyMap = {
        easy : "easy",
        medium : "medium",
        hard : "hard"
    }

    const diffucilty = diffuciltyMap[level]
    console.log("LEVEL RECEIVED:", level)

    const url= `https://opentdb.com/api.php?amount=10&difficulty=${diffucilty}&type=multiple`

    const response = await fetch(url)
    const data = await response.json()

    const questions = data.results.map((q,index)=>{
        const options   = [...q.incorrect_answers, q.correct_answer].sort(()=>Math.random()-0.5)

        return {
            id : index+1,
            question : q.question,
            options,
            correctanswers : q.correct_answer
        }
    })
    return questions
}